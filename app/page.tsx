import Link from "next/link";
import { ArrowRight, Code2, GitFork, Lock, Search, Share2, Tag } from "lucide-react";
import { PublicExplore } from "@/components/snippets/public-explore";

const FEATURES = [
    {
        icon: Code2,
        title: "20+ Bahasa Pemrograman",
        description: "Simpan potongan kode TypeScript, Python, SQL, Go, Rust, dan lainnya lengkap dengan syntax highlighting.",
    },
    {
        icon: Search,
        title: "Pencarian Full-Text Cepat",
        description: "Didukung PostgreSQL tsvector & GIN Index untuk mencari berdasarkan judul, deskripsi, maupun isi kode.",
    },
    {
        icon: Lock,
        title: "Private atau Publik",
        description: "Jaga kode rahasia tetap private di laci Anda, atau publikasikan dengan URL slug unik yang mudah dibagikan.",
    },
    {
        icon: GitFork,
        title: "Fork Snippet Publik",
        description: "Temukan kode berguna dari developer lain? Fork ke akun pribadi Anda dalam satu klik untuk dimodifikasi.",
    },
    {
        icon: Tag,
        title: "Tag & Filter Rapi",
        description: "Kelompokkan snippet dengan tag bebas dan filter cepat per bahasa agar laci kode selalu terstruktur.",
    },
    {
        icon: Share2,
        title: "Siap Dibagikan Seketika",
        description: "Setiap snippet publik mendapatkan tautan /s/[slug] yang bersih lengkap dengan tombol salin kode.",
    },
];

const STEPS = [
    {
        step: "01",
        title: "Simpan Potongan Kode",
        description: "Buat akun gratis dan simpan fungsi, query, atau konfigurasi yang sering Anda gunakan.",
    },
    {
        step: "02",
        title: "Kelompokkan & Cari",
        description: "Beri bahasa pemrograman dan tag agar mudah ditemukan kembali lewat pencarian full-text.",
    },
    {
        step: "03",
        title: "Bagikan atau Fork",
        description: "Ubah visibilitas ke publik untuk mendapatkan link /s/[slug], atau fork snippet milik komunitas.",
    },
];

export default function HomePage() {
    return (
        <main className="flex-1">
            <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-primary/5 via-background to-background">
                <div className="mx-auto flex max-w-container-max flex-col items-center px-gutter py-20 text-center sm:py-28">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
                        Personal Code Snippet Vault untuk Developer
                    </span>

                    <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        Satu laci terorganisir untuk semua{" "}
                        <span className="text-primary">code snippet</span> Anda.
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Berhenti membongkar repository lama hanya untuk mencari satu fungsi. Simpan,
                        cari secara full-text, dan bagikan potongan kode Anda lewat URL unik dengan
                        KodeLaci.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="shimmer-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-on-primary-container"
                        >
                            Mulai Gratis Sekarang
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                            href="#explore"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                        >
                            Jelajah Snippet Publik
                        </a>
                    </div>
                </div>
            </section>

            <section id="features" className="mx-auto max-w-container-max px-gutter py-16">
                <div className="mb-10 max-w-2xl">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Dirancang untuk Kecepatan Developer
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Fokus pada penyimpanan dan pencarian kode yang ringan tanpa bloat.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="rounded-xl border border-border bg-card p-6 shadow-xs"
                            >
                                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section id="how-it-works" className="border-y border-border bg-muted/30">
                <div className="mx-auto max-w-container-max px-gutter py-16">
                    <div className="mb-10 max-w-2xl">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Cara Kerja KodeLaci
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Tiga langkah sederhana dari ide hingga siap pakai ulang.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {STEPS.map((item) => (
                            <div
                                key={item.step}
                                className="rounded-xl border border-border bg-card p-6"
                            >
                                <span className="font-mono text-sm font-bold text-primary">
                                    {item.step}
                                </span>
                                <h3 className="mt-2 text-base font-semibold text-foreground">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <PublicExplore />
        </main>
    );
}
