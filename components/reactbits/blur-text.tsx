"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { BlurTextProps } from "@/types/reactbits";

export function BlurText({
    text,
    delay = 55,
    className = "",
    animateBy = "words",
    direction = "top",
    stepDuration = 0.35,
}: BlurTextProps) {
    const elements = useMemo(
        () => (animateBy === "words" ? text.split(" ") : text.split("")),
        [text, animateBy]
    );

    const initialY = direction === "top" ? -16 : 16;

    return (
        <span className={`inline-flex flex-wrap ${className}`}>
            {elements.map((segment, index) => (
                <motion.span
                    key={`${segment}-${index}`}
                    initial={{ filter: "blur(10px)", opacity: 0, y: initialY }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{
                        duration: stepDuration,
                        delay: (index * delay) / 1000,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block will-change-[transform,filter,opacity]"
                >
                    {segment === " " ? "\u00A0" : segment}
                    {animateBy === "words" && index < elements.length - 1 ? "\u00A0" : ""}
                </motion.span>
            ))}
        </span>
    );
}
