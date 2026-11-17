import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FloatingDock } from "@/components/layout/floating-dock";
import type { ChildrenProps } from "@/types";

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: {
        default: "KodeLaci — Arsip Code Snippet untuk Developer",
        template: "%s · KodeLaci",
    },
    description:
        "Simpan potongan kode private atau bagikan lewat tautan /s/slug. Dilengkapi pencarian parsial full-text, tag, dan fork.",
};

export default function RootLayout({ children }: Readonly<ChildrenProps>) {
    return (
        <html
            lang="id"
            data-scroll-behavior="smooth"
            suppressHydrationWarning
            className={cn(
                "h-full antialiased",
                plusJakarta.variable,
                spaceGrotesk.variable,
                jetbrainsMono.variable,
                "font-sans"
            )}
        >
            <body
                suppressHydrationWarning
                className="flex min-h-full flex-col bg-background text-foreground selection:bg-primary/20 selection:text-foreground"
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <MotionProvider>
                        <AuthProvider>
                            <Navbar />
                            <div className="flex flex-1 flex-col pt-20">{children}</div>
                            <Footer />
                            <FloatingDock />
                        </AuthProvider>
                    </MotionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
