import { MAX_SEARCH_TOKENS } from "@/constants/limits";
import { supabase } from "@/lib/supabase";

export function extractSearchTokens(rawQuery: string): string[] {
    const tokens = rawQuery
        .trim()
        .toLowerCase()
        .split(/[^a-z0-9_]+/)
        .filter(Boolean);

    return Array.from(new Set(tokens)).slice(0, MAX_SEARCH_TOKENS);
}

export function buildPrefixTsQuery(tokens: string[]): string | null {
    if (tokens.length === 0) {
        return null;
    }

    return tokens.map((token) => `${token}:*`).join(" & ");
}

export function sanitizeIlikeTerm(rawQuery: string): string {
    return rawQuery
        .trim()
        .replace(/[^a-zA-Z0-9 ._\-/]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 100);
}

export async function getSnippetIdsMatchingTagTokens(tokens: string[]): Promise<string[]> {
    if (tokens.length === 0) {
        return [];
    }

    const tagFilters = tokens.map((token) => `name.ilike.%${token}%`).join(",");
    const { data: tags, error: tagError } = await supabase
        .from("tags")
        .select("id")
        .or(tagFilters)
        .limit(20);

    if (tagError || !tags || tags.length === 0) {
        return [];
    }

    const { data: links, error: linkError } = await supabase
        .from("snippet_tags")
        .select("snippet_id")
        .in(
            "tag_id",
            tags.map((item) => item.id)
        )
        .limit(200);

    if (linkError || !links) {
        return [];
    }

    return Array.from(new Set(links.map((item) => item.snippet_id)));
}

export function buildSnippetOrSearchFilter(
    rawQuery: string,
    tagMatchedSnippetIds: string[] = []
): string | null {
    const tokens = extractSearchTokens(rawQuery);
    const tsQuery = buildPrefixTsQuery(tokens);
    const safeTerm = sanitizeIlikeTerm(rawQuery);

    const conditions: string[] = [];

    if (tsQuery) {
        conditions.push(`search_vector.fts(simple).${tsQuery}`);
    }

    if (safeTerm) {
        conditions.push(
            `title.ilike.%${safeTerm}%`,
            `description.ilike.%${safeTerm}%`,
            `language.ilike.%${safeTerm}%`,
            `code.ilike.%${safeTerm}%`
        );
    }

    if (tagMatchedSnippetIds.length > 0) {
        conditions.push(`id.in.(${tagMatchedSnippetIds.join(",")})`);
    }

    return conditions.length > 0 ? conditions.join(",") : null;
}

export async function resolveSnippetSearchFilter(rawQuery: string): Promise<string | null> {
    const tokens = extractSearchTokens(rawQuery);
    const tagMatchedIds = await getSnippetIdsMatchingTagTokens(tokens);
    return buildSnippetOrSearchFilter(rawQuery, tagMatchedIds);
}
