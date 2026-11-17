"use client";

import { motion } from "framer-motion";
import { KodeLaciLogo } from "@/components/brand/kodelaci-logo";
import type { AuthShellProps } from "@/types/components";

export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
    return (
        <main className="bg-workbench-grid flex flex-1 items-center justify-center px-gutter py-12">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32 }}
                className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/5 lg:grid-cols-[0.95fr_1.05fr] dark:shadow-black/30"
            >
                <div className="hidden flex-col justify-between border-r border-border bg-surface p-8 lg:flex">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                            <KodeLaciLogo className="h-5 w-5 text-foreground" />
                            <span>kodelaci · arsip developer</span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                                Simpan sekali. Temukan dalam hitungan detik.
                            </h2>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Laci khusus untuk potongan kode yang terlalu sering dipakai ulang,
                                tapi terlalu kecil untuk dibuatkan repository baru.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-xl border border-border bg-card p-4 font-mono text-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span>session.ts</span>
                            <span className="text-accent-code">HttpOnly · JWT</span>
                        </div>
                        <pre className="overflow-x-auto text-[11px] leading-5 text-foreground">
                            <code>{`// Cari snippet cukup pakai potongan kata\nGET /api/snippets?q=reac&visibility=all`}</code>
                        </pre>
                    </div>
                </div>

                <div className="p-6 sm:p-10">
                    <div className="mb-6">
                        <span className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
                            {eyebrow}
                        </span>
                        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                    </div>

                    {children}
                </div>
            </motion.div>
        </main>
    );
}
