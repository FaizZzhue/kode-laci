import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { loginSchema } from "@/lib/validations";
import { getAuthCookieOptions, signToken } from "@/lib/auth";
import { errorResponse, okResponse } from "@/lib/api-response";
import { RATE_LIMIT_POLICIES } from "@/constants/limits";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
    const rateLimited = enforceRateLimit(request, "auth:login", RATE_LIMIT_POLICIES.AUTH_LOGIN);
    if (rateLimited) {
        return rateLimited;
    }

    try {
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return errorResponse("Invalid JSON payload", 400);
        }

        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return errorResponse(
                "Validation failed",
                400,
                validation.error.flatten().fieldErrors
            );
        }

        const { email, password } = validation.data;
        const { data: user, error } = await supabase
            .from("users")
            .select("id, username, email, password_hash, avatar_url, created_at")
            .eq("email", email)
            .maybeSingle();

        if (error) {
            console.error("Login query failed:", error);
            return errorResponse("Terjadi kesalahan server", 500);
        }

        if (!user || !user.password_hash) {
            return errorResponse("Email atau password salah", 401);
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return errorResponse("Email atau password salah", 401);
        }

        const token = signToken({
            id: user.id,
            email: user.email,
        });

        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar_url,
            created_at: user.created_at,
        };

        const response = okResponse(
            { user: safeUser },
            { message: "Login berhasil", status: 200 }
        );

        response.cookies.set({
            ...getAuthCookieOptions(),
            value: token,
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return errorResponse("Terjadi kesalahan server", 500);
    }
}
