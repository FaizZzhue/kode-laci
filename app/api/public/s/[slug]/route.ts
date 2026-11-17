import { NextRequest } from "next/server";
import { errorResponse, okResponse } from "@/lib/api-response";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getPublicSnippetBySlug } from "@/lib/public-snippets";

interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    const rateLimited = enforceRateLimit(request, "public:snippet-detail", {
        limit: 60,
        windowMs: 60 * 1000,
    });
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
