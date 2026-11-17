"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GitFork, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { extractApiError, forkSnippet } from "@/lib/snippet-api";
import type { ForkButtonProps } from "@/types/components";

export function ForkButton({ snippetId, authorUsername, forkCount = 0 }: ForkButtonProps) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [isForking, setIsForking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isOwner = !!user && !!authorUsername && user.username === authorUsername;

    async function handleFork() {
        setError(null);

        if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        setIsForking(true);
        try {
            const forked = await forkSnippet(snippetId);
            router.push(`/snippets/${forked.id}/edit`);
        } catch (err) {
            setError(extractApiError(err, "Gagal melakukan fork snippet."));
        } finally {
            setIsForking(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-1.5">
            <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFork}
                    disabled={isForking || isOwner}
                    title={
                        isOwner
                            ? "Tidak dapat melakukan fork snippet milik sendiri"
                            : "Fork ke laci pribadi"
                    }
                >
                    {isForking ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <GitFork className="h-3.5 w-3.5 text-primary" />
                    )}
                    <span>{isOwner ? "Milik Anda" : "Fork ke Laci"}</span>
                    <span className="ml-0.5 rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-secondary-foreground">
                        {forkCount}
                    </span>
                </Button>
            </motion.div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
