import { codeToHtml, bundledLanguages } from "shiki";
import { CopyButton } from "@/components/snippets/copy-button";
import { getLanguageLabel } from "@/constants/languages";

type CodeBlockProps = {
    code: string;
    language: string;
    title?: string;
};

export async function CodeBlock({ code, language, title }: CodeBlockProps) {
    const normalizedLang = language.toLowerCase();
    const isSupported = normalizedLang in bundledLanguages;

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
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-secondary-foreground">
                        {getLanguageLabel(language)}
                    </span>
                    {title && <span className="hidden truncate sm:inline">{title}</span>}
                </div>
                <CopyButton text={code} />
            </div>

            {highlightedHtml ? (
                <div
                    className="overflow-x-auto p-4 font-mono text-sm leading-relaxed [&>pre]:m-0 [&>pre]:bg-transparent!"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
            ) : (
                <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-foreground">
                    <code>{code}</code>
                </pre>
            )}
        </div>
    );
}
