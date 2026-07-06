import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q");
    const language = searchParams.get("language");

    let query = supabase
        .from("snippets")
        .select("id, title, description, language, slug, created_at")
        .eq("is_public", true);

    if (language) {
        query = query.eq("language", language);
    }

    if (q) {
        query = query.textSearch("search_vector", q, {
            type: "websearch",
        });
    }

    const { data, error } = await query
        .order("created_at", {ascending: false})
        .limit(20);

    if (error) {
        return NextResponse.json(
            { error: error.message},
            { status: 500 }
        );
    }

    return NextResponse.json(
        { snippets: data },
        { status: 200 }
    );
}