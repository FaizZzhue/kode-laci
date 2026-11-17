import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { errorResponse, okResponse } from "@/lib/api-response";

describe("api-response helpers", () => {
    it("formats success responses consistently", async () => {
        const res = okResponse(
            { id: "123" },
            {
                message: "Created",
                status: 201,
                meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
            }
        );

        assert.equal(res.status, 201);
        const body = await res.json();
        assert.deepEqual(body, {
            success: true,
            message: "Created",
            data: { id: "123" },
            meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
        });
    });

    it("formats error responses consistently", async () => {
        const res = errorResponse("Validation failed", 400, { email: ["Invalid email"] });

        assert.equal(res.status, 400);
        const body = await res.json();
        assert.deepEqual(body, {
            success: false,
            message: "Validation failed",
            error: "Validation failed",
            errors: { email: ["Invalid email"] },
        });
    });
});
