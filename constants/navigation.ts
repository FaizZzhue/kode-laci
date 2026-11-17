import type { DrawerNavItem } from "@/types";
import type { CardNavSection } from "@/types/reactbits";

export const DRAWER_TABS: readonly DrawerNavItem[] = [
    {
        label: "Semua Laci",
        value: "all",
        href: "/dashboard",
    },
    {
        label: "Publik (/s/)",
        value: "public",
        href: "/dashboard?visibility=public",
    },
    {
        label: "Draft Private",
        value: "private",
        href: "/dashboard?visibility=private",
    },
] as const;

export const PUBLIC_NAVIGATION_ITEMS = [
    { label: "Jelajah", href: "/#explore", matchPrefixes: ["/", "/s/"] },
    { label: "Arsitektur", href: "/#alur", matchPrefixes: [] },
] as const;

export const AUTH_NAVIGATION_ITEMS = [
    { label: "Jelajah", href: "/", matchPrefixes: ["/", "/s/"] },
    { label: "Laci Saya", href: "/dashboard", matchPrefixes: ["/dashboard"] },
    { label: "Tulis Kode", href: "/snippets/new", matchPrefixes: ["/snippets"] },
] as const;

export const CARD_NAV_SECTIONS: readonly CardNavSection[] = [
    {
        index: "01",
        title: "Jelajah Publik",
        description: "Cari snippet komunitas dengan prefix & tag.",
        href: "/#explore",
        accentClass: "border-primary/30 bg-primary/8 text-primary",
    },
    {
        index: "02",
        title: "Laci Pribadi",
        description: "Kelola draft private dan link /s/slug Anda.",
        href: "/dashboard",
        accentClass: "border-accent-code/30 bg-accent-code/10 text-accent-code",
        requiresAuth: true,
    },
    {
        index: "03",
        title: "Simpan Snippet",
        description: "Tulis kode baru lengkap dengan Shiki & tag.",
        href: "/snippets/new",
        accentClass: "border-border bg-secondary text-foreground",
        requiresAuth: true,
    },
] as const;
