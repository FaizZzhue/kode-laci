"use client";

import { useRef, useState } from "react";
import type { MagnetProps } from "@/types/reactbits";

export function Magnet({
    children,
    padding = 72,
    disabled = false,
    magnetStrength = 3.2,
    className = "",
    onMouseMove,
    onMouseLeave,
    ...props
}: MagnetProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isActive, setIsActive] = useState(false);
    const magnetRef = useRef<HTMLDivElement>(null);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        if (!disabled && magnetRef.current) {
            const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const distX = Math.abs(centerX - event.clientX);
            const distY = Math.abs(centerY - event.clientY);

            if (distX < width / 2 + padding && distY < height / 2 + padding) {
                setIsActive(true);
                setPosition({
                    x: (event.clientX - centerX) / magnetStrength,
                    y: (event.clientY - centerY) / magnetStrength,
                });
            } else {
                setIsActive(false);
                setPosition({ x: 0, y: 0 });
            }
        }
        onMouseMove?.(event);
    }

    function handleMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
        onMouseLeave?.(event);
    }

    return (
        <div
            ref={magnetRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative inline-block ${className}`}
            {...props}
        >
            <div
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    transition: isActive
                        ? "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
                        : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
            >
                {children}
            </div>
        </div>
    );
}
