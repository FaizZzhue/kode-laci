import { supabase } from "@/lib/supabase";
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
        .select("")
        .eq("user_id", payload.id)
        .order("created_at", {ascending: false});
    if (error) {
        return NextResponse.json(
            {error: error.message},
            {status: 500},
        );
    }
    
}