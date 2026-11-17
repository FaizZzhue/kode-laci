import type { Snippet, SnippetPayload, VisibilityFilter } from "@/types";

export type AuthShellProps = {
    eyebrow: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
};

export type LogoProps = {
    className?: string;
};

export type SidebarProps = {
    visibility?: VisibilityFilter;
    onVisibilityChange?: (visibility: VisibilityFilter) => void;
    totalSnippets?: number;
};

export type CodeBlockProps = {
    code: string;
    language: string;
    title?: string;
};

export type CopyButtonProps = {
    text: string;
    label?: string;
    className?: string;
};

export type ShareUrlButtonProps = {
    slug: string;
    compact?: boolean;
};

export type ForkButtonProps = {
    snippetId: string;
    authorUsername?: string | null;
    forkCount?: number;
};

export type SnippetCardProps = {
    snippet: Snippet;
    mode: "public" | "owner";
    onDelete?: (id: string) => void;
    isDeleting?: boolean;
    onTagClick?: (slug: string) => void;
    index?: number;
};

export type SnippetFormProps = {
    initialValues?: Partial<SnippetPayload>;
    submitLabel: string;
    onSubmit: (values: SnippetPayload) => Promise<void>;
    onCancel?: () => void;
};
