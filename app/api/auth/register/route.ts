import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { registerSchema } from "@/lib/validations";
import { getAuthCookieOptions, signToken } from "@/lib/auth";
import { errorResponse, okResponse } from "@/lib/api-response";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
    const rateLimited = enforceRateLimit(request, "auth:register", {
        limit: 5,
        windowMs: 15 * 60 * 1000,
    });
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

        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return errorResponse(
                "Validation failed",
                400,
                parsed.error.flatten().fieldErrors
            );
        }

        const { username, email, password } = parsed.data;

        const [{ data: existingEmail, error: emailError }, { data: existingUsername, error: usernameError }] =
            await Promise.all([
                supabase.from("users").select("id").eq("email", email).maybeSingle(),
                supabase.from("users").select("id").eq("username", username).maybeSingle(),
            ]);

        if (emailError || usernameError) {
            console.error("Register uniqueness check failed:", emailError || usernameError);
            return errorResponse("Internal Server Error", 500);
        }

        if (existingEmail) {
            return errorResponse("Email already registered", 409);
        }

        if (existingUsername) {
            return errorResponse("Username already registered", 409);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const { data: user, error } = await supabase
            .from("users")
            .insert({
                username,
                email,
                password_hash: passwordHash,
            })
            .select("id, username, email, avatar_url, created_at")
            .single();

        if (error || !user) {
            console.error("Register insert failed:", error);
            return errorResponse("Internal Server Error", 500);
        }

        const token = signToken({
            id: user.id,
            email: user.email,
        });

        const response = okResponse(
            { user },
            { message: "Register success", status: 201 }
        );

        response.cookies.set({
            ...getAuthCookieOptions(),
            value: token,
        });

        return response;
    } catch (error) {
        console.error("Register error:", error);
        return errorResponse("Internal Server Error", 500);
    }
}
