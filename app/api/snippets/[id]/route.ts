import { supabase } from "@/lib/supabase";
import { authGuard } from "@/middleware/auth-guard";
import { generateUniqueSlug } from "@/lib/utils";
import { snippetSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    const payload = authGuard(request);

    if (!payload) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id } = await params;

    const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("id", id)
        .eq("user_id", payload.id)
        .maybeSingle();

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    if (!data) {
        return NextResponse.json(
            { error: "Snippet not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { snippet: data },
        { status: 200 }
    );
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const payload = authGuard(request);

    if (!payload) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id } = await params;

    const body = await request.json();

    const validation = snippetSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            {
                message: "Validation failed",
                error: validation.error.flatten(),
            },
            {
                status: 400,
            }
        );
    }

    const existing = await supabase
        .from("snippets")
        .select("*")
        .eq("id", id)
        .eq("user_id", payload.id)
        .single();

    if (existing.error || !existing.data) {
        return NextResponse.json(
            { error: "Snippet not found" },
            { status: 404 }
        );
    }

    const {title, description, code, language, is_public} = validation.data;

    let slug = existing.data.slug;

    if (is_public && title !== existing.data.title) {
        slug = await generateUniqueSlug(title);
    }

    if (is_public) {
        const shouldGenerateSlug = !existing.data.slug || title !== existing.data.title;

        if (shouldGenerateSlug) {
            slug = await generateUniqueSlug(title);
        }
    } else {
        slug = null;
    }

    const { data, error } = await supabase
        .from("snippets")
        .update({
            title,
            description,
            code,
            language,
            is_public,
            slug,
        })
        .eq("id", id)
        .eq("user_id", payload.id)
        .select()
        .maybeSingle();

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            message: "Snippet updated successfully",
            snippet: data,
        },
        {
            status: 200,
        }
    );
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const payload = authGuard(request);

    if (!payload) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id } = await params;

    const { error } = await supabase
        .from("snippets")
        .delete()
        .eq("id", id)
        .eq("user_id", payload.id);

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return new NextResponse(null, {
        status: 204,
    });
}