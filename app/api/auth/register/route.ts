import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json (
                {
                    message: "Validation failed",
                    errors: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const { username, email, password } = parsed.data;
        const { data: existingUser } = await supabase
            .from("users")
            .select("email, username")
            .or(`email.eq.${email},username.eq.${username}`)
            .maybeSingle();
        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { message: "Email already registered" },
                    { status: 409 }
                );
            }

            if (existingUser.username === username) {
                return NextResponse.json(
                    { message: "Username already registered" },
                    { status: 409 }
                );
            }
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const {data: user, error} = await supabase
            .from("users")
            .insert({
                username,
                email,
                password_hash: passwordHash,
            })
            .select("id, username, email, avatar_url, created_at")
            .single();
        if (error) {
            throw error;
        }

        const token = signToken({
            id: user.id,
            email: user.email,
        });

        return NextResponse.json(
            {
                message: "Register success",
                token,
                user,
            },
            {status: 201}
        );
    } catch (error) {
        console.error(error);
        
        return NextResponse.json (
            {
                message: "Internal Server Error",
            },
            {status: 500}
        );
    }
}