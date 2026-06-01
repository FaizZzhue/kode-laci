import { authGuard } from "@/middleware/auth-guard";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const payload = authGuard(request);

    if (!payload) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    return NextResponse.json({
        user: payload,
    });
}