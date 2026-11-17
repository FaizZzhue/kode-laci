"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GitFork, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { extractApiError, forkSnippet } from "@/hooks/use-snippets";

type ForkButtonProps = {
    snippetId: string;
    authorUsername?: string | null;
    forkCount?: number;
};

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
            <Button
                type="button"
                variant="outline"
                onClick={handleFork}
                disabled={isForking || isOwner}
                title={isOwner ? "Tidak dapat melakukan fork snippet milik sendiri" : "Fork ke akun saya"}
            >
                {isForking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <GitFork className="h-4 w-4" />
                )}
                <span>{isOwner ? "Milik Anda" : "Fork Snippet"}</span>
                <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {forkCount}
                </span>
            </Button>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
