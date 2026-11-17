"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import { SnippetForm } from "@/components/snippets/snippet-form";
import { createSnippet, extractApiError, type SnippetPayload } from "@/hooks/use-snippets";

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
        <div className="mx-auto flex w-full max-w-container-max flex-col gap-6 px-gutter py-10 lg:flex-row">
            <Sidebar />

            <main className="min-w-0 flex-1 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Buat Snippet Baru
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Simpan potongan kode baru ke laci pribadi atau publikasikan untuk tim/komunitas.
                    </p>
                </div>

                <SnippetForm
                    submitLabel="Simpan Snippet"
                    onSubmit={handleCreate}
                    onCancel={() => router.push("/dashboard")}
                />
            </main>
        </div>
    );
}
