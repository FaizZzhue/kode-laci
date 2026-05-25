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