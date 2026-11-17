import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/constants/auth";
import { verifyToken } from "@/lib/auth";
import type { AuthPayload } from "@/types";

export function authGuard(request: NextRequest): AuthPayload | null {
    const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : undefined;

    const token = cookieToken || bearerToken;
    if (!token) {
        return null;
    }

    return verifyToken(token);
}
