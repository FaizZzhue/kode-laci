import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { authGuard } from "@/middleware/auth-guard";
import { generateUniqueSlug } from "@/lib/slug";
import { snippetSchema, uuidSchema } from "@/lib/validations";
import { errorResponse, mapDatabaseErrorMessage, okResponse } from "@/lib/api-response";
import { getTagsBySnippetIds, syncSnippetTags } from "@/lib/snippet-tags";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    const payload = authGuard(request);
    if (!payload) {
        return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    if (!uuidSchema.safeParse(id).success) {
        return errorResponse("Invalid snippet ID", 400);
    }

    const { data, error } = await supabase
        .from("snippets")
        .select("id, user_id, forked_from, title, description, code, language, is_public, slug, created_at, updated_at")
        .eq("id", id)
        .eq("user_id", payload.id)
        .maybeSingle();

    if (error) {
        console.error("Fetch snippet detail failed:", error);
        return errorResponse("Failed to fetch snippet", 500);
    }

    if (!data) {
        return errorResponse("Snippet not found", 404);
    }

    const tagMap = await getTagsBySnippetIds([data.id]);

    return okResponse({
        snippet: {
            ...data,
            tags: tagMap.get(data.id) ?? [],
        },
    });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const payload = authGuard(request);
    if (!payload) {
        return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    if (!uuidSchema.safeParse(id).success) {
        return errorResponse("Invalid snippet ID", 400);
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return errorResponse("Invalid JSON payload", 400);
    }

    const validation = snippetSchema.safeParse(body);
    if (!validation.success) {
        return errorResponse(
            "Validation failed",
            400,
            validation.error.flatten().fieldErrors
        );
    }

    const { data: existing, error: existingError } = await supabase
        .from("snippets")
        .select("id, title, slug")
        .eq("id", id)
        .eq("user_id", payload.id)
        .maybeSingle();

    if (existingError) {
        console.error("Fetch existing snippet failed:", existingError);
        return errorResponse("Failed to update snippet", 500);
    }

    if (!existing) {
        return errorResponse("Snippet not found", 404);
    }

    const { title, description, code, language, is_public, tags } = validation.data;

    try {
        let nextSlug: string | null = null;
        if (is_public) {
            const needsNewSlug = !existing.slug || title !== existing.title;
            nextSlug = needsNewSlug ? await generateUniqueSlug(title) : existing.slug;
        }

        const { data, error } = await supabase
            .from("snippets")
            .update({
                title,
                description,
                code,
                language,
                is_public,
                slug: nextSlug,
            })
            .eq("id", id)
            .eq("user_id", payload.id)
            .select("id, user_id, forked_from, title, description, code, language, is_public, slug, created_at, updated_at")
            .maybeSingle();

        if (error || !data) {
            console.error("Update snippet failed:", error);
            return errorResponse("Failed to update snippet", 500);
        }

        const nextTags = tags !== undefined
            ? await syncSnippetTags(data.id, tags)
            : ((await getTagsBySnippetIds([data.id])).get(data.id) ?? []);

        return okResponse(
            {
                snippet: {
                    ...data,
                    tags: nextTags,
                },
            },
            { message: "Snippet updated successfully" }
        );
    } catch (error) {
        console.error("[PUT /api/snippets/[id]] Update snippet error:", error);
        return errorResponse(mapDatabaseErrorMessage(error, "Failed to update snippet"), 500);
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const payload = authGuard(request);
    if (!payload) {
        return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    if (!uuidSchema.safeParse(id).success) {
        return errorResponse("Invalid snippet ID", 400);
    }

    const { data, error } = await supabase
        .from("snippets")
        .delete()
        .eq("id", id)
        .eq("user_id", payload.id)
        .select("id")
        .maybeSingle();

    if (error) {
        console.error("Delete snippet failed:", error);
        return errorResponse("Failed to delete snippet", 500);
    }

    if (!data) {
        return errorResponse("Snippet not found", 404);
    }

    return okResponse(null, { message: "Snippet deleted successfully" });
}
