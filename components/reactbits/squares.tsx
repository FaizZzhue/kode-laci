"use client";

import { useEffect, useRef } from "react";
import type { GridOffset, SquaresProps } from "@/types/reactbits";

export function Squares({
    direction = "diagonal",
    speed = 0.35,
    borderColor = "rgba(125, 125, 125, 0.14)",
    squareSize = 44,
    hoverFillColor = "rgba(217, 78, 31, 0.14)",
    className = "",
}: SquaresProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestRef = useRef<number | null>(null);
    const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
    const hoveredSquare = useRef<GridOffset | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const drawGrid = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

            for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
                for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
                    const squareX = x - (gridOffset.current.x % squareSize);
                    const squareY = y - (gridOffset.current.y % squareSize);

                    if (
                        hoveredSquare.current &&
                        Math.floor((x - startX) / squareSize) === hoveredSquare.current.x &&
                        Math.floor((y - startY) / squareSize) === hoveredSquare.current.y
                    ) {
                        ctx.fillStyle = hoverFillColor;
                        ctx.fillRect(squareX, squareY, squareSize, squareSize);
                    }

                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(squareX, squareY, squareSize, squareSize);
                }
            }
        };

        const updateAnimation = () => {
            const effectiveSpeed = Math.max(speed, 0.05);
            switch (direction) {
                case "right":
                    gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
                    break;
                case "left":
                    gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
                    break;
                case "up":
                    gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
                    break;
                case "down":
                    gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
                    break;
                case "diagonal":
                    gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
                    gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
                    break;
            }

            drawGrid();
            requestRef.current = requestAnimationFrame(updateAnimation);
        };

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

            hoveredSquare.current = {
                x: Math.floor((mouseX + gridOffset.current.x - startX) / squareSize),
                y: Math.floor((mouseY + gridOffset.current.y - startY) / squareSize),
            };
        };

        const handleMouseLeave = () => {
            hoveredSquare.current = null;
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        requestRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [direction, speed, borderColor, hoverFillColor, squareSize]);

    return (
        <canvas
            ref={canvasRef}
            className={`block h-full w-full border-none ${className}`}
            aria-hidden="true"
        />
    );
}
