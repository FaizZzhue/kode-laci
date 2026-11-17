import { z } from "zod";

export const uuidSchema = z.string().uuid("ID tidak valid");

export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username minimal 3 karakter")
        .max(30, "Username maksimal 30 karakter")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username hanya boleh berisi huruf, angka, underscore, atau hyphen"),
    email: z.email("Format email tidak valid").trim().toLowerCase(),
    password: z.string().min(8, "Password minimal 8 karakter"),
});

export const loginSchema = z.object({
    email: z.email("Format email tidak valid").trim().toLowerCase(),
    password: z.string().min(8, "Password minimal 8 karakter"),
});

export const snippetSchema = z.object({
    title: z.string().trim().min(3, "Title minimal 3 karakter").max(100, "Title maksimal 100 karakter"),
    description: z.string().trim().min(10, "Description minimal 10 karakter").max(500, "Description maksimal 500 karakter"),
    code: z.string().min(10, "Code minimal 10 karakter"),
    language: z.string().trim().min(2, "Language minimal 2 karakter").max(30, "Language maksimal 30 karakter").toLowerCase(),
    is_public: z.boolean(),
    tags: z
        .array(
            z
                .string()
                .trim()
                .min(1, "Tag tidak boleh kosong")
                .max(30, "Tag maksimal 30 karakter")
                .transform((val) => val.toLowerCase())
        )
        .max(10, "Maksimal 10 tag")
        .optional(),
});

export const snippetListQuerySchema = z.object({
    q: z.string().trim().max(100).optional(),
    language: z.string().trim().max(30).toLowerCase().optional(),
    tag: z.string().trim().max(35).toLowerCase().optional(),
    visibility: z.enum(["all", "public", "private"]).default("all"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});
