"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/api";
import type { ApiResponse, PaginationMeta, Snippet } from "@/types";

export type SnippetFilters = {
    q?: string;
    language?: string;
    tag?: string;
    visibility?: "all" | "public" | "private";
    page?: number;
    limit?: number;
};

export type SnippetPayload = {
    title: string;
    description: string;
    code: string;
    language: string;
    is_public: boolean;
    tags?: string[];
};

export function extractApiError(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string; error?: string } | undefined;
        return data?.message || data?.error || fallback;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}

type QueryState = {
    settledKey: string | null;
    snippets: Snippet[];
    meta: PaginationMeta | null;
    error: string | null;
};

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

    const [state, setState] = useState<QueryState>({
        settledKey: null,
        snippets: [],
        meta: null,
        error: null,
    });

    useEffect(() => {
        let active = true;

        api.get<ApiResponse<{ snippets: Snippet[] }>>(endpoint, {
            params: {
                ...(q ? { q } : {}),
                ...(language ? { language } : {}),
                ...(tag ? { tag } : {}),
                ...(visibility ? { visibility } : {}),
                page,
                limit,
            },
        })
            .then((response) => {
                if (!active) return;
                setState({
                    settledKey: requestKey,
                    snippets: response.data.data?.snippets ?? [],
                    meta: response.data.meta ?? null,
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

export async function fetchMySnippetById(id: string): Promise<Snippet> {
    const response = await api.get<ApiResponse<{ snippet: Snippet }>>(`/snippets/${id}`);
    if (!response.data.data?.snippet) {
        throw new Error("Snippet tidak ditemukan");
    }
    return response.data.data.snippet;
}

export async function createSnippet(payload: SnippetPayload): Promise<Snippet> {
    const response = await api.post<ApiResponse<{ snippet: Snippet }>>("/snippets", payload);
    if (!response.data.data?.snippet) {
        throw new Error("Gagal membuat snippet");
    }
    return response.data.data.snippet;
}

export async function updateSnippet(id: string, payload: SnippetPayload): Promise<Snippet> {
    const response = await api.put<ApiResponse<{ snippet: Snippet }>>(`/snippets/${id}`, payload);
    if (!response.data.data?.snippet) {
        throw new Error("Gagal memperbarui snippet");
    }
    return response.data.data.snippet;
}

export async function deleteSnippet(id: string): Promise<void> {
    await api.delete(`/snippets/${id}`);
}

export async function forkSnippet(id: string): Promise<Snippet> {
    const response = await api.post<ApiResponse<{ snippet: Snippet }>>(`/snippets/${id}/fork`);
    if (!response.data.data?.snippet) {
        throw new Error("Gagal melakukan fork snippet");
    }
    return response.data.data.snippet;
}
