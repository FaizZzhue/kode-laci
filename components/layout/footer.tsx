import Link from "next/link";
import { Layers } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-border bg-surface/60">
            <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-4 px-gutter py-8 text-sm text-muted-foreground sm:flex-row">
                <div className="flex items-center gap-2 font-medium text-foreground">
                    <Layers className="h-4 w-4 text-primary" />
                    <span>KodeLaci</span>
                    <span className="text-muted-foreground">· Code Snippet Vault</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/#features" className="transition-colors hover:text-foreground">
                        Fitur
                    </Link>
                    <Link href="/#explore" className="transition-colors hover:text-foreground">
                        Jelajah
                    </Link>
                    <Link href="/dashboard" className="transition-colors hover:text-foreground">
                        Dashboard
                    </Link>
                </div>
            </div>
        </footer>
    );
}
