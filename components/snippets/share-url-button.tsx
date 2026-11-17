"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import type { ShareUrlButtonProps } from "@/types/components";

export function ShareUrlButton({ slug, compact = false }: ShareUrlButtonProps) {
    const { copied, copy } = useCopyFeedback(1800);

    function handleCopyLink() {
        copy(`${window.location.origin}/s/${slug}`);
    }

    if (compact) {
        return (
            <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleCopyLink}
                aria-label={copied ? "Link publik tersalin" : "Salin link publik"}
                title={copied ? "Link tersalin!" : "Salin link publik"}
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5 text-accent-code" />
                ) : (
                    <Link2 className="h-3.5 w-3.5" />
                )}
            </Button>
        );
    }

    return (
        <Button type="button" variant="outline" size="sm" onClick={handleCopyLink}>
            <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                    <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.14 }}
                        className="inline-flex items-center gap-1.5 text-accent-code"
                    >
                        <Check className="h-3.5 w-3.5" />
                        <span>Link Tersalin</span>
                    </motion.span>
                ) : (
                    <motion.span
                        key="idle"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.14 }}
                        className="inline-flex items-center gap-1.5"
                    >
                        <Link2 className="h-3.5 w-3.5" />
                        <span>Salin Link</span>
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );
}
