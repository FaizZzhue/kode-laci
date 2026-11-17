import Link from "next/link";
import { KodeLaciLogo } from "@/components/brand/kodelaci-logo";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-border bg-surface/60 pb-10 md:pb-24">
            <div className="mx-auto flex max-w-container-max flex-col items-start justify-between gap-4 px-gutter py-7 text-xs text-muted-foreground sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5">
                    <KodeLaciLogo className="h-4 w-4 text-foreground" />
                    <span className="font-display font-semibold text-foreground">KodeLaci</span>
                    <span className="text-border">·</span>
                    <span>Laci arsip snippet untuk developer Indonesia.</span>
                </div>

                <div className="flex flex-wrap items-center gap-5 font-mono">
                    <Link href="/#explore" className="transition-colors hover:text-foreground">
                        /jelajah
                    </Link>
                    <Link href="/dashboard" className="transition-colors hover:text-foreground">
                        /laci
                    </Link>
                    <Link href="/snippets/new" className="transition-colors hover:text-foreground">
                        /tulis
                    </Link>
                </div>
            </div>
        </footer>
    );
}
