"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { usePublicSnippets } from "@/hooks/use-snippets";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { Button } from "@/components/ui/button";

export function PublicExplore() {
    const [searchInput, setSearchInput] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [language, setLanguage] = useState("");
    const [tag, setTag] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchInput.trim());
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const { snippets, meta, isLoading, error, refetch } = usePublicSnippets({
        q: debouncedQuery || undefined,
        language: language || undefined,
        tag: tag || undefined,
        page,
        limit: 9,
    });

    function clearFilters() {
        setSearchInput("");
        setDebouncedQuery("");
        setLanguage("");
        setTag("");
        setPage(1);
    }

    const hasFilters = !!(debouncedQuery || language || tag);

    return (
        <section id="explore" className="mx-auto w-full max-w-container-max px-gutter py-16">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Jelajah Snippet Publik
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Cari potongan kode berdasarkan judul, deskripsi, isi kode, bahasa, atau tag.
                    </p>
                </div>

                {hasFilters && (
                    <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4" />
                        Reset Filter
                    </Button>
                )}
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px]">
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Cari full-text (misal: debounce, jwt, useEffect)..."
                        aria-label="Cari snippet publik"
                        className="w-full rounded-lg border border-input bg-background py-2.5 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                </div>

                <select
                    value={language}
                    onChange={(e) => {
                        setLanguage(e.target.value);
                        setPage(1);
                    }}
                    aria-label="Filter bahasa pemrograman"
                    className="rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                    <option value="">Semua Bahasa</option>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            {tag && (
                <div className="mb-6 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Filter tag aktif:</span>
                    <button
                        type="button"
                        onClick={() => {
                            setTag("");
                            setPage(1);
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                    >
                        #{tag}
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="flex min-h-48 items-center justify-center rounded-xl border border-border bg-card/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Memuat snippet publik...</span>
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
                <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
                    <p className="text-sm font-medium text-foreground">
                        Belum ada snippet publik yang cocok.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {hasFilters
                            ? "Coba ubah kata kunci pencarian atau reset filter."
                            : "Daftar sekarang dan bagikan snippet publik pertama Anda!"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {snippets.map((snippet) => (
                            <SnippetCard
                                key={snippet.id}
                                snippet={snippet}
                                mode="public"
                                onTagClick={(slug) => {
                                    setTag(slug);
                                    setPage(1);
                                }}
                            />
                        ))}
                    </div>

                    {meta && meta.totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3">
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
                                Halaman {meta.page} dari {meta.totalPages}
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
