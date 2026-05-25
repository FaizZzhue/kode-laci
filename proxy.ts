import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function Proxy(request: NextRequest) {
    return NextResponse.next();
}