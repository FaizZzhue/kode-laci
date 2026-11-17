"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Layers, LayoutDashboard, LogOut, Menu, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isLanding = pathname === "/";

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-surface/80 shadow-sm backdrop-blur-lg transition-all duration-300">
            <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-gutter">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-display-lg text-headline-md font-semibold tracking-tighter text-primary transition-transform hover:scale-95"
                >
                    <Layers className="h-6 w-6 text-primary-container" />
                    <span>KodeLaci</span>
                </Link>

                <div className="hidden items-center gap-6 md:flex">
                    {isLanding ? (
                        <>
                            <a
                                href="#features"
                                className="rounded-md px-3 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:bg-primary/10 hover:text-primary"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="rounded-md px-3 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:bg-primary/10 hover:text-primary"
                            >
                                How it works
                            </a>
                            <a
                                href="#explore"
                                className="rounded-md border-b-2 border-primary px-3 py-2 pb-1 font-label-caps text-label-caps font-bold text-primary transition-all duration-300 hover:bg-primary/10"
                            >
                                Explore
                            </a>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/#explore"
                                className="rounded-md px-3 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                                Explore
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    href="/dashboard"
                                    className="rounded-md px-3 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <ThemeToggle />

                    {isLoading ? (
                        <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
                    ) : isAuthenticated && user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-accent"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>{user.username}</span>
                            </Link>
                            <Link
                                href="/snippets/new"
                                className="shimmer-btn inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-on-primary-container"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Buat Snippet</span>
                            </Link>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Logout"
                                onClick={() => logout()}
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-3 py-2 font-label-caps text-label-caps font-medium text-on-surface transition-colors hover:text-primary"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="shimmer-btn group flex items-center gap-2 rounded-full px-5 py-2 font-label-caps text-label-caps font-medium text-on-primary-container"
                            >
                                Sign Up
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
                        onClick={() => setMobileOpen((prev) => !prev)}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {mobileOpen && (
                <div className="border-t border-border bg-surface px-gutter py-4 md:hidden">
                    <div className="flex flex-col gap-2">
                        <Link
                            href="/#explore"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                        >
                            Explore Snippets
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    Dashboard ({user?.username})
                                </Link>
                                <Link
                                    href="/snippets/new"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                                >
                                    Buat Snippet Baru
                                </Link>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="justify-start"
                                    onClick={() => {
                                        setMobileOpen(false);
                                        logout();
                                    }}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
