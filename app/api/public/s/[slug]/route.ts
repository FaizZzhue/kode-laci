import { NextRequest } from "next/server";
import { RATE_LIMIT_POLICIES } from "@/constants/limits";
import { errorResponse, okResponse } from "@/lib/api-response";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getPublicSnippetBySlug } from "@/lib/public-snippets";
import type { RouteSlugParams } from "@/types";

export async function GET(request: NextRequest, { params }: RouteSlugParams) {
    const rateLimited = enforceRateLimit(
        request,
        "public:snippet-detail",
        RATE_LIMIT_POLICIES.PUBLIC_SNIPPET_DETAIL
    );
    if (rateLimited) {
        return rateLimited;
    }

    const { slug } = await params;
    if (!slug || !slug.trim()) {
        return errorResponse("Invalid snippet slug", 400);
    }

    try {
        const snippet = await getPublicSnippetBySlug(slug);
        if (!snippet) {
            return errorResponse("Snippet not found", 404);
        }

        return okResponse({ snippet });
    } catch (error) {
        console.error("Fetch public snippet by slug failed:", error);
        return errorResponse("Failed to fetch snippet", 500);
    }
}
