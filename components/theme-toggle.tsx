"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useMounted();

    const isDark = mounted && resolvedTheme === "dark";

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative overflow-hidden rounded-lg border border-transparent hover:border-border"
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.span
                        key="sun"
                        initial={{ rotate: -60, opacity: 0, scale: 0.7 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 60, opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="h-4 w-4" />
                    </motion.span>
                ) : (
                    <motion.span
                        key="moon"
                        initial={{ rotate: 60, opacity: 0, scale: 0.7 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -60, opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="h-4 w-4" />
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );
}
