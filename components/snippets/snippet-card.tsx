"use client";

import Link from "next/link";
import { Calendar, ExternalLink, GitFork, Globe, Lock, Pencil, Trash2 } from "lucide-react";
import type { Snippet } from "@/types";
import { getLanguageLabel } from "@/constants/languages";
import { Button } from "@/components/ui/button";

type SnippetCardProps = {
    snippet: Snippet;
    mode: "public" | "owner";
    onDelete?: (id: string) => void;
    isDeleting?: boolean;
    onTagClick?: (slug: string) => void;
};

function formatDate(dateString: string): string {
    try {
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(new Date(dateString));
    } catch {
        return dateString;
    }
}

export function SnippetCard({
    snippet,
    mode,
    onDelete,
    isDeleting = false,
    onTagClick,
}: SnippetCardProps) {
    const publicHref = snippet.slug ? `/s/${snippet.slug}` : null;

    return (
        <article className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
            <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-primary">
                        {getLanguageLabel(snippet.language)}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {snippet.forked_from && (
                            <span
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground"
                                title="Hasil fork dari snippet publik"
                            >
                                <GitFork className="h-3 w-3" />
                                Fork
                            </span>
                        )}
                        {mode === "owner" && (
                            <span
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium ${
                                    snippet.is_public
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-secondary text-secondary-foreground"
                                }`}
                            >
                                {snippet.is_public ? (
                                    <>
                                        <Globe className="h-3 w-3" />
                                        Publik
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-3 w-3" />
                                        Private
                                    </>
                                )}
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="mb-1.5 text-base font-semibold tracking-tight text-foreground">
                    {mode === "public" && publicHref ? (
                        <Link href={publicHref} className="hover:text-primary hover:underline">
                            {snippet.title}
                        </Link>
                    ) : (
                        <Link
                            href={`/snippets/${snippet.id}/edit`}
                            className="hover:text-primary hover:underline"
                        >
                            {snippet.title}
                        </Link>
                    )}
                </h3>

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {snippet.description}
                </p>

                {snippet.tags && snippet.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                        {snippet.tags.map((tag) =>
                            onTagClick ? (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => onTagClick(tag.slug)}
                                    className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                                >
                                    #{tag.name}
                                </button>
                            ) : (
                                <span
                                    key={tag.id}
                                    className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground"
                                >
                                    #{tag.name}
                                </span>
                            )
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 truncate">
                    {mode === "public" && snippet.author?.username && (
                        <span className="font-medium text-foreground">
                            @{snippet.author.username}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(snippet.created_at)}
                    </span>
                </div>

                {mode === "public" && publicHref ? (
                    <Link
                        href={publicHref}
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                        <span>Lihat</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-1">
                        {publicHref && (
                            <Button asChild variant="ghost" size="icon-xs" title="Buka link publik">
                                <Link href={publicHref} aria-label="Buka halaman publik snippet">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        )}
                        <Button asChild variant="ghost" size="icon-xs" title="Edit snippet">
                            <Link
                                href={`/snippets/${snippet.id}/edit`}
                                aria-label="Edit snippet"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                        {onDelete && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                disabled={isDeleting}
                                onClick={() => onDelete(snippet.id)}
                                aria-label="Hapus snippet"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
