import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

describe("proxy route guard and security headers", () => {
    it("redirects unauthenticated access to /dashboard toward /login with redirect query", () => {
        const req = new NextRequest("http://localhost:3000/dashboard");
        const res = proxy(req);

        assert.equal(res.status, 307);
        assert.equal(
            res.headers.get("location"),
            "http://localhost:3000/login?redirect=%2Fdashboard"
        );
        assert.equal(res.headers.get("X-Content-Type-Options"), "nosniff");
        assert.equal(res.headers.get("X-Frame-Options"), "DENY");
    });

    it("redirects authenticated user on /login to /dashboard", () => {
        const req = new NextRequest("http://localhost:3000/login", {
            headers: { cookie: "kodelaci_token=dummy-token" },
        });
        const res = proxy(req);

        assert.equal(res.status, 307);
        assert.equal(res.headers.get("location"), "http://localhost:3000/dashboard");
    });

    it("allows public pages with security headers", () => {
        const req = new NextRequest("http://localhost:3000/s/example-slug");
        const res = proxy(req);

        assert.equal(res.status, 200);
        assert.equal(res.headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
    });
});
