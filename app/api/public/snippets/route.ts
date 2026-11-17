import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { snippetListQuerySchema } from "@/lib/validations";
import { errorResponse, okResponse } from "@/lib/api-response";
import { getSnippetIdsByTagSlug, getTagsBySnippetIds } from "@/lib/snippet-tags";
import { resolveSnippetSearchFilter } from "@/lib/snippet-search";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
    const rateLimited = enforceRateLimit(request, "public:snippets", {
        limit: 60,
        windowMs: 60 * 1000,
    });
    if (rateLimited) {
        return rateLimited;
    }

    const { searchParams } = new URL(request.url);
    const queryValidation = snippetListQuerySchema.safeParse({
        q: searchParams.get("q") ?? undefined,
        language: searchParams.get("language") ?? undefined,
        tag: searchParams.get("tag") ?? undefined,
        page: searchParams.get("page") ?? undefined,
        limit: searchParams.get("limit") ?? undefined,
    });

    if (!queryValidation.success) {
        return errorResponse(
            "Invalid query parameters",
            400,
            queryValidation.error.flatten().fieldErrors
        );
    }

    const { q, language, tag, page, limit } = queryValidation.data;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let tagSnippetIds: string[] | null = null;
    if (tag) {
        tagSnippetIds = await getSnippetIdsByTagSlug(tag);
        if (tagSnippetIds.length === 0) {
            return okResponse(
                { snippets: [] },
                { meta: { page, limit, total: 0, totalPages: 0 } }
            );
        }
    }

    let query = supabase
        .from("snippets")
        .select(
            "id, title, description, language, is_public, slug, forked_from, created_at, updated_at, author:users(username, avatar_url)",
            { count: "exact" }
        )
        .eq("is_public", true);

    if (language) {
        query = query.eq("language", language);
    }

    if (tagSnippetIds) {
        query = query.in("id", tagSnippetIds);
    }

    if (q) {
        const orFilter = await resolveSnippetSearchFilter(q);
        if (orFilter) {
            query = query.or(orFilter);
        }
    }

    const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Fetch public snippets failed:", error);
        return errorResponse("Failed to fetch public snippets", 500);
    }

    const snippets = data ?? [];
    const tagMap = await getTagsBySnippetIds(snippets.map((item) => item.id));
    const enriched = snippets.map((item) => ({
        ...item,
        author: Array.isArray(item.author) ? (item.author[0] ?? null) : item.author,
        tags: tagMap.get(item.id) ?? [],
    }));

    const total = count ?? 0;

    return okResponse(
        { snippets: enriched },
        {
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    );
}
