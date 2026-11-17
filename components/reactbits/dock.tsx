"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DOCK_SPRING_CONFIG } from "@/constants/reactbits";
import { cn } from "@/lib/utils";
import type { DockItemInternalProps, DockProps } from "@/types/reactbits";

function DockItem({
    item,
    mouseX,
    magnification,
    distance,
    baseItemSize,
}: DockItemInternalProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [hovered, setHovered] = useState(false);

    const mouseDistance = useTransform(mouseX, (val) => {
        const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
        return val - rect.x - rect.width / 2;
    });

    const targetSize = useTransform(
        mouseDistance,
        [-distance, 0, distance],
        [baseItemSize, magnification, baseItemSize]
    );

    const size = useSpring(targetSize, DOCK_SPRING_CONFIG);

    return (
        <motion.button
            ref={ref}
            type="button"
            onClick={item.onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ width: size, height: size }}
            aria-label={item.label}
            className={cn(
                "relative flex items-center justify-center rounded-xl border transition-colors",
                item.active
                    ? "border-primary/40 bg-primary/12 text-primary"
                    : "border-border bg-surface text-foreground hover:border-foreground/25"
            )}
        >
            <AnimatePresence>
                {hovered && (
                    <motion.span
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: -6, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.14 }}
                        className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-0.5 font-mono text-[11px] font-medium text-popover-foreground shadow-sm"
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>

            <span className="flex items-center justify-center">{item.icon}</span>

            {item.active && (
                <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-primary" />
            )}
        </motion.button>
    );
}

export function Dock({
    items,
    className = "",
    magnification = 54,
    distance = 120,
    baseItemSize = 40,
}: DockProps) {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "flex items-end gap-2.5 rounded-2xl border border-border bg-card/90 px-3 py-2.5 shadow-lg shadow-black/10 backdrop-blur-xl dark:shadow-black/40",
                className
            )}
            role="toolbar"
            aria-label="Dock navigasi cepat"
        >
            {items.map((item) => (
                <DockItem
                    key={item.id}
                    item={item}
                    mouseX={mouseX}
                    magnification={magnification}
                    distance={distance}
                    baseItemSize={baseItemSize}
                />
            ))}
        </motion.div>
    );
}
