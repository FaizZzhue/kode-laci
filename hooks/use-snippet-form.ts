"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { slugify } from "@/lib/utils";
import type { SnippetPayload } from "@/types";

export function useSnippetForm(
    initialValues: Partial<SnippetPayload> | undefined,
    onSubmit: (values: SnippetPayload) => Promise<void>
) {
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [description, setDescription] = useState(initialValues?.description ?? "");
    const [language, setLanguage] = useState(initialValues?.language ?? "typescript");
    const [code, setCode] = useState(initialValues?.code ?? "");
    const [isPublic, setIsPublic] = useState(initialValues?.is_public ?? false);
    const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
    const [tagInput, setTagInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const previewSlug = title.trim() ? `${slugify(title)}-xxxxxx` : "judul-snippet-xxxxxx";
    const lineCount = code ? code.split(/\r?\n/).length : 0;

    function addTag(raw: string) {
        const clean = raw.trim().toLowerCase();
        if (!clean || tags.includes(clean) || tags.length >= 10) {
            return;
        }
        setTags((prev) => [...prev, clean.slice(0, 30)]);
        setTagInput("");
    }

    function removeTag(target: string) {
        setTags((prev) => prev.filter((item) => item !== target));
    }

    function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addTag(tagInput);
        }
    }

    function handleCodeKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Tab") {
            event.preventDefault();
            const target = event.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const nextCode = `${code.slice(0, start)}  ${code.slice(end)}`;
            setCode(nextCode);
            requestAnimationFrame(() => {
                target.selectionStart = start + 2;
                target.selectionEnd = start + 2;
            });
        }
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

    return {
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
    };
}
