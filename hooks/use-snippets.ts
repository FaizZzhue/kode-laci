"use client";

import { useCallback, useEffect, useState } from "react";
import { extractApiError, fetchMySnippetById, fetchSnippetsList } from "@/lib/snippet-api";
import type { Snippet, SnippetFilters, SnippetQueryState } from "@/types";

function useSnippetQuery(
    endpoint: string,
    filters: SnippetFilters,
    fallbackError: string
) {
    const [reloadTick, setReloadTick] = useState(0);
    const { q, language, tag, visibility, page = 1, limit = 20 } = filters;

    const requestKey = JSON.stringify({
        endpoint,
        q: q ?? "",
        language: language ?? "",
        tag: tag ?? "",
        visibility: visibility ?? "",
        page,
        limit,
        reloadTick,
    });

    const [state, setState] = useState<SnippetQueryState>({
        settledKey: null,
        snippets: [],
        meta: null,
        error: null,
    });

    useEffect(() => {
        let active = true;

        fetchSnippetsList(endpoint, { q, language, tag, visibility, page, limit })
            .then((data) => {
                if (!active) return;
                setState({
                    settledKey: requestKey,
                    snippets: data.data?.snippets ?? [],
                    meta: data.meta ?? null,
                    error: null,
                });
            })
            .catch((err) => {
                if (!active) return;
                setState((prev) => ({
                    ...prev,
                    settledKey: requestKey,
                    error: extractApiError(err, fallbackError),
                }));
            });

        return () => {
            active = false;
        };
    }, [endpoint, q, language, tag, visibility, page, limit, requestKey, fallbackError]);

    const refetch = useCallback(() => {
        setReloadTick((n) => n + 1);
    }, []);

    return {
        snippets: state.snippets,
        meta: state.meta,
        isLoading: state.settledKey !== requestKey,
        error: state.error,
        refetch,
    };
}

export function useMySnippets(filters: SnippetFilters) {
    return useSnippetQuery("/snippets", filters, "Gagal memuat daftar snippet.");
}

export function usePublicSnippets(filters: Omit<SnippetFilters, "visibility">) {
    return useSnippetQuery(
        "/public/snippets",
        { ...filters, limit: filters.limit ?? 12 },
        "Gagal memuat snippet publik."
    );
}

export function useMySnippetDetail(id: string) {
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        fetchMySnippetById(id)
            .then((data) => {
                if (active) {
                    setSnippet(data);
                }
            })
            .catch((err) => {
                if (active) {
                    setError(extractApiError(err, "Gagal memuat detail snippet."));
                }
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [id]);

    return { snippet, setSnippet, isLoading, error };
}
