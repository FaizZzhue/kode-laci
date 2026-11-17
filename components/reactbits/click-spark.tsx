"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ClickSparkProps, SparkParticle } from "@/types/reactbits";

export function ClickSpark({
    children,
    sparkColor = "#d94e1f",
    sparkSize = 9,
    sparkRadius = 22,
    sparkCount = 8,
    duration = 380,
    className = "",
}: ClickSparkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparksRef = useRef<SparkParticle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;

        const resizeCanvas = () => {
            const { width, height } = parent.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
        };

        resizeCanvas();
        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(parent);

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const draw = (timestamp: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            sparksRef.current = sparksRef.current.filter((spark) => {
                const elapsed = timestamp - spark.startTime;
                if (elapsed >= duration) return false;

                const progress = elapsed / duration;
                const eased = 1 - Math.pow(1 - progress, 2);
                const distance = eased * sparkRadius;
                const lineLength = sparkSize * (1 - eased);

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                ctx.strokeStyle = sparkColor;
                ctx.lineWidth = 2;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                return true;
            });

            animationId = requestAnimationFrame(draw);
        };

        animationId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animationId);
    }, [sparkColor, sparkRadius, sparkSize, duration]);

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const now = performance.now();

            const created: SparkParticle[] = Array.from({ length: sparkCount }, (_, index) => ({
                x,
                y,
                angle: (2 * Math.PI * index) / sparkCount,
                startTime: now,
            }));

            sparksRef.current.push(...created);
        },
        [sparkCount]
    );

    return (
        <div className={`relative inline-block ${className}`} onClick={handleClick}>
            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                aria-hidden="true"
            />
            {children}
        </div>
    );
}
