"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe, Loader2, Lock, Plus, X } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { useSnippetForm } from "@/hooks/use-snippet-form";
import { Button } from "@/components/ui/button";
import type { SnippetFormProps } from "@/types/components";

export function SnippetForm({
    initialValues,
    submitLabel,
    onSubmit,
    onCancel,
}: SnippetFormProps) {
    const {
        title,
        setTitle,
        description,
        setDescription,
        language,
        setLanguage,
        code,
        setCode,
        isPublic,
        setIsPublic,
        tags,
        tagInput,
        setTagInput,
        error,
        isSubmitting,
        previewSlug,
        lineCount,
        addTag,
        removeTag,
        handleTagKeyDown,
        handleCodeKeyDown,
        handleSubmit,
    } = useSnippetForm(initialValues, onSubmit);

    return (
        <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-5 py-2.5 font-mono text-xs">
                <div className="flex items-center gap-2">
                    {isPublic ? (
                        <>
                            <Globe className="h-3.5 w-3.5 text-accent-code" />
                            <span className="text-accent-code">/s/{previewSlug}</span>
                        </>
                    ) : (
                        <>
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Draft private · hanya Anda yang dapat membuka
                            </span>
                        </>
                    )}
                </div>
                <span className="text-muted-foreground">
                    {lineCount} baris · {code.length} karakter
                </span>
            </div>

            <div className="space-y-6 p-6">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                        className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                        {error}
                    </motion.div>
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
                            placeholder="Misal: React useDebounce Hook"
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
                            placeholder="Jelaskan kapan dan bagaimana kode ini dipakai (minimal 10 karakter)..."
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
                                        ? "border-accent-code bg-accent-code/10 text-accent-code"
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
                            <AnimatePresence>
                                {tags.map((tag) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.85 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.85 }}
                                        transition={{ duration: 0.14 }}
                                        className="inline-flex items-center gap-1 rounded border border-border bg-surface px-2.5 py-0.5 font-mono text-xs font-medium text-foreground"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            aria-label={`Hapus tag ${tag}`}
                                            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="snippet-code" className="text-sm font-medium text-foreground">
                            Potongan Kode
                        </label>
                        <span className="font-mono text-[11px] text-muted-foreground">
                            Tab menyisipkan 2 spasi
                        </span>
                    </div>
                    <textarea
                        id="snippet-code"
                        required
                        minLength={10}
                        rows={14}
                        spellCheck={false}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={handleCodeKeyDown}
                        placeholder="// Tempel atau tulis kode Anda di sini..."
                        className="w-full rounded-lg border border-input bg-surface p-4 font-mono text-[13px] leading-6 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
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
            </div>
        </form>
    );
}
