"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FOLDER_PAPER_OFFSETS } from "@/constants/reactbits";
import type { FolderProps } from "@/types/reactbits";

export function Folder({
    color = "#d94e1f",
    size = 1,
    items = [],
    activeId,
    onSelectItem,
    className = "",
}: FolderProps) {
    const [open, setOpen] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const visibleItems = items.slice(0, 3);

    return (
        <div
            style={{ transform: `scale(${size})` }}
            className={`relative inline-flex select-none flex-col items-center ${className}`}
        >
            <div
                onClick={() => setOpen((prev) => !prev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen((prev) => !prev);
                    }
                }}
                aria-label={open ? "Tutup folder laci kode" : "Buka folder laci kode"}
                className="group relative h-[96px] w-[124px] cursor-pointer"
            >
                {/* Bagian belakang folder */}
                <div
                    className="absolute inset-0 rounded-xl shadow-md transition-colors"
                    style={{ backgroundColor: color }}
                >
                    <div
                        className="absolute -top-2.5 left-0 h-3.5 w-12 rounded-t-lg"
                        style={{ backgroundColor: color }}
                    />
                </div>

                {/* Kertas snippet di dalam laci */}
                {visibleItems.map((item, idx) => {
                    const offset = FOLDER_PAPER_OFFSETS[idx] ?? FOLDER_PAPER_OFFSETS[0];
                    const isActive = activeId === item.id;
                    const isHovered = hoveredIndex === idx;

                    return (
                        <motion.button
                            key={item.id}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                                onSelectItem?.(item.id);
                            }}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            animate={
                                open
                                    ? {
                                          x: offset.x,
                                          y: isHovered || isActive ? offset.y - 10 : offset.y,
                                          rotate: isHovered ? offset.rotate * 0.5 : offset.rotate,
                                          scale: isActive ? 1.05 : 1,
                                      }
                                    : { x: 0, y: 4, rotate: 0, scale: 0.94 }
                            }
                            transition={{ type: "spring", stiffness: 320, damping: 24 }}
                            className={`absolute inset-x-2 top-2 z-10 flex h-16 flex-col justify-between rounded-lg border p-2 text-left shadow-sm ${
                                isActive
                                    ? "border-primary bg-card ring-2 ring-primary/40"
                                    : "border-border bg-card/95"
                            }`}
                        >
                            <span className="truncate font-mono text-[9px] font-semibold text-foreground">
                                {item.label}
                            </span>
                            <span className="font-mono text-[8px] text-muted-foreground">
                                {item.meta}
                            </span>
                        </motion.button>
                    );
                })}

                {/* Tutup depan folder */}
                <motion.div
                    animate={
                        open
                            ? { rotateX: 28, y: 4, skewX: -3 }
                            : { rotateX: 0, y: 0, skewX: 0 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    style={{
                        transformOrigin: "bottom center",
                        background: `linear-gradient(155deg, ${color}, color-mix(in srgb, ${color} 78%, #000))`,
                    }}
                    className="absolute inset-x-0 bottom-0 z-20 flex h-[64px] items-end justify-between rounded-xl border border-white/15 px-3 py-2 text-white shadow-lg"
                >
                    <span className="font-mono text-[10px] font-semibold tracking-tight opacity-95">
                        kodelaci/
                    </span>
                    <span className="font-mono text-[9px] opacity-80">
                        {open ? "terbuka" : "tertutup"}
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
