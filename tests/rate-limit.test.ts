import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";

describe("enforceRateLimit", () => {
    it("allows requests within limit and returns 429 once exceeded", async () => {
        const scope = `test:scope:${Date.now()}`;
        const config = { limit: 2, windowMs: 60_000 };
        const req = new NextRequest("http://localhost:3000/api/auth/login", {
            headers: { "x-forwarded-for": "203.0.113.10" },
        });

        assert.equal(enforceRateLimit(req, scope, config), null);
        assert.equal(enforceRateLimit(req, scope, config), null);

        const blocked = enforceRateLimit(req, scope, config);
        assert.notEqual(blocked, null);
        assert.equal(blocked?.status, 429);
        assert.ok(blocked?.headers.get("Retry-After"));
        assert.equal(blocked?.headers.get("X-RateLimit-Limit"), "2");
        assert.equal(blocked?.headers.get("X-RateLimit-Remaining"), "0");

        const body = (await blocked?.json()) as { success: boolean; message: string };
        assert.equal(body.success, false);
    });

    it("isolates rate limit counters across different IPs", () => {
        const scope = `test:ip:${Date.now()}`;
        const config = { limit: 1, windowMs: 60_000 };

        const reqA = new NextRequest("http://localhost:3000/api/public/snippets", {
            headers: { "x-real-ip": "198.51.100.1" },
        });
        const reqB = new NextRequest("http://localhost:3000/api/public/snippets", {
            headers: { "x-real-ip": "198.51.100.2" },
        });

        assert.equal(enforceRateLimit(reqA, scope, config), null);
        assert.equal(enforceRateLimit(reqA, scope, config)?.status, 429);
        assert.equal(enforceRateLimit(reqB, scope, config), null);
    });
});
