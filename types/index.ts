import type { ReactNode } from "react";

export type User = {
    id: string;
    username: string;
    email: string;
    avatar_url: string | null;
    created_at: string;
};

export type PublicAuthor = {
    username: string;
    avatar_url: string | null;
};

export type Tag = {
    id: string;
    name: string;
    slug: string;
};

export type Snippet = {
    id: string;
    user_id?: string;
    forked_from: string | null;
    title: string;
    description: string;
    code?: string;
    language: string;
    is_public: boolean;
    slug: string | null;
    created_at: string;
    updated_at?: string;
    tags?: Tag[];
    author?: PublicAuthor | null;
};

export type PublicSnippetDetail = Snippet & {
    code: string;
    fork_count: number;
    author: PublicAuthor | null;
};

export type VisibilityFilter = "all" | "public" | "private";

export type SnippetFilters = {
    q?: string;
    language?: string;
    tag?: string;
    visibility?: VisibilityFilter;
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

export type SnippetQueryState = {
    settledKey: string | null;
    snippets: Snippet[];
    meta: PaginationMeta | null;
    error: string | null;
};

export type AuthPayload = {
    id: string;
    email: string;
};

export type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setSessionUser: (user: User) => void;
    logout: (redirect?: boolean) => Promise<void>;
    refreshSession: () => Promise<void>;
};

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    errors?: Record<string, string[] | undefined>;
    meta?: PaginationMeta;
};

export type PostgrestLikeError = {
    code?: string;
    message?: string;
};

export type RateLimitEntry = {
    count: number;
    resetAt: number;
};

export type RateLimitConfig = {
    limit: number;
    windowMs: number;
};

export type SnippetTagRow = {
    snippet_id: string;
    tag: Tag | Tag[] | null;
};

export type LanguageOption = {
    value: string;
    label: string;
};

export type DrawerSampleTab = {
    id: string;
    filename: string;
    langLabel: string;
    slug: string | null;
    isPublic: boolean;
    tags: string[];
    lines: string[];
};

export type SearchPresetItem = {
    query: string;
    matchedBy: string[];
    resultTitle: string;
    lang: string;
};

export type DrawerNavItem = {
    label: string;
    value: VisibilityFilter;
    href: string;
};

export type RouteIdParams = {
    params: Promise<{
        id: string;
    }>;
};

export type RouteSlugParams = {
    params: Promise<{
        slug: string;
    }>;
};

export type ChildrenProps = {
    children: ReactNode;
};
