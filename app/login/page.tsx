"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLoginForm } from "@/hooks/use-auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

function LoginForm() {
    const searchParams = useSearchParams();
    const {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        togglePassword,
        error,
        isSubmitting,
        handleSubmit,
    } = useLoginForm(searchParams.get("redirect"));

    return (
        <AuthShell
            eyebrow="Akses Laci"
            title="Masuk ke KodeLaci"
            subtitle="Lanjutkan mengelola snippet private dan publik Anda."
        >
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
                    <div className="relative">
                        <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={8}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimal 8 karakter"
                            className="w-full rounded-lg border border-input bg-background py-2.5 pr-10 pl-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Masuk ke Laci
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Daftar di sini
                </Link>
            </p>
        </AuthShell>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <main className="flex flex-1 items-center justify-center py-20 font-mono text-xs text-muted-foreground">
                    memuat halaman masuk...
                </main>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
