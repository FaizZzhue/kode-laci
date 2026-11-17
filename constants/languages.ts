export type LanguageOption = {
    value: string;
    label: string;
};

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "tsx", label: "TSX" },
    { value: "jsx", label: "JSX" },
    { value: "python", label: "Python" },
    { value: "sql", label: "SQL" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "java", label: "Java" },
    { value: "php", label: "PHP" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "dart", label: "Dart" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "bash", label: "Bash / Shell" },
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "markdown", label: "Markdown" },
] as const;

export function getLanguageLabel(value: string): string {
    const found = SUPPORTED_LANGUAGES.find((item) => item.value === value.toLowerCase());
    return found ? found.label : value;
}
