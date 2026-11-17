import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
    buildPrefixTsQuery,
    buildSnippetOrSearchFilter,
    extractSearchTokens,
    sanitizeIlikeTerm,
} from "@/lib/snippet-search";

describe("snippet search helpers", () => {
    it("extracts deduplicated lowercase tokens for partial prefix search", () => {
        assert.deepEqual(extractSearchTokens("  Reac  hook reac "), ["reac", "hook"]);
        assert.deepEqual(extractSearchTokens("next.js/app-router"), ["next", "js", "app", "router"]);
    });

    it("builds prefix tsquery with :* for each token", () => {
        assert.equal(buildPrefixTsQuery(["reac"]), "reac:*");
        assert.equal(buildPrefixTsQuery(["reac", "deb"]), "reac:* & deb:*");
        assert.equal(buildPrefixTsQuery([]), null);
    });

    it("strips PostgREST filter metacharacters from ilike terms", () => {
        assert.equal(sanitizeIlikeTerm("reac,id.eq(1)%*"), "reac id.eq 1");
        assert.equal(sanitizeIlikeTerm("  useDebounce  "), "useDebounce");
    });

    it("builds combined or-filter with fts prefix, ilike columns, and matched tag IDs", () => {
        const filter = buildSnippetOrSearchFilter("reac", ["uuid-1", "uuid-2"]);
        assert.equal(
            filter,
            "search_vector.fts(simple).reac:*,title.ilike.%reac%,description.ilike.%reac%,language.ilike.%reac%,code.ilike.%reac%,id.in.(uuid-1,uuid-2)"
        );
    });

    it("returns null when query has no searchable characters", () => {
        assert.equal(buildSnippetOrSearchFilter("!!!***"), null);
    });
});
