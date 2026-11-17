"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Globe, Lock, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
    visibility?: "all" | "public" | "private";
    onVisibilityChange?: (visibility: "all" | "public" | "private") => void;
    totalSnippets?: number;
};

export default function Sidebar({
    visibility = "all",
    onVisibilityChange,
    totalSnippets,
}: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Semua Snippet",
            value: "all" as const,
            icon: Code2,
            href: "/dashboard",
        },
        {
            label: "Snippet Publik",
            value: "public" as const,
            icon: Globe,
            href: "/dashboard?visibility=public",
        },
        {
            label: "Snippet Private",
            value: "private" as const,
            icon: Lock,
            href: "/dashboard?visibility=private",
        },
    ];

    return (
        <aside className="w-full shrink-0 lg:w-60">
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Laci Saya
                    </h2>
                    {typeof totalSnippets === "number" && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            {totalSnippets}
                        </span>
                    )}
                </div>

                <nav className="flex flex-col gap-1" aria-label="Navigasi dashboard">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === "/dashboard" && visibility === item.value;

                        if (onVisibilityChange && pathname === "/dashboard") {
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => onVisibilityChange(item.value)}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.value}
                                href={item.href}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-4 border-t border-border pt-4">
                    <Link
                        href="/snippets/new"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Snippet Baru</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
