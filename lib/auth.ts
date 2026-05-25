import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
}

export function signToken(payload: {
    id: string;
    email: string;
}) {
    return jwt.sign(payload, JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        } as SignOptions
    );
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}