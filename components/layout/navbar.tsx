"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Compass, LogOut, Menu, Plus, Search, X } from "lucide-react";
import { CARD_NAV_SECTIONS } from "@/constants/navigation";
import { useAuth } from "@/hooks/use-auth";
import { KodeLaciLogo } from "@/components/brand/kodelaci-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Magnet } from "@/components/reactbits/magnet";
import { ClickSpark } from "@/components/reactbits/click-spark";
import { Button } from "@/components/ui/button";
import { cn, getRouteContextLabel } from "@/lib/utils";

export default function Navbar() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [cardNavOpen, setCardNavOpen] = useState(false);

    const routeLabel = getRouteContextLabel(pathname);

    function handleQuickSearch() {
        setCardNavOpen(false);
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

    function resolveSectionHref(href: string, requiresAuth?: boolean): string {
        if (requiresAuth && !isAuthenticated) {
            return `/login?redirect=${encodeURIComponent(href)}`;
        }
        return href;
    }

    return (
        <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-gutter">
            <div className="pointer-events-auto mx-auto max-w-container-max overflow-hidden rounded-2xl border border-border/90 bg-card/85 shadow-lg shadow-black/5 backdrop-blur-xl dark:shadow-black/35">
                <div className="flex h-14 items-center justify-between gap-3 px-4">
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setCardNavOpen((prev) => !prev)}
                            aria-expanded={cardNavOpen}
                            aria-label={cardNavOpen ? "Tutup indeks navigasi" : "Buka indeks navigasi"}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary/40"
                        >
                            {cardNavOpen ? (
                                <X className="h-3.5 w-3.5 text-primary" />
                            ) : (
                                <Menu className="h-3.5 w-3.5" />
                            )}
                            <span className="hidden sm:inline">Indeks</span>
                        </button>

                        <Link
                            href="/"
                            onClick={() => setCardNavOpen(false)}
                            className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-85"
                        >
                            <KodeLaciLogo className="h-5 w-5 text-foreground" />
                            <span className="font-display text-base font-bold tracking-tight">
                                KodeLaci
                            </span>
                        </Link>

                        <span className="hidden items-center gap-1.5 border-l border-border pl-2.5 font-mono text-[11px] text-muted-foreground md:inline-flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {routeLabel}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleQuickSearch}
                            className="inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                            title="Cari snippet publik"
                        >
                            <Search className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Cari</span>
                            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground sm:inline">
                                /
                            </kbd>
                        </button>

                        <ThemeToggle />

                        {isLoading ? (
                            <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
                        ) : isAuthenticated && user ? (
                            <div className="flex items-center gap-1.5 border-l border-border pl-2">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setCardNavOpen(false)}
                                    className="hidden h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary/40 sm:inline-flex"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent-code" />
                                    <span>@{user.username}</span>
                                </Link>
                                <ClickSpark sparkColor="#fffaf7">
                                    <Link
                                        href="/snippets/new"
                                        onClick={() => setCardNavOpen(false)}
                                        className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-95"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Simpan</span>
                                    </Link>
                                </ClickSpark>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label="Keluar dari akun"
                                    title="Keluar"
                                    onClick={() => {
                                        setCardNavOpen(false);
                                        logout();
                                    }}
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 border-l border-border pl-2">
                                <Link
                                    href="/login"
                                    onClick={() => setCardNavOpen(false)}
                                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Masuk
                                </Link>
                                <Magnet magnetStrength={4} padding={40}>
                                    <Link
                                        href="/register"
                                        onClick={() => setCardNavOpen(false)}
                                        className="group inline-flex h-8 items-center gap-1 rounded-lg bg-foreground px-3 text-xs font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                                    >
                                        <span>Buka Laci</span>
                                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </Magnet>
                            </div>
                        )}
                    </div>
                </div>

                {/* React Bits CardNav expandable drawer */}
                <AnimatePresence initial={false}>
                    {cardNavOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 360, damping: 32 }}
                            className="overflow-hidden border-t border-border bg-surface/90"
                        >
                            <div className="grid gap-3 p-3.5 sm:grid-cols-3">
                                {CARD_NAV_SECTIONS.map((section, idx) => (
                                    <motion.div
                                        key={section.index}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                                    >
                                        <Link
                                            href={resolveSectionHref(section.href, section.requiresAuth)}
                                            onClick={() => setCardNavOpen(false)}
                                            className={cn(
                                                "group flex h-full flex-col justify-between rounded-xl border p-3.5 transition-transform hover:-translate-y-0.5",
                                                section.accentClass
                                            )}
                                        >
                                            <div className="flex items-center justify-between font-mono text-[11px]">
                                                <span>{section.index}</span>
                                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </div>
                                            <div className="mt-4">
                                                <div className="font-display text-sm font-bold text-foreground">
                                                    {section.title}
                                                </div>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {section.description}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[11px] text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <Compass className="h-3 w-3 text-primary" />
                                    navigasi cepat kodelaci
                                </span>
                                <span>tekan / untuk cari</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
