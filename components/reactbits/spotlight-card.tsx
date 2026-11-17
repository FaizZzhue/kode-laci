"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SpotlightCardProps } from "@/types/reactbits";

export function SpotlightCard({
    children,
    className = "",
    spotlightColor = "rgba(217, 78, 31, 0.14)",
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    ...props
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            setPosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        }
        onMouseMove?.(event);
    }

    function handleMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
        setOpacity(1);
        onMouseEnter?.(event);
    }

    function handleMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
        setOpacity(0);
        onMouseLeave?.(event);
    }

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200",
                className
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
                }}
            />
            {children}
        </div>
    );
}
