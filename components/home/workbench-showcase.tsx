"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, GitFork, Globe, Lock, Search } from "lucide-react";
import { SEARCH_PRESETS } from "@/constants/home";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import { DecryptedText } from "@/components/reactbits/decrypted-text";
import { cn } from "@/lib/utils";

export function WorkbenchShowcase() {
    const [presetIndex, setPresetIndex] = useState(0);
    const [isPublicDemo, setIsPublicDemo] = useState(true);
    const [hoveredLang, setHoveredLang] = useState<string>("typescript");

    const activePreset = SEARCH_PRESETS[presetIndex];

    return (
        <section id="alur" className="border-y border-border bg-surface/70">
            <div className="mx-auto max-w-container-max px-gutter py-16 sm:py-20">
                <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <DecryptedText
                            text="// ARSITEKTUR LACI"
                            animateOn="view"
                            speed={32}
                            className="font-mono text-xs font-medium uppercase tracking-wider text-primary"
                        />
                        <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Dibuat untuk kebiasaan kerja developer.
                        </h2>
                    </div>
                    <p className="max-w-md text-sm text-muted-foreground">
                        Cari dengan potongan kata, kunci kode sensitif sebagai draft private, dan
                        publikasikan saat tim membutuhkannya.
                    </p>
                </div>

                {/* Magic Bento 12-kolom asimetris dengan React Bits SpotlightCard */}
                <div className="grid gap-4 lg:grid-cols-12">
                    {/* Bento 1 (Lebar): Pencarian Parsial */}
                    <SpotlightCard className="flex flex-col justify-between p-6 lg:col-span-7">
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <span className="font-mono text-xs text-muted-foreground">
                                    01 / PENCARIAN PARSIAL
                                </span>
                                <Search className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-foreground">
                                Tidak harus hafal nama fungsinya secara penuh
                            </h3>
                            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                                Ketik <code className="font-mono text-foreground">reac</code> atau{" "}
                                <code className="font-mono text-foreground">deb</code> — query
                                menggabungkan PostgreSQL prefix FTS, substring identifier, dan tag.
                            </p>
                        </div>

                        <div className="mt-6 rounded-xl border border-border bg-surface p-4">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap gap-1.5">
                                    {SEARCH_PRESETS.map((preset, idx) => (
                                        <button
                                            key={preset.query}
                                            type="button"
                                            onClick={() => setPresetIndex(idx)}
                                            className={cn(
                                                "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                                                idx === presetIndex
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                                            )}
                                        >
                                            &quot;{preset.query}&quot;
                                        </button>
                                    ))}
                                </div>
                                <span className="font-mono text-[11px] text-muted-foreground">
                                    GET /api/public/snippets?q={activePreset.query}
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activePreset.query}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.16 }}
                                    className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="font-medium text-foreground">
                                            {activePreset.resultTitle}
                                        </span>
                                        <span className="rounded bg-accent-code/10 px-1.5 py-0.5 font-mono text-[11px] text-accent-code">
                                            {activePreset.lang}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {activePreset.matchedBy.map((reason) => (
                                            <span
                                                key={reason}
                                                className="rounded border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                                            >
                                                {reason}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </SpotlightCard>

                    {/* Bento 2 (Sempit): Toggle Private vs Publik */}
                    <SpotlightCard
                        spotlightColor="rgba(15, 118, 110, 0.16)"
                        className="flex flex-col justify-between p-6 lg:col-span-5"
                    >
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <span className="font-mono text-xs text-muted-foreground">
                                    02 / KONTROL AKSES
                                </span>
                                {isPublicDemo ? (
                                    <Globe className="h-4 w-4 text-accent-code" />
                                ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                            <h3 className="font-display text-lg font-semibold text-foreground">
                                Private default, URL unik saat publik
                            </h3>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Snippet private selalu ber-slug <code className="font-mono">null</code>.
                                Aktifkan Publik untuk menerbitkan halaman Shiki di{" "}
                                <code className="font-mono text-foreground">/s/slug</code>.
                            </p>
                        </div>

                        <div className="mt-6 rounded-xl border border-border bg-surface p-3.5">
                            <div className="mb-3 grid grid-cols-2 gap-1.5 rounded-lg bg-muted p-1">
                                <button
                                    type="button"
                                    onClick={() => setIsPublicDemo(false)}
                                    className={cn(
                                        "rounded-md py-1.5 font-mono text-xs font-medium transition-colors",
                                        !isPublicDemo
                                            ? "bg-card text-foreground shadow-xs"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    Private
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPublicDemo(true)}
                                    className={cn(
                                        "rounded-md py-1.5 font-mono text-xs font-medium transition-colors",
                                        isPublicDemo
                                            ? "bg-card text-accent-code shadow-xs"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    Publik
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isPublicDemo ? "pub" : "priv"}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-[11px]"
                                >
                                    {isPublicDemo ? (
                                        <span className="text-accent-code">
                                            /s/react-usedebounce-8f3k2a
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            slug: null · tersembunyi dari publik
                                        </span>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </SpotlightCard>

                    {/* Bento 3 (Sempit): Fork */}
                    <SpotlightCard className="flex flex-col justify-between p-6 lg:col-span-5">
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <span className="font-mono text-xs text-muted-foreground">
                                    03 / FORK SNIPPET
                                </span>
                                <GitFork className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-foreground">
                                Salin ke laci pribadi tanpa konflik
                            </h3>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Fork otomatis menyalin kode beserta tag sebagai draft private baru
                                dengan referensi <code className="font-mono">forked_from</code>.
                            </p>
                        </div>

                        <div className="mt-6 space-y-2 rounded-xl border border-border bg-surface p-3.5 font-mono text-[11px]">
                            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
                                <span className="text-foreground">@penulis · publik</span>
                                <span className="text-accent-code">/s/retry-9a1c</span>
                            </div>
                            <div className="flex items-center justify-center gap-1.5 text-primary">
                                <GitFork className="h-3.5 w-3.5" />
                                <span>POST /api/snippets/[id]/fork</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
                                <span className="text-foreground">@kamu · draft private</span>
                                <span className="text-muted-foreground">siap diedit</span>
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Bento 4 (Lebar): Indeks 23+ Bahasa Shiki */}
                    <SpotlightCard
                        spotlightColor="rgba(15, 118, 110, 0.14)"
                        className="flex flex-col justify-between p-6 lg:col-span-7"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="font-mono text-xs text-muted-foreground">
                                        04 / SHIKI DUAL-THEME
                                    </span>
                                </div>
                                <h3 className="font-display text-lg font-semibold text-foreground">
                                    Syntax highlighting server-side untuk 23+ bahasa
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Dirender langsung di server dengan tema GitHub Light &amp; Dark
                                    tanpa membebani bundle browser.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 font-mono text-xs text-foreground">
                                <Code2 className="h-3.5 w-3.5 text-accent-code" />
                                <span>{hoveredLang}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-1.5">
                            {SUPPORTED_LANGUAGES.slice(0, 16).map((lang) => (
                                <button
                                    key={lang.value}
                                    type="button"
                                    onMouseEnter={() => setHoveredLang(lang.value)}
                                    onFocus={() => setHoveredLang(lang.value)}
                                    className={cn(
                                        "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
                                        hoveredLang === lang.value
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border bg-surface text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </SpotlightCard>
                </div>
            </div>
        </section>
    );
}
