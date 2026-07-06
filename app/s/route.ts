import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    const { slug } = await params;

    const { data, error } = await supabase
    .from("snippets")
    .select("id, title, description, code, language, slug, created_at, updated_at")
    .eq("slug", slug)
    .eq("is_public", true)
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