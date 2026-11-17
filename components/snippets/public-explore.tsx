"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { QUICK_LANGUAGES, SUPPORTED_LANGUAGES } from "@/constants/languages";
import { useDebounce } from "@/hooks/use-debounce";
import { useSlashShortcut } from "@/hooks/use-slash-shortcut";
import { usePublicSnippets } from "@/hooks/use-snippets";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicExplore() {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchInput, setSearchInput] = useState("");
    const [language, setLanguage] = useState("");
    const [tag, setTag] = useState("");
    const [page, setPage] = useState(1);

    const debouncedQuery = useDebounce(searchInput.trim(), 260);
    useSlashShortcut(searchInputRef);

    const { snippets, meta, isLoading, error, refetch } = usePublicSnippets({
        q: debouncedQuery || undefined,
        language: language || undefined,
        tag: tag || undefined,
        page,
        limit: 9,
    });

    function clearFilters() {
        setSearchInput("");
        setLanguage("");
        setTag("");
        setPage(1);
    }

    const hasFilters = !!(debouncedQuery || language || tag);

    return (
        <section id="explore" className="mx-auto w-full max-w-container-max px-gutter py-16 sm:py-20">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <span className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
                        Indeks Publik
                    </span>
                    <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Jelajah Snippet Komunitas
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ketik potongan kata (misal <code className="font-mono text-foreground">reac</code>), pilih bahasa, atau klik tag pada kartu.
                    </p>
                </div>

                {hasFilters && (
                    <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4" />
                        Reset Filter
                    </Button>
                )}
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        ref={searchInputRef}
                        id="explore-search-input"
                        type="search"
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Cari judul, kode, bahasa, atau tag... (tekan /)"
                        aria-label="Cari snippet publik"
                        className="w-full rounded-lg border border-input bg-card py-2.5 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                </div>

                <select
                    value={language}
                    onChange={(e) => {
                        setLanguage(e.target.value);
                        setPage(1);
                    }}
                    aria-label="Filter bahasa pemrograman"
                    className="rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                    <option value="">Semua Bahasa (23+)</option>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-1.5">
                {QUICK_LANGUAGES.map((item) => {
                    const active = language === item.value;
                    return (
                        <button
                            key={item.value || "all"}
                            type="button"
                            onClick={() => {
                                setLanguage(item.value);
                                setPage(1);
                            }}
                            className={cn(
                                "relative rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                                active
                                    ? "text-primary-foreground"
                                    : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {active && (
                                <motion.span
                                    layoutId="explore-lang-pill"
                                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                    className="absolute inset-0 rounded-md bg-foreground dark:bg-primary"
                                />
                            )}
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    );
                })}

                {tag && (
                    <button
                        type="button"
                        onClick={() => {
                            setTag("");
                            setPage(1);
                        }}
                        className="ml-2 inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-xs font-medium text-primary"
                    >
                        #{tag}
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex min-h-48 items-center justify-center rounded-xl border border-border bg-card/60">
                    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>membuka laci publik...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button type="button" variant="outline" size="sm" onClick={refetch}>
                        Coba Lagi
                    </Button>
                </div>
            ) : snippets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
                    <p className="font-display text-sm font-semibold text-foreground">
                        Tidak ada snippet publik yang cocok.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {hasFilters
                            ? "Coba kata kunci lebih pendek atau reset filter yang aktif."
                            : "Buat akun dan publikasikan snippet pertama di laci publik."}
                    </p>
                </div>
            ) : (
                <>
                    <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {snippets.map((snippet, idx) => (
                                <SnippetCard
                                    key={snippet.id}
                                    snippet={snippet}
                                    mode="public"
                                    index={idx}
                                    onTagClick={(slug) => {
                                        setTag(slug);
                                        setPage(1);
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {meta && meta.totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3 font-mono">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Sebelumnya
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {meta.page} / {meta.totalPages}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={page >= meta.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Berikutnya
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
