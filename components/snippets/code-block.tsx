import { bundledLanguages, codeToHtml } from "shiki";
import { CopyButton } from "@/components/snippets/copy-button";
import { getLanguageLabel } from "@/lib/utils";
import type { CodeBlockProps } from "@/types/components";

export async function CodeBlock({ code, language, title }: CodeBlockProps) {
    const normalizedLang = language.toLowerCase();
    const isSupported = normalizedLang in bundledLanguages;
    const lineCount = code.split(/\r?\n/).length;

    let highlightedHtml: string | null = null;
    if (isSupported) {
        try {
            highlightedHtml = await codeToHtml(code, {
                lang: normalizedLang,
                themes: {
                    light: "github-light",
                    dark: "github-dark",
                },
            });
        } catch {
            highlightedHtml = null;
        }
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2.5">
                <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
                    <span className="rounded border border-border bg-card px-2 py-0.5 font-semibold text-foreground">
                        {getLanguageLabel(language)}
                    </span>
                    {title && (
                        <span className="hidden max-w-xs truncate sm:inline">{title}</span>
                    )}
                    <span className="text-border">·</span>
                    <span>{lineCount} baris</span>
                </div>
                <CopyButton text={code} />
            </div>

            {highlightedHtml ? (
                <div
                    className="overflow-x-auto p-5 font-mono text-[13px] leading-6 [&>pre]:m-0 [&>pre]:bg-transparent!"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
            ) : (
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-foreground">
                    <code>{code}</code>
                </pre>
            )}
        </div>
    );
}
