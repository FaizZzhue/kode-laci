import { supabase } from "@/lib/supabase";
import { getTagsBySnippetIds } from "@/lib/snippet-tags";
import type { PublicSnippetDetail } from "@/types";

export async function getPublicSnippetBySlug(slug: string): Promise<PublicSnippetDetail | null> {
    const trimmed = slug.trim();
    if (!trimmed) {
        return null;
    }

    const { data, error } = await supabase
        .from("snippets")
        .select(
            "id, title, description, code, language, is_public, slug, forked_from, created_at, updated_at, author:users(username, avatar_url)"
        )
        .eq("slug", trimmed)
        .eq("is_public", true)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        return null;
    }

    const [tagMap, { count: forkCount }] = await Promise.all([
        getTagsBySnippetIds([data.id]),
        supabase
            .from("snippets")
            .select("id", { count: "exact", head: true })
            .eq("forked_from", data.id),
    ]);

    return {
        ...data,
        author: Array.isArray(data.author) ? (data.author[0] ?? null) : data.author,
        tags: tagMap.get(data.id) ?? [],
        fork_count: forkCount ?? 0,
    };
}
