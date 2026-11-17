"use client";

import { useCallback, useState } from "react";

export function useCopyFeedback(resetDelayMs = 1800) {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), resetDelayMs);
            } catch {
                setCopied(false);
            }
        },
        [resetDelayMs]
    );

    const reset = useCallback(() => {
        setCopied(false);
    }, []);

    return { copied, copy, reset };
}
