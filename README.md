# 🗂️ KodeLaci

> Platform menyimpan, mengorganisir, dan berbagi potongan kode (*code snippet*) — private maupun publik, dengan fitur pencarian full-text, tag, dan fork.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## 🌐 Environment

| Environment | URL |
|---|---|
| Production | https://kodelaci.vercel.app |
| Development | http://localhost:3000 |

---

## 📖 Tentang Project

KodeLaci adalah platform manajemen code snippet yang memungkinkan developer menyimpan, mengorganisir, mencari, dan membagikan potongan kode secara efisien melalui URL publik yang unik (`/s/[slug]`).

### Fitur Utama

- 🔐 **Autentikasi** — register, login, logout, dan sesi JWT berbasis `HttpOnly` cookie (`kodelaci_token`)
- 📝 **Kelola snippet** — buat, edit, hapus potongan kode dengan dukungan 20+ bahasa pemrograman + syntax highlighting (Shiki)
- 🔒 **Visibilitas private / publik** — snippet publik bisa diakses siapa saja via URL unik `/s/[slug]`
- 🔍 **Pencarian full-text** — cari berdasarkan judul, deskripsi, isi kode, atau tag menggunakan PostgreSQL `tsvector` & GIN Index
- 🍴 **Fork snippet** — salin snippet publik milik orang lain ke akun Anda sebagai draft private
- 🏷️ **Tag & filter bahasa** — organisir snippet dengan tag many-to-many dan filter per bahasa/visibilitas
- 🛡️ **Rate limiting & route proxy** — proteksi brute-force pada endpoint auth/publik dan proteksi rute via `proxy.ts`
- 🌙 **Dark mode** — toggle tema terang / gelap (`next-themes`)

---

## 🛠️ Tech Stack

| Lapisan | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router + Proxy) |
| **Bahasa** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Komponen UI** | shadcn/ui + Radix UI + Lucide Icons |
| **Syntax Highlight** | Shiki (Server-side dual-theme) |
| **Database** | Supabase (PostgreSQL + Full-Text Search + RLS) |
| **Auth** | JWT (`jsonwebtoken` dalam `HttpOnly` cookie) + `bcryptjs` |
| **Validasi** | Zod 4 |
| **Slug Generator** | `nanoid` |
| **HTTP Client** | Axios (`withCredentials: true`) |
| **Theme** | `next-themes` |
| **Testing** | Node.js Test Runner (`node --test`) |

---

## ⚙️ Cara Menjalankan Secara Lokal

### Prasyarat

```bash
node -v    # minimal v22+ (direkomendasikan v24 untuk native TS test runner)
npm -v     # minimal v9
```

### 1 — Clone & install dependency

```bash
git clone https://github.com/FaizZzhue/kodelaci.git
cd kodelaci
npm ci
```

### 2 — Siapkan database di Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** lalu jalankan seluruh isi [database/schema.sql](database/schema.sql)

### 3 — Buat file environment

Salin file contoh lalu isi dengan kredensial Supabase & JWT Anda:

```bash
cp .env.example .env.local
```

```env
NODE_ENV=development

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...

JWT_SECRET=isi_dengan_string_acak_panjang
JWT_EXPIRES_IN=7d
```

> **Cara generate `JWT_SECRET` yang kuat:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 4 — Jalankan development server & verifikasi

```bash
npm run dev       # Jalankan dev server di http://localhost:3000
npm test          # Jalankan unit test
npm run lint      # Jalankan ESLint
npx tsc --noEmit  # Cek tipe TypeScript
npm run build     # Verifikasi production build
```

---

## 📁 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── auth/          # register, login, logout, me
│   │   ├── public/        # snippets (explore/search), s/[slug]
│   │   └── snippets/      # CRUD milik user & [id]/fork
│   ├── dashboard/         # Dashboard snippet milik user
│   ├── login/             # Halaman login
│   ├── register/          # Halaman registrasi
│   ├── s/[slug]/          # Halaman publik detail snippet (Shiki)
│   └── snippets/          # Halaman create & [id]/edit snippet
├── components/
│   ├── layout/            # navbar, sidebar, footer
│   ├── providers/         # auth-provider
│   ├── snippets/          # code-block, copy-button, fork-button, snippet-card, snippet-form, public-explore
│   └── ui/                # shadcn/ui primitives
├── constants/             # languages, storage keys
├── database/              # schema.sql (tables, FTS triggers, GIN index, RLS)
├── hooks/                 # use-auth, use-snippets
├── lib/                   # supabase, auth, api, api-response, rate-limit, slug, snippet-tags, public-snippets, validations, utils
├── middleware/            # auth-guard
├── tests/                 # Automated unit tests (node --test)
├── types/                 # Shared TypeScript types
└── proxy.ts               # Next.js 16 proxy (security headers & session redirect)
```

---

## 🌐 API Endpoints

Seluruh endpoint mengembalikan format respons terstandar `{ success, message?, data?, error?, errors?, meta? }`.

### Auth

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Daftar akun baru + set `HttpOnly` cookie | — |
| `POST` | `/api/auth/login` | Login + set `HttpOnly` cookie | — |
| `POST` | `/api/auth/logout` | Hapus cookie sesi | — |
| `GET` | `/api/auth/me` | Profil user aktif | ✅ |

### Snippets (butuh login)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/snippets` | Daftar snippet milik user (`q`, `language`, `tag`, `visibility`, `page`, `limit`) |
| `POST` | `/api/snippets` | Buat snippet baru (termasuk `tags`) |
| `GET` | `/api/snippets/:id` | Detail snippet milik user |
| `PUT` | `/api/snippets/:id` | Edit snippet & sinkronkan tags |
| `DELETE` | `/api/snippets/:id` | Hapus snippet milik user |
| `POST` | `/api/snippets/:id/fork` | Fork snippet publik milik user lain sebagai draft private |

### Publik (tanpa login)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/public/snippets` | Jelajah & full-text search snippet publik |
| `GET` | `/api/public/s/:slug` | Detail snippet publik berdasarkan slug unik |

---

## 🚀 Roadmap

### Core MVP
- [x] Authentication & Authorization (`HttpOnly` JWT Cookie + `authGuard`)
- [x] Snippet CRUD & Tag System (`tags`, `snippet_tags`)
- [x] Public & Private Visibility + Slug Sharing (`/s/[slug]`)
- [x] PostgreSQL Full-Text Search Schema (`tsvector` + GIN Index)
- [x] Fork Snippet
- [x] Rate Limiting & Proxy Security Headers
- [x] Dark Mode & Shiki Syntax Highlighting
- [x] Automated Unit Tests

### Upcoming Features (Post-MVP)
- [ ] Collections & Favorites
- [ ] User Profile Page (`/u/[username]`)
- [ ] Snippet Version History
- [ ] Team Workspace
- [ ] Import from GitHub Gist
- [ ] Analytics Dashboard

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Achmad Faiz Yudha Ramadhan**
- GitHub: https://github.com/FaizZzhue
- LinkedIn: https://www.linkedin.com/in/afaizyr/
