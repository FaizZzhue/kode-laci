import type { RateLimitConfig } from "@/types";

export const MAX_SLUG_ATTEMPTS = 5;
export const MAX_SEARCH_TOKENS = 8;
export const RATE_LIMIT_MAX_STORE_SIZE = 5000;

export const RATE_LIMIT_POLICIES = {
    AUTH_LOGIN: { limit: 10, windowMs: 15 * 60 * 1000 },
    AUTH_REGISTER: { limit: 5, windowMs: 15 * 60 * 1000 },
    PUBLIC_SNIPPETS: { limit: 60, windowMs: 60 * 1000 },
    PUBLIC_SNIPPET_DETAIL: { limit: 60, windowMs: 60 * 1000 },
    SNIPPET_FORK: { limit: 20, windowMs: 60 * 1000 },
} as const satisfies Record<string, RateLimitConfig>;
