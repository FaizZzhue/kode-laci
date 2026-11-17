"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Globe, Lock } from "lucide-react";
import { DRAWER_SAMPLES, HERO_FOLDER_ITEMS } from "@/constants/home";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { Folder } from "@/components/reactbits/folder";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import { cn } from "@/lib/utils";

export function HeroDrawerPreview() {
    const [activeId, setActiveId] = useState<string>(DRAWER_SAMPLES[0].id);
    const { copied, copy, reset } = useCopyFeedback(1600);

    const active = DRAWER_SAMPLES.find((item) => item.id === activeId) ?? DRAWER_SAMPLES[0];

    function handleSelect(id: string) {
        setActiveId(id);
        reset();
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="relative w-full space-y-4"
        >
            {/* React Bits Interactive Folder Bar */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card/85 px-5 py-4 backdrop-blur-sm sm:flex-row">
                <div className="space-y-1 text-center sm:text-left">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                        Laci Interaktif
                    </span>
                    <p className="font-display text-sm font-semibold text-foreground">
                        Pilih berkas dari laci untuk melihat pratinjau
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                        Klik folder atau pilih langsung lembaran snippet
                    </p>
                </div>

                <div className="pt-3 sm:pr-2">
                    <Folder
                        color="#d94e1f"
                        size={0.95}
                        items={HERO_FOLDER_ITEMS}
                        activeId={active.id}
                        onSelectItem={handleSelect}
                    />
                </div>
            </div>

            {/* Code Sheet dengan React Bits SpotlightCard */}
            <SpotlightCard className="shadow-lg shadow-black/5 dark:shadow-black/30">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-3.5 py-2.5">
                    <div className="flex items-center gap-1" role="tablist" aria-label="Contoh isi laci kode">
                        {DRAWER_SAMPLES.map((tab) => {
                            const selected = tab.id === active.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => handleSelect(tab.id)}
                                    className={cn(
                                        "relative rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                                        selected
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {selected && (
                                        <motion.span
                                            layoutId="hero-drawer-tab"
                                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                            className="absolute inset-0 rounded-md bg-card ring-1 ring-border"
                                        />
                                    )}
                                    <span className="relative z-10">{tab.filename}</span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() => copy(active.lines.join("\n"))}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {copied ? (
                            <>
                                <Check className="h-3 w-3 text-accent-code" />
                                <span className="text-accent-code">tersalin</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3 w-3" />
                                <span>salin</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-muted/40 px-4 py-2 font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                        {active.isPublic ? (
                            <span className="inline-flex items-center gap-1 text-accent-code">
                                <Globe className="h-3 w-3" />
                                {active.slug}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Lock className="h-3 w-3" />
                                draft-private (tanpa slug)
                            </span>
                        )}
                    </div>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground">
                        {active.langLabel}
                    </span>
                </div>

                <div className="min-h-[248px] overflow-x-auto p-4 font-mono text-xs leading-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                        >
                            {active.lines.map((line, index) => (
                                <div key={`${active.id}-${index}`} className="flex gap-4">
                                    <span className="w-5 shrink-0 select-none text-right text-muted-foreground/50">
                                        {index + 1}
                                    </span>
                                    <span className="whitespace-pre text-foreground">
                                        {line || " "}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface px-4 py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                        {active.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded bg-secondary px-2 py-0.5 font-mono text-[11px] text-secondary-foreground"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">
                        {active.lines.length} baris
                    </span>
                </div>
            </SpotlightCard>
        </motion.div>
    );
}
