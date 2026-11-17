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

export type AuthPayload = {
    id: string;
    email: string;
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
