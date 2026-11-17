import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "KodeLaci — Simpan, Organisir & Bagikan Code Snippet",
        template: "%s | KodeLaci",
    },
    description:
        "Platform manajemen code snippet untuk developer: simpan arsip kode private maupun publik, cari full-text, atur tag, dan fork dengan cepat.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="id"
            data-scroll-behavior="smooth"
            suppressHydrationWarning
            className={cn(
                "h-full antialiased",
                geistSans.variable,
                geistMono.variable,
                "font-sans",
                inter.variable
            )}
        >
            <body
                suppressHydrationWarning
                className="flex min-h-full flex-col bg-background text-foreground"
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <Navbar />
                        <div className="flex flex-1 flex-col pt-16">{children}</div>
                        <Footer />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
