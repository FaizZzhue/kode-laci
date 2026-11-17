import axios from "axios";
import api from "@/lib/api";
import type { ApiResponse, Snippet, SnippetFilters, SnippetPayload, User } from "@/types";

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

export async function fetchCurrentUser(): Promise<User | null> {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data.data ?? null;
}

export async function loginRequest(email: string, password: string): Promise<User> {
    const response = await api.post<ApiResponse<{ user: User }>>("/auth/login", {
        email,
        password,
    });
    if (!response.data.data?.user) {
        throw new Error("Respons login tidak valid.");
    }
    return response.data.data.user;
}

export async function registerRequest(
    username: string,
    email: string,
    password: string
): Promise<User> {
    const response = await api.post<ApiResponse<{ user: User }>>("/auth/register", {
        username,
        email,
        password,
    });
    if (!response.data.data?.user) {
        throw new Error("Respons registrasi tidak valid.");
    }
    return response.data.data.user;
}

export async function logoutRequest(): Promise<void> {
    await api.post("/auth/logout");
}

export async function fetchSnippetsList(
    endpoint: string,
    filters: SnippetFilters
): Promise<ApiResponse<{ snippets: Snippet[] }>> {
    const { q, language, tag, visibility, page = 1, limit = 20 } = filters;
    const response = await api.get<ApiResponse<{ snippets: Snippet[] }>>(endpoint, {
        params: {
            ...(q ? { q } : {}),
            ...(language ? { language } : {}),
            ...(tag ? { tag } : {}),
            ...(visibility ? { visibility } : {}),
            page,
            limit,
        },
    });
    return response.data;
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
