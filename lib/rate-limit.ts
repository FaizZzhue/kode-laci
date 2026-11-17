import { NextRequest, NextResponse } from "next/server";
import { RATE_LIMIT_MAX_STORE_SIZE } from "@/constants/limits";
import { errorResponse } from "@/lib/api-response";
import type { RateLimitConfig, RateLimitEntry } from "@/types";

const store = new Map<string, RateLimitEntry>();

function cleanupExpired(now: number) {
    if (store.size < RATE_LIMIT_MAX_STORE_SIZE) {
        return;
    }

    for (const [key, entry] of store.entries()) {
        if (entry.resetAt <= now) {
            store.delete(key);
        }
    }
}

export function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const firstIp = forwarded.split(",")[0]?.trim();
        if (firstIp) {
            return firstIp;
        }
    }

    const realIp = request.headers.get("x-real-ip")?.trim();
    if (realIp) {
        return realIp;
    }

    return "unknown";
}

// In-memory rate limiter untuk dev/single-instance; ganti backend store ke Redis/Upstash untuk multi-instance serverless.
export function enforceRateLimit(
    request: NextRequest,
    scope: string,
    config: RateLimitConfig,
    identifier?: string
): NextResponse | null {
    const now = Date.now();
    cleanupExpired(now);

    const key = `${scope}:${identifier ?? getClientIp(request)}`;
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
        store.set(key, {
            count: 1,
            resetAt: now + config.windowMs,
        });
        return null;
    }

    if (existing.count >= config.limit) {
        const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
        const response = errorResponse(
            "Terlalu banyak permintaan. Silakan coba lagi beberapa saat.",
            429
        );
        response.headers.set("Retry-After", String(retryAfterSeconds));
        response.headers.set("X-RateLimit-Limit", String(config.limit));
        response.headers.set("X-RateLimit-Remaining", "0");
        return response;
    }

    existing.count += 1;
    return null;
}
