"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Plus, Search, X } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { deleteSnippet, extractApiError, useMySnippets } from "@/hooks/use-snippets";
import Sidebar from "@/components/layout/sidebar";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { Button } from "@/components/ui/button";

function DashboardContent() {
    const searchParams = useSearchParams();
    const initialVis = searchParams.get("visibility");
    const defaultVisibility: "all" | "public" | "private" =
        initialVis === "public" || initialVis === "private" ? initialVis : "all";

    const [visibility, setVisibility] = useState<"all" | "public" | "private">(defaultVisibility);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [language, setLanguage] = useState("");
    const [tag, setTag] = useState("");
    const [page, setPage] = useState(1);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchInput.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const { snippets, meta, isLoading, error, refetch } = useMySnippets({
        q: debouncedQuery || undefined,
        language: language || undefined,
        tag: tag || undefined,
        visibility,
        page,
        limit: 12,
    });

    async function handleDelete(id: string) {
        const confirmed = window.confirm("Hapus snippet ini secara permanen?");
        if (!confirmed) {
            return;
        }

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

    function resetFilters() {
        setSearchInput("");
        setDebouncedQuery("");
        setLanguage("");
        setTag("");
        setVisibility("all");
        setPage(1);
    }

    const hasFilters = !!(debouncedQuery || language || tag || visibility !== "all");

    return (
        <div className="mx-auto flex w-full max-w-container-max flex-col gap-6 px-gutter py-10 lg:flex-row">
            <Sidebar
                visibility={visibility}
                onVisibilityChange={(nextVis) => {
                    setVisibility(nextVis);
                    setPage(1);
                }}
                totalSnippets={meta?.total}
            />

            <main className="min-w-0 flex-1 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Dashboard Snippet
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola potongan kode private maupun publik Anda.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/snippets/new">
                            <Plus className="h-4 w-4" />
                            Buat Snippet
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Cari snippet milik Anda..."
                            aria-label="Cari snippet milik Anda"
                            className="w-full rounded-lg border border-input bg-background py-2.5 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                    </div>

                    <select
                        value={language}
                        onChange={(e) => {
                            setLanguage(e.target.value);
                            setPage(1);
                        }}
                        aria-label="Filter bahasa"
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

                {(tag || hasFilters) && (
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        {tag && (
                            <button
                                type="button"
                                onClick={() => {
                                    setTag("");
                                    setPage(1);
                                }}
                                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary"
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
                    <div className="flex min-h-48 items-center justify-center rounded-xl border border-border bg-card/40">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Memuat snippet Anda...</span>
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
                            {hasFilters ? "Tidak ada snippet yang cocok dengan filter." : "Laci Anda masih kosong."}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {hasFilters
                                ? "Ubah kata kunci pencarian atau reset filter."
                                : "Mulai simpan potongan kode pertama Anda sekarang."}
                        </p>
                        {!hasFilters && (
                            <Button asChild size="sm" className="mt-4">
                                <Link href="/snippets/new">Buat Snippet Pertama</Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {snippets.map((snippet) => (
                                <SnippetCard
                                    key={snippet.id}
                                    snippet={snippet}
                                    mode="owner"
                                    onDelete={handleDelete}
                                    isDeleting={deletingId === snippet.id}
                                    onTagClick={(slug) => {
                                        setTag(slug);
                                        setPage(1);
                                    }}
                                />
                            ))}
                        </div>

                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 pt-2">
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
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-1 items-center justify-center py-20 text-sm text-muted-foreground">
                    Memuat dashboard...
                </div>
            }
        >
            <DashboardContent />
        </Suspense>
    );
}
