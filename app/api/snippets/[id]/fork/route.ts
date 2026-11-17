import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { authGuard } from "@/middleware/auth-guard";
import { uuidSchema } from "@/lib/validations";
import { errorResponse, okResponse } from "@/lib/api-response";
import { getTagsBySnippetIds, syncSnippetTags } from "@/lib/snippet-tags";
import { enforceRateLimit } from "@/lib/rate-limit";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    const payload = authGuard(request);
    if (!payload) {
        return errorResponse("Unauthorized", 401);
    }

    const rateLimited = enforceRateLimit(
        request,
        "snippets:fork",
        { limit: 20, windowMs: 60 * 1000 },
        payload.id
    );
    if (rateLimited) {
        return rateLimited;
    }

    const { id } = await params;
    if (!uuidSchema.safeParse(id).success) {
        return errorResponse("Invalid snippet ID", 400);
    }

    const { data: sourceSnippet, error: fetchError } = await supabase
        .from("snippets")
        .select("id, user_id, title, description, code, language")
        .eq("id", id)
        .eq("is_public", true)
        .maybeSingle();

    if (fetchError) {
        console.error("Fetch fork source failed:", fetchError);
        return errorResponse("Failed to fork snippet", 500);
    }

    if (!sourceSnippet) {
        return errorResponse("Snippet not found", 404);
    }

    if (sourceSnippet.user_id === payload.id) {
        return errorResponse("You cannot fork your own snippet", 403);
    }

    try {
        const { data: forked, error: insertError } = await supabase
            .from("snippets")
            .insert({
                user_id: payload.id,
                title: sourceSnippet.title,
                description: sourceSnippet.description,
                code: sourceSnippet.code,
                language: sourceSnippet.language,
                is_public: false,
                slug: null,
                forked_from: sourceSnippet.id,
            })
            .select("id, title, description, code, language, is_public, slug, forked_from, created_at, updated_at")
            .single();

        if (insertError || !forked) {
            console.error("Insert fork failed:", insertError);
            return errorResponse("Failed to fork snippet", 500);
        }

        const sourceTags = (await getTagsBySnippetIds([sourceSnippet.id])).get(sourceSnippet.id) ?? [];
        const copiedTags = sourceTags.length > 0
            ? await syncSnippetTags(forked.id, sourceTags.map((tag) => tag.name))
            : [];

        return okResponse(
            {
                snippet: {
                    ...forked,
                    tags: copiedTags,
                },
            },
            {
                message: "Snippet forked successfully",
                status: 201,
            }
        );
    } catch (error) {
        console.error("Fork snippet error:", error);
        return errorResponse("Failed to fork snippet", 500);
    }
}
