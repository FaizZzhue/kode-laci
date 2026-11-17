import type { DrawerSampleTab, SearchPresetItem } from "@/types";
import type { FolderItem } from "@/types/reactbits";

export const DRAWER_SAMPLES: readonly DrawerSampleTab[] = [
    {
        id: "ts",
        filename: "useDebounce.ts",
        langLabel: "TypeScript",
        slug: "/s/react-usedebounce-8f3k2a",
        isPublic: true,
        tags: ["react", "hooks", "typescript"],
        lines: [
            'import { useEffect, useState } from "react";',
            "",
            "export function useDebounce<T>(value: T, ms = 300): T {",
            "  const [debounced, setDebounced] = useState(value);",
            "  useEffect(() => {",
            "    const id = setTimeout(() => setDebounced(value), ms);",
            "    return () => clearTimeout(id);",
            "  }, [value, ms]);",
            "  return debounced;",
            "}",
        ],
    },
    {
        id: "sql",
        filename: "fts_prefix.sql",
        langLabel: "SQL",
        slug: "/s/postgres-fts-prefix-4d9c1b",
        isPublic: true,
        tags: ["postgresql", "fts", "supabase"],
        lines: [
            "SELECT id, title, language, slug",
            "FROM public.snippets",
            "WHERE is_public = true",
            "  AND search_vector @@ to_tsquery('simple', 'reac:*')",
            "ORDER BY created_at DESC",
            "LIMIT 20;",
        ],
    },
    {
        id: "py",
        filename: "retry_backoff.py",
        langLabel: "Python",
        slug: null,
        isPublic: false,
        tags: ["python", "retry"],
        lines: [
            "import time",
            "from functools import wraps",
            "",
            "def retry(tries: int = 3, delay: float = 0.4):",
            "    def wrap(fn):",
            "        @wraps(fn)",
            "        def inner(*a, **kw):",
            "            for i in range(1, tries + 1):",
            "                try: return fn(*a, **kw)",
            "                except Exception:",
            "                    if i == tries: raise",
            "                    time.sleep(delay * i)",
            "        return inner",
            "    return wrap",
        ],
    },
] as const;

export const SEARCH_PRESETS: readonly SearchPresetItem[] = [
    {
        query: "reac",
        matchedBy: ["FTS prefix `reac:*`", "Tag `#react`"],
        resultTitle: "React useDebounce Custom Hook",
        lang: "typescript",
    },
    {
        query: "deb",
        matchedBy: ["Substring `title.ilike.%deb%`", "Isi kode `setDebounced`"],
        resultTitle: "React useDebounce Custom Hook",
        lang: "typescript",
    },
    {
        query: "ts_rank",
        matchedBy: ["FTS `ts_rank`", "Isi kode SQL"],
        resultTitle: "PostgreSQL Weighted Full-Text Search",
        lang: "sql",
    },
] as const;

export const HERO_FOLDER_ITEMS: FolderItem[] = DRAWER_SAMPLES.map((sample) => ({
    id: sample.id,
    label: sample.filename,
    meta: sample.langLabel,
}));
