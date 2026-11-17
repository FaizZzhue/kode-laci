"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { Globe, Loader2, Lock, Plus, X } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { Button } from "@/components/ui/button";
import type { SnippetPayload } from "@/hooks/use-snippets";

type SnippetFormProps = {
    initialValues?: Partial<SnippetPayload>;
    submitLabel: string;
    onSubmit: (values: SnippetPayload) => Promise<void>;
    onCancel?: () => void;
};

export function SnippetForm({
    initialValues,
    submitLabel,
    onSubmit,
    onCancel,
}: SnippetFormProps) {
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [description, setDescription] = useState(initialValues?.description ?? "");
    const [language, setLanguage] = useState(initialValues?.language ?? "typescript");
    const [code, setCode] = useState(initialValues?.code ?? "");
    const [isPublic, setIsPublic] = useState(initialValues?.is_public ?? false);
    const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
    const [tagInput, setTagInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function addTag(raw: string) {
        const clean = raw.trim().toLowerCase();
        if (!clean || tags.includes(clean) || tags.length >= 10) {
            return;
        }
        setTags((prev) => [...prev, clean.slice(0, 30)]);
        setTagInput("");
    }

    function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addTag(tagInput);
        }
    }

    function removeTag(target: string) {
        setTags((prev) => prev.filter((item) => item !== target));
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);

        if (title.trim().length < 3) {
            setError("Judul minimal 3 karakter.");
            return;
        }
        if (description.trim().length < 10) {
            setError("Deskripsi minimal 10 karakter.");
            return;
        }
        if (code.length < 10) {
            setError("Kode minimal 10 karakter.");
            return;
        }

        const pendingTags = tagInput.trim()
            ? Array.from(new Set([...tags, tagInput.trim().toLowerCase()])).slice(0, 10)
            : tags;

        setIsSubmitting(true);
        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                language,
                code,
                is_public: isPublic,
                tags: pendingTags,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menyimpan snippet.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-xs">
            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {error}
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="snippet-title" className="text-sm font-medium text-foreground">
                        Judul Snippet
                    </label>
                    <input
                        id="snippet-title"
                        type="text"
                        required
                        minLength={3}
                        maxLength={100}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Misal: Debounce Hook TypeScript"
                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                </div>

                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="snippet-description" className="text-sm font-medium text-foreground">
                        Deskripsi Singkat
                    </label>
                    <textarea
                        id="snippet-description"
                        required
                        minLength={10}
                        maxLength={500}
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Jelaskan kegunaan potongan kode ini (minimal 10 karakter)..."
                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="snippet-language" className="text-sm font-medium text-foreground">
                        Bahasa Pemrograman
                    </label>
                    <select
                        id="snippet-language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <span className="block text-sm font-medium text-foreground">Visibilitas</span>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setIsPublic(false)}
                            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                                !isPublic
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-input bg-background text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Lock className="h-4 w-4" />
                            Private
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPublic(true)}
                            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                                isPublic
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "border-input bg-background text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Globe className="h-4 w-4" />
                            Publik
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="snippet-tags" className="text-sm font-medium text-foreground">
                    Tags (maksimal 10)
                </label>
                <div className="flex gap-2">
                    <input
                        id="snippet-tags"
                        type="text"
                        maxLength={30}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Ketik tag lalu tekan Enter (misal: react, hooks)"
                        className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addTag(tagInput)}
                        disabled={!tagInput.trim() || tags.length >= 10}
                    >
                        <Plus className="h-4 w-4" />
                        Tambah
                    </Button>
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                            >
                                #{tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    aria-label={`Hapus tag ${tag}`}
                                    className="rounded-full p-0.5 hover:bg-background/60"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="snippet-code" className="text-sm font-medium text-foreground">
                    Potongan Kode
                </label>
                <textarea
                    id="snippet-code"
                    required
                    minLength={10}
                    rows={14}
                    spellCheck={false}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="// Tempel atau tulis kode Anda di sini..."
                    className="w-full rounded-lg border border-input bg-background p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        Batal
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
