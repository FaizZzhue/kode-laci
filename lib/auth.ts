import jwt, { type SignOptions } from "jsonwebtoken";
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from "@/constants/auth";
import type { AuthPayload } from "@/types";

export { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE };

export function getAuthCookieOptions(maxAge = AUTH_COOKIE_MAX_AGE) {
    return {
        name: AUTH_COOKIE_NAME,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge,
    };
}

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is required");
    }
    return secret;
}

export function signToken(payload: AuthPayload): string {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as SignOptions);
}

export function verifyToken(token: string): AuthPayload | null {
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        if (
            typeof decoded === "object" &&
            decoded !== null &&
            typeof decoded.id === "string" &&
            typeof decoded.email === "string"
        ) {
            return { id: decoded.id, email: decoded.email };
        }
        return null;
    } catch {
        return null;
    }
}
