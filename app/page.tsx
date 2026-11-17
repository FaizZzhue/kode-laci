import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { HeroDrawerPreview } from "@/components/home/hero-drawer-preview";
import { WorkbenchShowcase } from "@/components/home/workbench-showcase";
import { PublicExplore } from "@/components/snippets/public-explore";
import { Squares } from "@/components/reactbits/squares";
import { BlurText } from "@/components/reactbits/blur-text";
import { DecryptedText } from "@/components/reactbits/decrypted-text";
import { Magnet } from "@/components/reactbits/magnet";
import { ClickSpark } from "@/components/reactbits/click-spark";

export default function HomePage() {
    return (
        <main className="flex-1">
            <section className="relative overflow-hidden border-b border-border">
                {/* React Bits Interactive Canvas Squares Background */}
                <div className="pointer-events-auto absolute inset-0 opacity-70">
                    <Squares
                        direction="diagonal"
                        speed={0.28}
                        squareSize={48}
                        borderColor="rgba(128, 128, 128, 0.14)"
                        hoverFillColor="rgba(217, 78, 31, 0.14)"
                    />
                </div>
                <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/40 via-background/70 to-background"
                    aria-hidden="true"
                />

                <div className="relative z-10 mx-auto grid max-w-container-max items-center gap-10 px-gutter py-12 sm:py-18 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/90 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-2xs backdrop-blur-xs">
                            <Terminal className="h-3.5 w-3.5 text-primary" />
                            <DecryptedText
                                text="vault snippet · fts prefix + /s/slug"
                                animateOn="view"
                                speed={30}
                                className="text-foreground"
                            />
                        </div>

                        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
                            <BlurText
                                text="Potongan kode yang sering dicari ulang, sekarang punya laci sendiri."
                                delay={45}
                                animateBy="words"
                            />
                        </h1>

                        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                            Berhenti menggali commit lama hanya untuk satu hook atau query SQL.
                            Simpan snippet private, cari cepat lewat potongan kata seperti{" "}
                            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">
                                reac
                            </code>
                            , atau bagikan lewat tautan{" "}
                            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">
                                /s/slug
                            </code>
                            .
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <ClickSpark sparkColor="#ff6b3d" sparkCount={10}>
                                <Magnet magnetStrength={3.5} padding={50}>
                                    <Link
                                        href="/register"
                                        className="group inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                                    >
                                        <span>Buat Laci Kode</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </Magnet>
                            </ClickSpark>

                            <a
                                href="#explore"
                                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card/90 px-5 text-sm font-medium text-foreground backdrop-blur-xs transition-colors hover:bg-accent"
                            >
                                Lihat Snippet Publik
                            </a>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/80 pt-5 font-mono text-xs text-muted-foreground">
                            <span>23+ bahasa (Shiki)</span>
                            <span>·</span>
                            <span>Private &amp; Public Slug</span>
                            <span>·</span>
                            <span>Tekan / untuk cari</span>
                        </div>
                    </div>

                    <HeroDrawerPreview />
                </div>
            </section>

            <WorkbenchShowcase />
            <PublicExplore />
        </main>
    );
}
