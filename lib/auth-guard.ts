import { verifyToken } from "@/lib/auth";

export function authGuard(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
        return null;
    }

    const token = authHeader.replace("Bearer ", "");
    try {
        return verifyToken(token);
    } catch {
        return null;
    }
}