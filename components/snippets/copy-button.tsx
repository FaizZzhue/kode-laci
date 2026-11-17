"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import type { CopyButtonProps } from "@/types/components";

export function CopyButton({ text, label = "Salin Kode", className }: CopyButtonProps) {
    const { copied, copy } = useCopyFeedback(1800);

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copy(text)}
            className={className}
            aria-label={copied ? "Kode disalin" : label}
        >
            <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                    <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-code"
                    >
                        <Check className="h-3.5 w-3.5" />
                        <span>Tersalin</span>
                    </motion.span>
                ) : (
                    <motion.span
                        key="idle"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-1.5 font-mono text-xs"
                    >
                        <Copy className="h-3.5 w-3.5" />
                        <span>{label}</span>
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );
}
