import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
    const slug = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50);

    return slug || "snippet";
}

export function getLanguageLabel(value: string): string {
    const found = SUPPORTED_LANGUAGES.find((item) => item.value === value.toLowerCase());
    return found ? found.label : value;
}

export function getRouteContextLabel(pathname: string): string {
    if (pathname === "/") return "~/jelajah";
    if (pathname.startsWith("/dashboard")) return "~/laci-saya";
    if (pathname.startsWith("/snippets/new")) return "~/tulis-snippet";
    if (pathname.includes("/edit")) return "~/edit-snippet";
    if (pathname.startsWith("/s/")) return "~/publik";
    if (pathname === "/login") return "~/masuk";
    if (pathname === "/register") return "~/daftar";
    return "~";
}
