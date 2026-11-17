import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "@/lib/utils";
import { normalizeTagInputs } from "@/lib/snippet-tags";

describe("slugify & tag normalization", () => {
    it("converts titles into clean URL-safe slugs", () => {
        assert.equal(slugify("  Hello, World! Next.js 16  "), "hello-world-nextjs-16");
        assert.equal(slugify("React---Custom___Hook"), "react-customhook");
        assert.equal(slugify("!!!"), "snippet");
    });

    it("truncates slugs to at most 50 characters", () => {
        const longTitle = "a".repeat(80);
        assert.equal(slugify(longTitle).length, 50);
    });

    it("deduplicates and normalizes tag inputs", () => {
        const tags = normalizeTagInputs([" React ", "react", "TypeScript", "", "Next.js"]);
        assert.deepEqual(tags, [
            { name: "react", slug: "react" },
            { name: "typescript", slug: "typescript" },
            { name: "next.js", slug: "nextjs" },
        ]);
    });
});
