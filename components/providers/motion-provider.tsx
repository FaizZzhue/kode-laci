"use client";

import { MotionConfig } from "framer-motion";
import type { ChildrenProps } from "@/types";

export function MotionProvider({ children }: ChildrenProps) {
    return (
        <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </MotionConfig>
    );
}
