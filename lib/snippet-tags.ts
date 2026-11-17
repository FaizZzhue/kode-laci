import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { Tag } from "@/types";

type SnippetTagRow = {
    snippet_id: string;
    tag: Tag | Tag[] | null;
};

export function normalizeTagInputs(tags: string[] = []): Array<{ name: string; slug: string }> {
    const seen = new Set<string>();
    const normalized: Array<{ name: string; slug: string }> = [];

    for (const raw of tags) {
        const name = raw.trim().toLowerCase();
        const slug = slugify(name);
        if (!name || !slug || seen.has(slug)) {
            continue;
        }
        seen.add(slug);
        normalized.push({ name: name.slice(0, 30), slug: slug.slice(0, 35) });
    }

    return normalized;
}

export async function syncSnippetTags(snippetId: string, rawTags: string[] = []): Promise<Tag[]> {
    const normalized = normalizeTagInputs(rawTags);

    const { error: deleteError } = await supabase
        .from("snippet_tags")
        .delete()
        .eq("snippet_id", snippetId);

    if (deleteError) {
        throw new Error(deleteError.message);
    }

    if (normalized.length === 0) {
        return [];
    }

    const { data: upsertedTags, error: upsertError } = await supabase
        .from("tags")
        .upsert(normalized, { onConflict: "slug" })
        .select("id, name, slug");

    if (upsertError || !upsertedTags) {
        throw new Error(upsertError?.message ?? "Failed to upsert tags");
    }

    const links = upsertedTags.map((tag) => ({
        snippet_id: snippetId,
        tag_id: tag.id,
    }));

    const { error: linkError } = await supabase
        .from("snippet_tags")
        .insert(links);

    if (linkError) {
        throw new Error(linkError.message);
    }

    return upsertedTags;
}

export async function getTagsBySnippetIds(snippetIds: string[]): Promise<Map<string, Tag[]>> {
    const tagMap = new Map<string, Tag[]>();
    if (snippetIds.length === 0) {
        return tagMap;
    }

    const { data, error } = await supabase
        .from("snippet_tags")
        .select("snippet_id, tag:tags(id, name, slug)")
        .in("snippet_id", snippetIds);

    if (error || !data) {
        return tagMap;
    }

    for (const row of data as SnippetTagRow[]) {
        const current = tagMap.get(row.snippet_id) ?? [];
        const tag = Array.isArray(row.tag) ? row.tag[0] : row.tag;
        if (tag) {
            current.push(tag);
            tagMap.set(row.snippet_id, current);
        }
    }

    return tagMap;
}

export async function getSnippetIdsByTagSlug(tagSlug: string): Promise<string[]> {
    const normalizedSlug = slugify(tagSlug);
    const { data: tag } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", normalizedSlug)
        .maybeSingle();

    if (!tag) {
        return [];
    }

    const { data: links } = await supabase
        .from("snippet_tags")
        .select("snippet_id")
        .eq("tag_id", tag.id);

    return (links ?? []).map((item) => item.snippet_id);
}
