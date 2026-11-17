import { NextRequest } from "next/server";
import { authGuard } from "@/middleware/auth-guard";
import { supabase } from "@/lib/supabase";
import { errorResponse, okResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
    const payload = authGuard(request);

    if (!payload) {
        return errorResponse("Unauthorized", 401);
    }

    const { data: user, error } = await supabase
        .from("users")
        .select("id, username, email, avatar_url, created_at")
        .eq("id", payload.id)
        .maybeSingle();

    if (error) {
        console.error("Fetch current user failed:", error);
        return errorResponse("Internal Server Error", 500);
    }

    if (!user) {
        return errorResponse("User not found", 404);
    }

    return okResponse(user);
}
