"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ExternalLink, GitFork, Globe, Lock, Pencil, Trash2 } from "lucide-react";
import { getLanguageLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShareUrlButton } from "@/components/snippets/share-url-button";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import type { SnippetCardProps } from "@/types/components";

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
    index = 0,
}: SnippetCardProps) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const publicHref = snippet.slug ? `/s/${snippet.slug}` : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.24, delay: Math.min(index * 0.035, 0.2) }}
            whileHover={{ y: -2 }}
        >
            <SpotlightCard
                spotlightColor={
                    snippet.is_public
                        ? "rgba(15, 118, 110, 0.14)"
                        : "rgba(217, 78, 31, 0.14)"
                }
                className="group flex h-full flex-col justify-between p-5 hover:border-primary/40 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/30"
            >
                <article className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2 py-0.5 font-mono text-[11px] font-medium text-foreground">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                {getLanguageLabel(snippet.language)}
                            </span>

                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                                {snippet.forked_from && (
                                    <span
                                        className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-secondary-foreground"
                                        title="Hasil fork dari snippet publik"
                                    >
                                        <GitFork className="h-3 w-3" />
                                        fork
                                    </span>
                                )}
                                {mode === "owner" && (
                                    <span
                                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium ${
                                            snippet.is_public
                                                ? "bg-accent-code/10 text-accent-code"
                                                : "bg-secondary text-muted-foreground"
                                        }`}
                                    >
                                        {snippet.is_public ? (
                                            <>
                                                <Globe className="h-3 w-3" />
                                                publik
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-3 w-3" />
                                                private
                                            </>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>

                        <h3 className="font-display mb-1.5 text-base font-semibold tracking-tight text-foreground">
                            {mode === "public" && publicHref ? (
                                <Link
                                    href={publicHref}
                                    className="transition-colors group-hover:text-primary"
                                >
                                    {snippet.title}
                                </Link>
                            ) : (
                                <Link
                                    href={`/snippets/${snippet.id}/edit`}
                                    className="transition-colors group-hover:text-primary"
                                >
                                    {snippet.title}
                                </Link>
                            )}
                        </h3>

                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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
                                            className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                                        >
                                            #{tag.name}
                                        </button>
                                    ) : (
                                        <span
                                            key={tag.id}
                                            className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                                        >
                                            #{tag.name}
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex min-h-8 items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 truncate font-mono text-[11px]">
                            {mode === "public" && snippet.author?.username && (
                                <span className="font-medium text-foreground">
                                    @{snippet.author.username}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(snippet.created_at)}
                            </span>
                        </div>

                        {mode === "public" && publicHref ? (
                            <Link
                                href={publicHref}
                                className="inline-flex items-center gap-1 font-mono text-xs font-medium text-primary transition-transform hover:translate-x-0.5"
                            >
                                <span>buka</span>
                                <ExternalLink className="h-3 w-3" />
                            </Link>
                        ) : (
                            <AnimatePresence mode="wait" initial={false}>
                                {confirmingDelete && onDelete ? (
                                    <motion.div
                                        key="confirm-delete"
                                        initial={{ opacity: 0, x: 8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 8 }}
                                        transition={{ duration: 0.14 }}
                                        className="flex items-center gap-1"
                                    >
                                        <span className="font-mono text-[11px] text-destructive">
                                            Hapus?
                                        </span>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="xs"
                                            disabled={isDeleting}
                                            onClick={() => onDelete(snippet.id)}
                                        >
                                            Ya
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="xs"
                                            disabled={isDeleting}
                                            onClick={() => setConfirmingDelete(false)}
                                        >
                                            Batal
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="actions"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.14 }}
                                        className="flex items-center gap-1"
                                    >
                                        {snippet.is_public && snippet.slug && (
                                            <ShareUrlButton slug={snippet.slug} compact />
                                        )}
                                        {publicHref && (
                                            <Button asChild variant="ghost" size="icon-xs" title="Buka halaman publik">
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
                                                onClick={() => setConfirmingDelete(true)}
                                                aria-label="Hapus snippet"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </article>
            </SpotlightCard>
        </motion.div>
    );
}
