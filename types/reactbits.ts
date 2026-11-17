import type { HTMLAttributes, ReactNode } from "react";
import type { MotionValue } from "framer-motion";

export type SquaresProps = {
    direction?: "right" | "left" | "up" | "down" | "diagonal";
    speed?: number;
    borderColor?: string;
    squareSize?: number;
    hoverFillColor?: string;
    className?: string;
};

export type GridOffset = {
    x: number;
    y: number;
};

export type BlurTextProps = {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: "words" | "letters";
    direction?: "top" | "bottom";
    stepDuration?: number;
};

export type DecryptedTextProps = {
    text: string;
    speed?: number;
    maxIterations?: number;
    sequential?: boolean;
    revealDirection?: "start" | "end" | "center";
    characters?: string;
    className?: string;
    parentClassName?: string;
    encryptedClassName?: string;
    animateOn?: "view" | "hover" | "both";
};

export type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    spotlightColor?: string;
};

export type MagnetProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    padding?: number;
    disabled?: boolean;
    magnetStrength?: number;
};

export type ClickSparkProps = {
    children: ReactNode;
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number;
    className?: string;
};

export type SparkParticle = {
    x: number;
    y: number;
    angle: number;
    startTime: number;
};

export type FolderItem = {
    id: string;
    label: string;
    meta: string;
};

export type FolderProps = {
    color?: string;
    size?: number;
    items?: FolderItem[];
    activeId?: string;
    onSelectItem?: (id: string) => void;
    className?: string;
};

export type DockItemConfig = {
    id: string;
    icon: ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
};

export type DockProps = {
    items: DockItemConfig[];
    className?: string;
    magnification?: number;
    distance?: number;
    baseItemSize?: number;
};

export type DockItemInternalProps = {
    item: DockItemConfig;
    mouseX: MotionValue<number>;
    magnification: number;
    distance: number;
    baseItemSize: number;
};

export type CardNavSection = {
    index: string;
    title: string;
    description: string;
    href: string;
    accentClass: string;
    requiresAuth?: boolean;
};
