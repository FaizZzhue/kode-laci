"use client";

import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRegisterForm } from "@/hooks/use-auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    const {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        togglePassword,
        error,
        isSubmitting,
        handleSubmit,
    } = useRegisterForm();

    return (
        <AuthShell
            eyebrow="Akun Baru"
            title="Buat Laci KodeLaci"
            subtitle="Gratis. Simpan snippet private atau bagikan lewat tautan publik."
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
                    <p className="font-mono text-[11px] text-muted-foreground">
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
                    <div className="relative">
                        <input
                            id="reg-password"
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={8}
                            autoComplete="new-password"
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
                    Buat Akun &amp; Buka Laci
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Masuk di sini
                </Link>
            </p>
        </AuthShell>
    );
}
