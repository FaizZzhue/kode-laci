import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, GitFork, User as UserIcon } from "lucide-react";
import { getPublicSnippetBySlug } from "@/lib/public-snippets";
import { getLanguageLabel } from "@/constants/languages";
import { CodeBlock } from "@/components/snippets/code-block";
import { ForkButton } from "@/components/snippets/fork-button";

export const dynamic = "force-dynamic";

type PublicSnippetPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: PublicSnippetPageProps): Promise<Metadata> {
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

export default async function PublicSnippetPage({ params }: PublicSnippetPageProps) {
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
            <div className="mb-6">
                <Link
                    href="/#explore"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Kembali ke Explore</span>
                </Link>
            </div>

            <header className="mb-6 rounded-xl border border-border bg-card p-6 shadow-xs">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-primary">
                                {getLanguageLabel(snippet.language)}
                            </span>
                            {snippet.forked_from && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                                    <GitFork className="h-3 w-3" />
                                    Forked Snippet
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {snippet.title}
                        </h1>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {snippet.description}
                        </p>
                    </div>

                    <ForkButton
                        snippetId={snippet.id}
                        authorUsername={snippet.author?.username}
                        forkCount={snippet.fork_count}
                    />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
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
                                    className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground"
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
