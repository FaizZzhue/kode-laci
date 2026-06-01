import { verifyToken } from "@/lib/auth";
import { AuthPayload } from "@/types";
import { NextRequest } from "next/server"

export function authGuard(request: NextRequest) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        return verifyToken(token) as AuthPayload;
    } catch {
        return null;
    }
}