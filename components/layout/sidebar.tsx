"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Code2, Compass, Globe, Lock, Plus } from "lucide-react";
import { DRAWER_TABS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import type { VisibilityFilter } from "@/types";
import type { SidebarProps } from "@/types/components";

const TAB_ICONS: Record<VisibilityFilter, typeof Code2> = {
    all: Code2,
    public: Globe,
    private: Lock,
};

export default function Sidebar({
    visibility = "all",
    onVisibilityChange,
    totalSnippets,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-full shrink-0 lg:w-60">
            <div className="sticky top-24 space-y-4">
                <div className="rounded-xl border border-border bg-card p-3.5">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Indeks Laci
                        </span>
                        {typeof totalSnippets === "number" && (
                            <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] font-medium text-secondary-foreground">
                                {totalSnippets}
                            </span>
                        )}
                    </div>

                    <nav className="flex flex-col gap-1" aria-label="Filter visibilitas laci">
                        {DRAWER_TABS.map((item) => {
                            const Icon = TAB_ICONS[item.value];
                            const isActive =
                                pathname === "/dashboard" && visibility === item.value;

                            if (onVisibilityChange && pathname === "/dashboard") {
                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => onVisibilityChange(item.value)}
                                        className={cn(
                                            "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                                            isActive
                                                ? "text-primary-foreground"
                                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="sidebar-vis-pill"
                                                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                                className="absolute inset-0 rounded-lg bg-foreground dark:bg-primary"
                                            />
                                        )}
                                        <Icon className="relative z-10 h-4 w-4" />
                                        <span className="relative z-10">{item.label}</span>
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={item.value}
                                    href={item.href}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-4 space-y-2 border-t border-border pt-3.5">
                        <Link
                            href="/snippets/new"
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Simpan Kode Baru</span>
                        </Link>
                        <Link
                            href="/#explore"
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Compass className="h-3.5 w-3.5" />
                            <span>Jelajah Publik</span>
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}
