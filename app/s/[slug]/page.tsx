import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, GitFork, User as UserIcon } from "lucide-react";
import { getPublicSnippetBySlug } from "@/lib/public-snippets";
import { getLanguageLabel } from "@/lib/utils";
import { CodeBlock } from "@/components/snippets/code-block";
import { ForkButton } from "@/components/snippets/fork-button";
import { ShareUrlButton } from "@/components/snippets/share-url-button";
import type { RouteSlugParams } from "@/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: RouteSlugParams): Promise<Metadata> {
    const { slug } = await params;

    try {
        const snippet = await getPublicSnippetBySlug(slug);
        if (!snippet) {
            return { title: "Snippet Tidak Ditemukan" };
        }
        return {
            title: snippet.title,
            description: snippet.description,
        };
    } catch {
        return { title: "Public Snippet" };
    }
}

export default async function PublicSnippetPage({ params }: RouteSlugParams) {
    const { slug } = await params;

    let snippet = null;
    try {
        snippet = await getPublicSnippetBySlug(slug);
    } catch {
        notFound();
    }

    if (!snippet) {
        notFound();
    }

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(snippet.created_at));

    return (
        <main className="mx-auto w-full max-w-4xl flex-1 px-gutter py-10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/#explore"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>kembali ke indeks publik</span>
                </Link>

                <span className="font-mono text-xs text-muted-foreground">
                    /s/{snippet.slug}
                </span>
            </div>

            <header className="mb-6 rounded-xl border border-border bg-card p-6 shadow-xs">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                            <span className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2.5 py-0.5 font-medium text-foreground">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                {getLanguageLabel(snippet.language)}
                            </span>
                            {snippet.forked_from && (
                                <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-secondary-foreground">
                                    <GitFork className="h-3 w-3" />
                                    hasil fork
                                </span>
                            )}
                        </div>

                        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {snippet.title}
                        </h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            {snippet.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-start gap-2 sm:shrink-0">
                        {snippet.slug && <ShareUrlButton slug={snippet.slug} />}
                        <ForkButton
                            snippetId={snippet.id}
                            authorUsername={snippet.author?.username}
                            forkCount={snippet.fork_count}
                        />
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-4">
                        {snippet.author?.username && (
                            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                                <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                @{snippet.author.username}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formattedDate}
                        </span>
                    </div>

                    {snippet.tags && snippet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {snippet.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded border border-border bg-surface px-2.5 py-0.5 text-muted-foreground"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <CodeBlock
                code={snippet.code}
                language={snippet.language}
                title={snippet.title}
            />
        </main>
    );
}
