"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Compass, FolderCode, Moon, Plus, Search, Sun } from "lucide-react";
import { Dock } from "@/components/reactbits/dock";
import { useAuth } from "@/hooks/use-auth";
import { useMounted } from "@/hooks/use-mounted";
import type { DockItemConfig } from "@/types/reactbits";

export function FloatingDock() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useMounted();

    const isDark = mounted && resolvedTheme === "dark";

    function focusSearchOrNavigate() {
        if (pathname === "/") {
            const input = document.getElementById("explore-search-input") as HTMLInputElement | null;
            if (input) {
                input.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => input.focus(), 180);
                return;
            }
        }
        router.push("/#explore");
    }

    const items: DockItemConfig[] = [
        {
            id: "explore",
            label: "Jelajah Publik",
            icon: <Compass className="h-4 w-4" />,
            active: pathname === "/" || pathname.startsWith("/s/"),
            onClick: () => router.push("/#explore"),
        },
        {
            id: "search",
            label: "Cari Cepat (/)",
            icon: <Search className="h-4 w-4" />,
            onClick: focusSearchOrNavigate,
        },
        {
            id: "dashboard",
            label: isAuthenticated ? "Laci Saya" : "Masuk ke Laci",
            icon: <FolderCode className="h-4 w-4" />,
            active: pathname.startsWith("/dashboard"),
            onClick: () => router.push(isAuthenticated ? "/dashboard" : "/login"),
        },
        {
            id: "new",
            label: "Tulis Snippet Baru",
            icon: <Plus className="h-4 w-4" />,
            active: pathname.startsWith("/snippets"),
            onClick: () => router.push(isAuthenticated ? "/snippets/new" : "/register"),
        },
        {
            id: "theme",
            label: isDark ? "Mode Terang" : "Mode Gelap",
            icon: isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
            onClick: () => setTheme(isDark ? "light" : "dark"),
        },
    ];

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 hidden justify-center md:flex">
            <Dock items={items} className="pointer-events-auto" />
        </div>
    );
}
