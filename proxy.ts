import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/snippets"];
const AUTH_PAGES = ["/login", "/register"];

function applySecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSessionCookie = request.cookies.has("kodelaci_token");

    const isProtectedPage = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    if (isProtectedPage && !hasSessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    const isAuthPage = AUTH_PAGES.includes(pathname);
    if (isAuthPage && hasSessionCookie) {
        return applySecurityHeaders(NextResponse.redirect(new URL("/dashboard", request.url)));
    }

    return applySecurityHeaders(NextResponse.next());
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
