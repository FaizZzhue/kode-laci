"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { SnippetForm } from "@/components/snippets/snippet-form";
import { useMySnippetDetail } from "@/hooks/use-snippets";
import { extractApiError, updateSnippet } from "@/lib/snippet-api";
import type { RouteIdParams, SnippetPayload } from "@/types";

export default function EditSnippetPage({ params }: RouteIdParams) {
    const { id } = use(params);
    const router = useRouter();
    const { snippet, setSnippet, isLoading, error: loadError } = useMySnippetDetail(id);

    async function handleUpdate(values: SnippetPayload) {
        try {
            const updated = await updateSnippet(id, values);
            setSnippet(updated);
            router.push("/dashboard");
        } catch (err) {
            throw new Error(extractApiError(err, "Gagal memperbarui snippet."));
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-container-max flex-col gap-6 px-gutter py-8 lg:flex-row lg:py-10">
            <Sidebar />

            <main className="min-w-0 flex-1 space-y-6">
                <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Link
                            href="/dashboard"
                            className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            kembali ke laci
                        </Link>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Edit Snippet
                        </h1>
                    </div>

                    {snippet?.is_public && snippet.slug && (
                        <Link
                            href={`/s/${snippet.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs font-medium text-accent-code transition-colors hover:border-accent-code/50"
                        >
                            <span>/s/{snippet.slug}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex min-h-56 items-center justify-center rounded-xl border border-border bg-card/50">
                        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span>memuat isi snippet...</span>
                        </div>
                    </div>
                ) : loadError || !snippet ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                        {loadError ?? "Snippet tidak ditemukan."}
                    </div>
                ) : (
                    <SnippetForm
                        initialValues={{
                            title: snippet.title,
                            description: snippet.description,
                            language: snippet.language,
                            code: snippet.code ?? "",
                            is_public: snippet.is_public,
                            tags: snippet.tags?.map((t) => t.name) ?? [],
                        }}
                        submitLabel="Simpan Perubahan"
                        onSubmit={handleUpdate}
                        onCancel={() => router.push("/dashboard")}
                    />
                )}
            </main>
        </div>
    );
}
