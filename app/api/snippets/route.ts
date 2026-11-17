import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { authGuard } from "@/middleware/auth-guard";
import { generateUniqueSlug } from "@/lib/slug";
import { snippetListQuerySchema, snippetSchema } from "@/lib/validations";
import { errorResponse, mapDatabaseErrorMessage, okResponse } from "@/lib/api-response";
import { getSnippetIdsByTagSlug, getTagsBySnippetIds, syncSnippetTags } from "@/lib/snippet-tags";
import { resolveSnippetSearchFilter } from "@/lib/snippet-search";

export async function GET(request: NextRequest) {
    const payload = authGuard(request);
    if (!payload) {
        return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const queryValidation = snippetListQuerySchema.safeParse({
        q: searchParams.get("q") ?? undefined,
        language: searchParams.get("language") ?? undefined,
        tag: searchParams.get("tag") ?? undefined,
        visibility: searchParams.get("visibility") ?? undefined,
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

    const { q, language, tag, visibility, page, limit } = queryValidation.data;
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
            "id, title, description, language, is_public, slug, forked_from, created_at, updated_at",
            { count: "exact" }
        )
        .eq("user_id", payload.id);

    if (visibility === "public") {
        query = query.eq("is_public", true);
    } else if (visibility === "private") {
        query = query.eq("is_public", false);
    }

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
        console.error("[GET /api/snippets] Fetch user snippets failed:", error);
        return errorResponse(mapDatabaseErrorMessage(error, "Failed to fetch snippets"), 500);
    }

    const snippets = data ?? [];
    const tagMap = await getTagsBySnippetIds(snippets.map((item) => item.id));
    const enriched = snippets.map((item) => ({
        ...item,
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

export async function POST(request: NextRequest) {
    const payload = authGuard(request);
    if (!payload) {
        return errorResponse("Unauthorized", 401);
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return errorResponse("Invalid JSON payload", 400);
    }

    const validation = snippetSchema.safeParse(body);
    if (!validation.success) {
        return errorResponse(
            "Validation failed",
            400,
            validation.error.flatten().fieldErrors
        );
    }

    const { title, description, code, language, is_public, tags } = validation.data;
    let createdSnippetId: string | null = null;

    try {
        const slug = is_public ? await generateUniqueSlug(title) : null;

        const { data, error } = await supabase
            .from("snippets")
            .insert({
                user_id: payload.id,
                title,
                description,
                code,
                language,
                is_public,
                slug,
            })
            .select("id, title, description, code, language, is_public, slug, forked_from, created_at, updated_at")
            .single();

        if (error || !data) {
            console.error("[POST /api/snippets] Insert snippet failed:", error);
            return errorResponse(
                mapDatabaseErrorMessage(error, "Failed to create snippet"),
                500
            );
        }

        createdSnippetId = data.id;
        const syncedTags =
            tags && tags.length > 0
                ? await syncSnippetTags(data.id, tags, { skipDelete: true })
                : [];

        return okResponse(
            {
                snippet: {
                    ...data,
                    tags: syncedTags,
                },
            },
            {
                message: "Snippet created successfully",
                status: 201,
            }
        );
    } catch (error) {
        if (createdSnippetId) {
            await supabase.from("snippets").delete().eq("id", createdSnippetId);
        }
        console.error("[POST /api/snippets] Unexpected error:", error);
        return errorResponse(
            mapDatabaseErrorMessage(error, "Failed to create snippet"),
            500
        );
    }
}
