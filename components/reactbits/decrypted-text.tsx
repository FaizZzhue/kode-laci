"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_DECRYPT_CHARS } from "@/constants/reactbits";
import type { DecryptedTextProps } from "@/types/reactbits";

export function DecryptedText({
    text,
    speed = 38,
    maxIterations = 10,
    sequential = true,
    revealDirection = "start",
    characters = DEFAULT_DECRYPT_CHARS,
    className = "",
    parentClassName = "",
    encryptedClassName = "text-primary/70",
    animateOn = "hover",
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(() => new Set());
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const hasAnimatedView = useRef(false);

    useEffect(() => {
        if (!isScrambling) {
            return;
        }

        let currentIteration = 0;
        const revealed = new Set<number>();
        const availableChars = characters.split("");

        const getNextIndex = (): number => {
            const len = text.length;
            if (revealDirection === "end") {
                return len - 1 - revealed.size;
            }
            if (revealDirection === "center") {
                const middle = Math.floor(len / 2);
                const offset = Math.floor(revealed.size / 2);
                const candidate = revealed.size % 2 === 0 ? middle + offset : middle - offset - 1;
                if (candidate >= 0 && candidate < len && !revealed.has(candidate)) {
                    return candidate;
                }
            }
            return revealed.size;
        };

        const shuffle = (): string =>
            text
                .split("")
                .map((char, index) => {
                    if (char === " ") return " ";
                    if (revealed.has(index)) return text[index];
                    return availableChars[Math.floor(Math.random() * availableChars.length)];
                })
                .join("");

        const interval = setInterval(() => {
            if (sequential) {
                if (revealed.size < text.length) {
                    const nextIdx = getNextIndex();
                    revealed.add(nextIdx);
                    setRevealedIndices(new Set(revealed));
                    setDisplayText(shuffle());
                } else {
                    clearInterval(interval);
                    setIsScrambling(false);
                    setDisplayText(text);
                }
            } else {
                setDisplayText(shuffle());
                currentIteration += 1;
                if (currentIteration >= maxIterations) {
                    clearInterval(interval);
                    setIsScrambling(false);
                    setDisplayText(text);
                }
            }
        }, speed);

        return () => clearInterval(interval);
    }, [isScrambling, text, speed, maxIterations, sequential, revealDirection, characters]);

    useEffect(() => {
        if (animateOn !== "view" && animateOn !== "both") {
            return;
        }

        const node = containerRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && !hasAnimatedView.current) {
                    hasAnimatedView.current = true;
                    setRevealedIndices(new Set());
                    setIsScrambling(true);
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [animateOn]);

    const handleMouseEnter = () => {
        if (animateOn === "hover" || animateOn === "both") {
            setRevealedIndices(new Set());
            setIsScrambling(true);
        }
    };

    return (
        <span
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            className={`inline-block whitespace-pre-wrap ${parentClassName}`}
        >
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {displayText.split("").map((char, index) => {
                    const isRevealed = !isScrambling || revealedIndices.has(index);
                    return (
                        <span
                            key={`${index}-${char}`}
                            className={isRevealed ? className : encryptedClassName}
                        >
                            {char}
                        </span>
                    );
                })}
            </span>
        </span>
    );
}
