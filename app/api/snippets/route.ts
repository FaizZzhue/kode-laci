import { supabase } from "@/lib/supabase";
import { generateUniqueSlug } from "@/lib/utils";
import { snippetSchema } from "@/lib/validations";
import { authGuard } from "@/middleware/auth-guard";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const payload = authGuard(request);
    if (!payload) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const {data, error} = await supabase 
        .from("snippets")
        .select("id, title, description, language, is_public, slug, created_at")
        .eq("user_id", payload.id)
        .order("created_at", {ascending: false});
    if (error) {
        return NextResponse.json(
            {error: error.message},
            {status: 500},
        );
    }
    return NextResponse.json(
        { snippets: data },
        { status: 200 }
    );
}

export async function POST(request: NextRequest) {
    const payload = authGuard(request);
    if (!payload) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 },
        )
    }

    const body = await request.json();
    const validation = snippetSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            { 
                message: "Validation failed",
                error: validation.error.flatten(),
            },
            { status: 400 }
        )
    }

    const {title, description, code, language, is_public} = validation.data;

    let slug: string | null = null;

    if (is_public) {
        slug = await generateUniqueSlug(title);
    }

    const { data, error } = await supabase 
        .from("snippets")
        .insert({
            user_id: payload.id,
            title,
            description,
            code,
            language,
            is_public,
            slug,
            // tags,
        })
        .select("id, title, description, language, is_public, slug, created_at")
        .single();
    if (error) {
        return NextResponse.json(
            {error: error.message},
            {status: 500},
        )
    }
    
    return NextResponse.json(
        {
            message: "Snippet created successfully",
            snippet: data
        },
        {status: 201}
    )
}