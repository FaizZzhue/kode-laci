import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { errorResponse, okResponse } from "@/lib/api-response";
import { getTagsBySnippetIds } from "@/lib/snippet-tags";

interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
    const { slug } = await params;

    if (!slug || !slug.trim()) {
        return errorResponse("Invalid snippet slug", 400);
    }

    const { data, error } = await supabase
        .from("snippets")
        .select("id, title, description, code, language, is_public, slug, forked_from, created_at, updated_at, author:users(username, avatar_url)")
        .eq("slug", slug.trim())
        .eq("is_public", true)
        .maybeSingle();

    if (error) {
        console.error("Fetch public snippet by slug failed:", error);
        return errorResponse("Failed to fetch snippet", 500);
    }

    if (!data) {
        return errorResponse("Snippet not found", 404);
    }

    const [tagMap, { count: forkCount }] = await Promise.all([
        getTagsBySnippetIds([data.id]),
        supabase
            .from("snippets")
            .select("id", { count: "exact", head: true })
            .eq("forked_from", data.id),
    ]);

    return okResponse({
        snippet: {
            ...data,
            author: Array.isArray(data.author) ? (data.author[0] ?? null) : data.author,
            tags: tagMap.get(data.id) ?? [],
            fork_count: forkCount ?? 0,
        },
    });
}
