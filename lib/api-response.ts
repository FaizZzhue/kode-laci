import { NextResponse } from "next/server";
import type { PaginationMeta, PostgrestLikeError } from "@/types";

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

export function mapDatabaseErrorMessage(error: unknown, fallback: string): string {
    const err = error as PostgrestLikeError | null | undefined;
    const code = err?.code;

    switch (code) {
        case "42P01":
        case "PGRST205":
            return "Tabel database belum tersedia. Jalankan database/schema.sql di Supabase SQL Editor.";
        case "42703":
        case "PGRST204":
            return "Kolom database belum sinkron. Jalankan ulang database/schema.sql di Supabase SQL Editor.";
        case "42P10":
            return "Constraint unik tabel tags belum sesuai. Jalankan ulang database/schema.sql di Supabase SQL Editor.";
        case "428C9":
        case "0A000":
            return "Konflik kolom generated search_vector dengan trigger. Jalankan ulang database/schema.sql terbaru.";
        case "42501":
            return "Akses database ditolak RLS. Pastikan SUPABASE_SERVICE_KEY di .env.local menggunakan service_role key.";
        case "23503":
            return "Referensi akun tidak ditemukan. Silakan logout lalu login kembali.";
        default:
            return fallback;
    }
}
