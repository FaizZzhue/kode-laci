import { supabase } from "@/lib/supabase";
import { authGuard } from "@/middleware/auth-guard";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    const payload = authGuard(request);
    if(!payload) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const { id } = await params;

    const { data: snippet, error: insertError, } = await supabase
        .from("snippets")
        .select("id, user_id, title, description, code, language")
        .eq("id", id)
        .eq("is_public", true)
        .maybeSingle();

    if(insertError) {
        return NextResponse.json(
            { error: insertError.message },
            { status: 500}
        )
    }

    if (!snippet) {
        return NextResponse.json(
            { error: "Snippet not found" },
            { status: 404 }
        )
    }

    if (snippet.user_id === payload.id) {
        return NextResponse.json(
            { error: "You cannot fork your own snippet" },
            { status: 403 }
        )
    }

    const { data, error } = await supabase
        .from("snippets")
        .insert({
            user_id: payload.id,
            title: snippet.title,
            description: snippet.description,
            code: snippet.code,
            language: snippet.language,
            is_public: false,
            slug: null,
            forked_from: snippet.id,
        })
        .select("id, title, description, language, is_public, slug, forked_from, created_at")
        .single();
    
    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            message: "Snippet forked successfully",
            snippet: data,
        },
        { status: 201 }
    );
}