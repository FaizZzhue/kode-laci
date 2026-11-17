"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type CopyButtonProps = {
    text: string;
    label?: string;
    className?: string;
};

export function CopyButton({ text, label = "Salin Kode", className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={className}
            aria-label={copied ? "Kode disalin" : label}
        >
            {copied ? (
                <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Tersalin</span>
                </>
            ) : (
                <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{label}</span>
                </>
            )}
        </Button>
    );
}
