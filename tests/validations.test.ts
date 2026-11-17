import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
    loginSchema,
    registerSchema,
    snippetListQuerySchema,
    snippetSchema,
    uuidSchema,
} from "@/lib/validations";

describe("validations schemas", () => {
    it("accepts valid registration input and normalizes email", () => {
        const result = registerSchema.safeParse({
            username: "Faiz_Dev-01",
            email: "  User@Example.COM ",
            password: "strongpassword123",
        });

        assert.equal(result.success, true);
        if (result.success) {
            assert.equal(result.data.email, "user@example.com");
            assert.equal(result.data.username, "Faiz_Dev-01");
        }
    });

    it("rejects username containing PostgREST filter characters", () => {
        const result = registerSchema.safeParse({
            username: "bad,user.eq(1)",
            email: "user@example.com",
            password: "strongpassword123",
        });

        assert.equal(result.success, false);
    });

    it("validates login credentials", () => {
        assert.equal(
            loginSchema.safeParse({ email: "dev@kodelaci.id", password: "password123" }).success,
            true
        );
        assert.equal(
            loginSchema.safeParse({ email: "invalid-email", password: "short" }).success,
            false
        );
    });

    it("validates snippet payload and normalizes language and tags", () => {
        const result = snippetSchema.safeParse({
            title: "  Debounce Hook  ",
            description: "Reusable React debounce hook with TypeScript generics",
            code: "export function useDebounce<T>(val: T) { return val; }",
            language: " TypeScript ",
            is_public: true,
            tags: [" React ", "Hooks"],
        });

        assert.equal(result.success, true);
        if (result.success) {
            assert.equal(result.data.title, "Debounce Hook");
            assert.equal(result.data.language, "typescript");
            assert.deepEqual(result.data.tags, ["react", "hooks"]);
        }
    });

    it("enforces max 10 tags on snippetSchema", () => {
        const result = snippetSchema.safeParse({
            title: "Too many tags",
            description: "Testing maximum allowed tag count validation",
            code: "console.log('hello world');",
            language: "javascript",
            is_public: false,
            tags: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11"],
        });

        assert.equal(result.success, false);
    });

    it("applies defaults and upper limit on snippetListQuerySchema", () => {
        const defaults = snippetListQuerySchema.safeParse({});
        assert.equal(defaults.success, true);
        if (defaults.success) {
            assert.equal(defaults.data.page, 1);
            assert.equal(defaults.data.limit, 20);
            assert.equal(defaults.data.visibility, "all");
        }

        const excessiveLimit = snippetListQuerySchema.safeParse({ limit: "999" });
        assert.equal(excessiveLimit.success, false);
    });

    it("validates UUID strings properly", () => {
        assert.equal(uuidSchema.safeParse("550e8400-e29b-41d4-a716-446655440000").success, true);
        assert.equal(uuidSchema.safeParse("not-a-uuid").success, false);
    });
});
