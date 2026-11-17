"use client";

import { useEffect, type RefObject } from "react";

export function useSlashShortcut(inputRef: RefObject<HTMLInputElement | null>) {
    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key !== "/") return;

            const target = event.target as HTMLElement | null;
            if (
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT" ||
                    target.isContentEditable)
            ) {
                return;
            }

            event.preventDefault();
            inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            inputRef.current?.focus();
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [inputRef]);
}
