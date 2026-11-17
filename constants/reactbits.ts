export const DEFAULT_DECRYPT_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/<>[]{}#*";

export const FOLDER_PAPER_OFFSETS = [
    { x: -16, y: -12, rotate: -9 },
    { x: 0, y: -18, rotate: 0 },
    { x: 16, y: -12, rotate: 9 },
] as const;

export const DOCK_SPRING_CONFIG = {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
} as const;
