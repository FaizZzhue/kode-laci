import { cn } from "@/lib/utils";
import type { LogoProps } from "@/types/components";

export function KodeLaciLogo({ className }: LogoProps) {
    return (
        <svg
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-6 w-6", className)}
            aria-hidden="true"
        >
            <rect
                x="2.5"
                y="3.5"
                width="23"
                height="21"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.9"
            />
            <path
                d="M2.5 14H25.5"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <path
                d="M9.5 8.75H18.5"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
            />
            <path
                d="M11 19.25L8.75 19.25M19.25 19.25L17 19.25"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="14" cy="19.25" r="1.4" fill="var(--primary)" />
        </svg>
    );
}
