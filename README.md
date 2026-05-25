# 🗂️ KodeLaci

> Platform menyimpan, mengorganisir, dan berbagi potongan kode (_code snippet_) — private maupun publik, dengan fitur pencarian dan fork.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![Maintenance](https://img.shields.io/badge/maintenance-actively%20developed-blue?style=flat-square)

## 🌐 Live Demo

| Environment | URL |
|------------|-----|
| Production | https://kodelaci.vercel.app |
| Development | http://localhost:3000 |

---

## 📖 Tentang Project

KodeLaci adalah platform manajemen code snippet yang memungkinkan developer menyimpan, mengorganisir, mencari, dan membagikan potongan kode secara efisien melalui URL publik yang unik.

Pernahkah kamu menulis sebuah fungsi yang berguna, lalu dua minggu kemudian lupa di project mana kamu simpannya? KodeLaci hadir sebagai solusi: satu tempat terorganisir untuk semua potongan kode kamu, bisa dicari dengan mudah, dan dibagikan ke orang lain lewat link unik — tanpa perlu buka-buka repository.

### Fitur utama

- 🔐 **Autentikasi** — register, login, dan JWT-based session
- 📝 **Kelola snippet** — buat, edit, hapus potongan kode dengan dukungan 20+ bahasa pemrograman
- 🔒 **Visibilitas private / publik** — snippet publik bisa diakses siapapun via URL unik
- 🔍 **Pencarian full-text** — cari berdasarkan judul, isi kode, deskripsi, atau tag
- 🍴 **Fork snippet** — salin snippet publik milik orang lain ke akun kamu
- 🏷️ **Tag & filter bahasa** — organisir snippet dengan tag bebas dan filter per bahasa
- 🛡️ **Rate limiting** — proteksi API dari penyalahgunaan
- 🌙 **Dark mode** — toggle tema terang / gelap

---

## 🛠️ Tech Stack

| Lapisan | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Komponen UI** | Shadcn/ui |
| **Animasi** | Framer Motion |
| **Syntax Highlight** | Shiki |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Validasi** | Zod |
| **Slug Generator** | nanoid |
| **Theme** | next-themes |

---

## 🏛️ System Architecture

```text
Client (Next.js UI)
        │
        ▼
Route Handlers (Next.js API)
        │
        ▼
JWT Authentication Layer
        │
        ▼
Supabase PostgreSQL
        │
        ▼
Full-Text Search Engine
```

---

## ⚙️ Cara Menjalankan Secara Lokal

### Prasyarat

Pastikan sudah terpasang di komputer kamu:

```bash
node -v    # minimal v18
npm -v     # minimal v9
git -v
```

### 1 — Clone repository

```bash
git clone https://github.com/FaizZzhue/kodelaci.git
cd kodelaci
```

### 2 — Install dependency

```bash
npm install
```

### 3 — Buat project di Supabase

1. Buka [supabase.com](https://supabase.com) dan buat project baru
2. Buka **SQL Editor** lalu jalankan script pada folder database/schema.sql

### 4 — Buat file environment

Salin file contoh lalu isi dengan nilai yang sesuai:

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...

# JWT — gunakan string acak yang panjang
JWT_SECRET=isi_dengan_string_acak_panjang
JWT_EXPIRES_IN=7d
```

> **Cara generate JWT_SECRET yang kuat:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 5 — Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🌐 API Endpoints

Semua endpoint ada di bawah `/api/`.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── (landing)/
│   ├── (auth)/
│   ├── (app)/
│   ├── api/
│   └── s/[slug]/
│
├── components/
├── hooks/
├── lib/
├── middleware/
├── types/
└── public/
```

---

## 🔐 Security

KodeLaci menerapkan beberapa mekanisme keamanan untuk melindungi data pengguna dan endpoint aplikasi.

- JWT Authentication
- Password Hashing (bcryptjs)
- Protected Route Middleware
- Authorization Scoping
- Input Validation (Zod)
- Rate Limiting
- Environment Variable Isolation
- Secure Public Sharing via Slug

---

### Auth

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Daftar akun baru | — |
| `POST` | `/api/auth/login` | Login, dapat JWT | — |
| `GET` | `/api/auth/me` | Profil user aktif | ✅ |

### Snippets (butuh login)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/snippets` | Daftar semua snippet milik user |
| `POST` | `/api/snippets` | Buat snippet baru |
| `GET` | `/api/snippets/:id` | Detail snippet |
| `PUT` | `/api/snippets/:id` | Edit snippet |
| `DELETE` | `/api/snippets/:id` | Hapus snippet |
| `POST` | `/api/snippets/:id/fork` | Fork snippet orang lain |

### Publik (tanpa login)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/public/snippets` | Jelajah snippet publik + search |
| `GET` | `/api/public/s/:slug` | Buka snippet via slug unik |

---

### Database Setup

Buat project baru di Supabase, kemudian jalankan schema berikut:

```bash
database/schema.sql
```

Pastikan seluruh tabel, relasi, dan index berhasil dibuat sebelum menjalankan aplikasi.

---

## 🏗️ Architecture Highlights

KodeLaci dibangun menggunakan pendekatan Fullstack Next.js App Router dengan Route Handlers sebagai backend API dan Supabase PostgreSQL sebagai database utama.

### Authentication & Authorization

- JWT-based authentication untuk akses endpoint terproteksi
- Password hashing menggunakan bcryptjs
- Route protection menggunakan Next.js Middleware
- Authorization scoping untuk memastikan pengguna hanya dapat mengakses data miliknya sendiri

### Data Management

- Relasi many-to-many antara snippet dan tag
- Slug unik menggunakan nanoid untuk URL publik
- Soft ownership model untuk fitur fork snippet

### Search System

- PostgreSQL Full-Text Search menggunakan `tsvector`
- Pencarian berdasarkan judul, deskripsi, kode, dan tag
- GIN Index untuk meningkatkan performa query pencarian

### Validation & Security

- Input validation menggunakan Zod
- JWT verification pada protected routes
- Rate limiting untuk endpoint publik
- Password hashing menggunakan bcryptjs

---

## 🚀 Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## ✨ Why KodeLaci?

- Built with Next.js App Router Fullstack Architecture
- Uses PostgreSQL Full-Text Search for fast snippet discovery
- Public snippet sharing with unique slug URLs
- Fork workflow inspired by GitHub repositories
- JWT-based authentication with route protection
- Modern UI built with Shadcn/UI and Tailwind CSS

---

## 🚀 Roadmap

### Core Features

- [x] Authentication & Authorization
- [x] Snippet CRUD
- [x] Public & Private Visibility
- [x] Slug-based Public Sharing
- [x] Full-text Search
- [x] Fork Snippet
- [x] Dark Mode

### Upcoming Features

- [ ] Collections & Favorites
- [ ] User Profile Page
- [ ] Snippet Version History
- [ ] Team Workspace
- [ ] AI-assisted Search
- [ ] Import from GitHub Gist
- [ ] Analytics Dashboard

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Achmad Faiz Yudha Ramadhan**

- GitHub: https://github.com/FaizZzhue
- LinkedIn: https://www.linkedin.com/in/afaizyr/