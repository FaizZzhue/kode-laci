import { NextResponse } from "next/server";
import type { PaginationMeta } from "@/types";

export function okResponse<T>(
    data: T,
    options?: {
        message?: string;
        status?: number;
        meta?: PaginationMeta;
    }
) {
    return NextResponse.json(
        {
            success: true,
            ...(options?.message ? { message: options.message } : {}),
            data,
            ...(options?.meta ? { meta: options.meta } : {}),
        },
        { status: options?.status ?? 200 }
    );
}

export function errorResponse(
    message: string,
    status: number,
    errors?: Record<string, string[] | undefined>
) {
    return NextResponse.json(
        {
            success: false,
            message,
            error: message,
            ...(errors ? { errors } : {}),
        },
        { status }
    );
}
