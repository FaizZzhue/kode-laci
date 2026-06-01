import { authGuard } from "@/middleware/auth-guard";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const payload = authGuard(request);

    if (!payload) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { data: user, error } = await supabase
        .from("users")
        .select("id, email, username, created_at")
        .eq("id", payload.id)
        .single();

    if (error || !user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(user);
}