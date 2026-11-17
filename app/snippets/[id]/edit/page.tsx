"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { SnippetForm } from "@/components/snippets/snippet-form";
import {
    extractApiError,
    fetchMySnippetById,
    updateSnippet,
    type SnippetPayload,
} from "@/hooks/use-snippets";
import type { Snippet } from "@/types";

export default function EditSnippetPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();

    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        fetchMySnippetById(id)
            .then((data) => {
                if (active) {
                    setSnippet(data);
                }
            })
            .catch((err) => {
                if (active) {
                    setLoadError(extractApiError(err, "Gagal memuat detail snippet."));
                }
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [id]);

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
        <div className="mx-auto flex w-full max-w-container-max flex-col gap-6 px-gutter py-10 lg:flex-row">
            <Sidebar />

            <main className="min-w-0 flex-1 space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Edit Snippet
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui isi kode, tag, atau visibilitas snippet Anda.
                        </p>
                    </div>

                    {snippet?.is_public && snippet.slug && (
                        <Link
                            href={`/s/${snippet.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        >
                            <span>Lihat Halaman Publik</span>
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex min-h-56 items-center justify-center rounded-xl border border-border bg-card/40">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Memuat snippet...</span>
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
                        submitLabel="Perbarui Snippet"
                        onSubmit={handleUpdate}
                        onCancel={() => router.push("/dashboard")}
                    />
                )}
            </main>
        </div>
    );
}
