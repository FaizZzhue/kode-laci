import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter").max(30, "Username maximal 30 karakter"),
    email: z.email(),
    password: z.string().min(8, "Password minimal 8 karakter"),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export const snippetSchema = z.object({
    title: z.string().min(3, "Title minimal 3 karakter").max(100, "Title maximal 100 karakter"),
    description: z.string().min(10, "Description minimal 10 karakter").max(500, "Description maximal 500 karakter"),
    code: z.string().min(10, "Code minimal 10 karakter"),
    language: z.string().min(2, "Language minimal 2 karakter").max(30, "Language maximal 30 karakter"),
    is_public: z.boolean(),
    // tags: z.array(z.string()).optional(),
})