import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-surface/80 shadow-sm backdrop-blur-lg transition-all duration-300">
            <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-gutter">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-display-lg text-headline-md tracking-tighter text-primary transition-transform hover:scale-95"
                >
                    <Layers className="h-6 w-6 text-primary-container" />
                    <span>KodeLaci</span>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
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
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="hidden font-label-caps text-label-caps text-on-surface transition-colors hover:text-primary md:block"
                    >
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="shimmer-btn group flex items-center gap-2 rounded-full px-6 py-2.5 font-label-caps text-label-caps text-on-primary-container"
                    >
                        Sign Up
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}