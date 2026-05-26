import { signToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { loginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = loginSchema.safeParse(body);

        if(!validation.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    error: validation.error.flatten(),
                },
                {status: 400}
            );
        }

        const {email, password} = validation.data;
        const {data: user, error} = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
        
        if (error || !user) {
            return NextResponse.json(
                {message: "Email atau password salah"},
                {status: 401}
            );
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return NextResponse.json(
                {message: "Email atau password salah"},
                {status: 401}
            )
        }

        const token = signToken({
            id: user.id,
            email: user.email,
        });

        const {password_hash, ...safeUser} = user;

        return NextResponse.json(
            {
                message: "Login berhasil",
                token,
                user: safeUser,
            },
            {status: 200}
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    };
}