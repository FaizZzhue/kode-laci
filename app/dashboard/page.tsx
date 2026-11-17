"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, Search, X } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { useAuth } from "@/hooks/use-auth";
import { useDebounce } from "@/hooks/use-debounce";
import { useMySnippets } from "@/hooks/use-snippets";
import { deleteSnippet, extractApiError } from "@/lib/snippet-api";
import Sidebar from "@/components/layout/sidebar";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { Button } from "@/components/ui/button";
import type { VisibilityFilter } from "@/types";

function DashboardContent() {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const initialVis = searchParams.get("visibility");
    const defaultVisibility: VisibilityFilter =
        initialVis === "public" || initialVis === "private" ? initialVis : "all";

    const [visibility, setVisibility] = useState<VisibilityFilter>(defaultVisibility);
    const [searchInput, setSearchInput] = useState("");
    const [language, setLanguage] = useState("");
    const [tag, setTag] = useState("");
    const [page, setPage] = useState(1);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const debouncedQuery = useDebounce(searchInput.trim(), 260);

    async function handleDelete(id: string) {
        setActionError(null);
        setDeletingId(id);
        try {
            await deleteSnippet(id);
            await refetch();
        } catch (err) {
            setActionError(extractApiError(err, "Gagal menghapus snippet."));
        } finally {
            setDeletingId(null);
        }
    }

    const { snippets, meta, isLoading, error, refetch } = useMySnippets({
        q: debouncedQuery || undefined,
        language: language || undefined,
        tag: tag || undefined,
        visibility,
        page,
        limit: 12,
    });

    function resetFilters() {
        setSearchInput("");
        setLanguage("");
        setTag("");
        setVisibility("all");
        setPage(1);
    }

    const hasFilters = !!(debouncedQuery || language || tag || visibility !== "all");

    return (
        <div className="mx-auto flex w-full max-w-container-max flex-col gap-6 px-gutter py-8 lg:flex-row lg:py-10">
            <Sidebar
                visibility={visibility}
                onVisibilityChange={(nextVis) => {
                    setVisibility(nextVis);
                    setPage(1);
                }}
                totalSnippets={meta?.total}
            />

            <main className="min-w-0 flex-1 space-y-6">
                <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="font-mono text-xs text-muted-foreground">
                            ~/laci-saya{user ? ` · @${user.username}` : ""}
                        </span>
                        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Koleksi Snippet
                        </h1>
                    </div>

                    <Button asChild>
                        <Link href="/snippets/new">
                            <Plus className="h-4 w-4" />
                            Simpan Snippet
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_210px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Cari judul, kode, atau tag di laci Anda..."
                            aria-label="Cari snippet milik Anda"
                            className="w-full rounded-lg border border-input bg-card py-2.5 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                    </div>

                    <select
                        value={language}
                        onChange={(e) => {
                            setLanguage(e.target.value);
                            setPage(1);
                        }}
                        aria-label="Filter bahasa"
                        className="rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                        <option value="">Semua Bahasa</option>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                {(tag || hasFilters) && (
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        {tag && (
                            <button
                                type="button"
                                onClick={() => {
                                    setTag("");
                                    setPage(1);
                                }}
                                className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono font-medium text-primary"
                            >
                                #{tag}
                                <X className="h-3 w-3" />
                            </button>
                        )}
                        {hasFilters && (
                            <Button type="button" variant="ghost" size="xs" onClick={resetFilters}>
                                Reset Filter
                            </Button>
                        )}
                    </div>
                )}

                {actionError && (
                    <div
                        role="alert"
                        className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                        {actionError}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex min-h-48 items-center justify-center rounded-xl border border-border bg-card/50">
                        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span>membuka laci...</span>
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
                            {hasFilters
                                ? "Tidak ada snippet yang cocok dengan filter."
                                : "Laci Anda masih kosong."}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {hasFilters
                                ? "Coba kata kunci lain atau reset filter aktif."
                                : "Simpan potongan kode pertama Anda agar tidak hilang di repo lama."}
                        </p>
                        {!hasFilters && (
                            <Button asChild size="sm" className="mt-4">
                                <Link href="/snippets/new">Simpan Snippet Pertama</Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <motion.div layout className="grid gap-4 sm:grid-cols-2">
                            <AnimatePresence mode="popLayout">
                                {snippets.map((snippet, idx) => (
                                    <SnippetCard
                                        key={snippet.id}
                                        snippet={snippet}
                                        mode="owner"
                                        index={idx}
                                        onDelete={handleDelete}
                                        isDeleting={deletingId === snippet.id}
                                        onTagClick={(slug) => {
                                            setTag(slug);
                                            setPage(1);
                                        }}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 pt-2 font-mono">
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
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-1 items-center justify-center py-20 font-mono text-xs text-muted-foreground">
                    memuat dashboard...
                </div>
            }
        >
            <DashboardContent />
        </Suspense>
    );
}
