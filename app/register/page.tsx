"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { extractApiError } from "@/hooks/use-snippets";
import { Button } from "@/components/ui/button";
import type { ApiResponse, User } from "@/types";

export default function RegisterPage() {
    const router = useRouter();
    const { setSessionUser } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await api.post<ApiResponse<{ user: User }>>("/auth/register", {
                username,
                email,
                password,
            });

            const registeredUser = response.data.data?.user;
            if (!registeredUser) {
                throw new Error("Respons registrasi tidak valid.");
            }

            setSessionUser(registeredUser);
            router.push("/dashboard");
        } catch (err) {
            setError(extractApiError(err, "Registrasi gagal. Silakan periksa input Anda."));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex flex-1 items-center justify-center px-gutter py-16">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UserPlus className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Buat Akun KodeLaci
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Mulai simpan dan bagikan potongan kode Anda.
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
                        <label htmlFor="reg-username" className="text-sm font-medium text-foreground">
                            Username
                        </label>
                        <input
                            id="reg-username"
                            type="text"
                            required
                            minLength={3}
                            maxLength={30}
                            pattern="[a-zA-Z0-9_\-]+"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="faiz_dev"
                            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            3–30 karakter: huruf, angka, underscore, atau hyphen.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="reg-email" className="text-sm font-medium text-foreground">
                            Email
                        </label>
                        <input
                            id="reg-email"
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
                        <label htmlFor="reg-password" className="text-sm font-medium text-foreground">
                            Password
                        </label>
                        <input
                            id="reg-password"
                            type="password"
                            required
                            minLength={8}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimal 8 karakter"
                            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Daftar
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Login di sini
                    </Link>
                </p>
            </div>
        </main>
    );
}
