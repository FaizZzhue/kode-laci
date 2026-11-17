"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { SnippetForm } from "@/components/snippets/snippet-form";
import { createSnippet, extractApiError } from "@/lib/snippet-api";
import type { SnippetPayload } from "@/types";

export default function NewSnippetPage() {
    const router = useRouter();

    async function handleCreate(values: SnippetPayload) {
        try {
            await createSnippet(values);
            router.push("/dashboard");
        } catch (err) {
            throw new Error(extractApiError(err, "Gagal membuat snippet."));
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-container-max flex-col gap-6 px-gutter py-8 lg:flex-row lg:py-10">
            <Sidebar />

            <main className="min-w-0 flex-1 space-y-6">
                <div className="border-b border-border pb-5">
                    <Link
                        href="/dashboard"
                        className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        kembali ke laci
                    </Link>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Simpan Snippet Baru
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Atur sebagai draft private atau publikasikan untuk mendapat URL unik.
                    </p>
                </div>

                <SnippetForm
                    submitLabel="Simpan ke Laci"
                    onSubmit={handleCreate}
                    onCancel={() => router.push("/dashboard")}
                />
            </main>
        </div>
    );
}
