"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { extractApiError } from "@/hooks/use-snippets";
import { Button } from "@/components/ui/button";
import type { ApiResponse, User } from "@/types";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setSessionUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await api.post<ApiResponse<{ user: User }>>("/auth/login", {
                email,
                password,
            });

            const loggedInUser = response.data.data?.user;
            if (!loggedInUser) {
                throw new Error("Respons login tidak valid.");
            }

            setSessionUser(loggedInUser);

            const redirectTo = searchParams.get("redirect");
            const safeRedirect =
                redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
                    ? redirectTo
                    : "/dashboard";

            router.push(safeRedirect);
        } catch (err) {
            setError(extractApiError(err, "Login gagal. Periksa email dan password Anda."));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <LogIn className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Masuk ke KodeLaci
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Kelola dan cari snippet kode pribadi Anda.
                </p>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="login-email" className="text-sm font-medium text-foreground">
                        Email
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="login-password" className="text-sm font-medium text-foreground">
                        Password
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Masuk
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Daftar di sini
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="flex flex-1 items-center justify-center px-gutter py-16">
            <Suspense
                fallback={
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Memuat form login...</span>
                    </div>
                }
            >
                <LoginForm />
            </Suspense>
        </main>
    );
}
