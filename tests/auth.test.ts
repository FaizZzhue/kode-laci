import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, signToken, verifyToken } from "@/lib/auth";
import { authGuard } from "@/middleware/auth-guard";

describe("JWT auth & authGuard", () => {
    const sampleUser = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "dev@kodelaci.id",
    };

    it("signs and verifies valid JWT tokens", () => {
        const token = signToken(sampleUser);
        const decoded = verifyToken(token);
        assert.deepEqual(decoded, sampleUser);
    });

    it("returns null for tampered or invalid tokens", () => {
        const token = signToken(sampleUser);
        assert.equal(verifyToken(`${token}tampered`), null);
        assert.equal(verifyToken("not.a.jwt"), null);
    });

    it("extracts payload from HttpOnly cookie in authGuard", () => {
        const token = signToken(sampleUser);
        const request = new NextRequest("http://localhost:3000/api/auth/me", {
            headers: {
                cookie: `${AUTH_COOKIE_NAME}=${token}`,
            },
        });

        assert.deepEqual(authGuard(request), sampleUser);
    });

    it("falls back to Authorization Bearer header when cookie is absent", () => {
        const token = signToken(sampleUser);
        const request = new NextRequest("http://localhost:3000/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        assert.deepEqual(authGuard(request), sampleUser);
    });

    it("returns null when neither cookie nor valid Bearer header is present", () => {
        const request = new NextRequest("http://localhost:3000/api/auth/me");
        assert.equal(authGuard(request), null);
    });
});
