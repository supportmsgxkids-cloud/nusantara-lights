
# Rencana Build: Nusantara Edu — Fase 1

Fokus: pondasi visual + alur publik + Home. Backend dan tab lain menyusul di fase berikutnya. Semua data adalah mock/dummy.

## 1. Design System (src/styles.css)

Inject seluruh design tokens dari blueprint sebagai semantic tokens — jangan pakai warna langsung di komponen.

- Konversi hex palette ke `oklch` untuk: primary-50/500/900, gold-50/400/700, surface, card, card2, text-primary/secondary/muted, danger, success, warning.
- Border radius scale: sm 10, md 12, soft 18, card 22, lg 28, pill 9999.
- Font: import **Plus Jakarta Sans** (latin) + **Noto Naskh Arabic** (arab) via Google Fonts di `__root.tsx` head links. Set sebagai CSS variables (`--font-sans`, `--font-arabic`).
- Shadow tokens lembut (opacity <15%): `--shadow-soft`, `--shadow-docked` (untuk bottom nav floating).
- Border default: `oklch primary-900 / 10%`.
- Background app default = `surface`.

## 2. Routing Architecture (TanStack Router)

```text
src/routes/
  __root.tsx              -> head links font, providers, Outlet
  index.tsx               -> redirect: jika belum onboarded → /onboarding, jika belum auth → /login, else → /home
  onboarding.tsx          -> 3 slide carousel
  login.tsx               -> email/password + Google (mock)
  register.tsx
  forgot-password.tsx
  _app.tsx                -> layout dengan TopBar + BottomTabNav + Outlet (pathless layout)
  _app/home.tsx           -> Home Dashboard (FASE INI - full build)
  _app/ilmu.tsx           -> placeholder "Coming soon"
  _app/ibadah.tsx         -> placeholder
  _app/sosial.tsx         -> placeholder
  _app/profil.tsx         -> placeholder
```

Catatan: gunakan `_app` sebagai pathless layout (URL tetap `/home`, `/ilmu`, dst). Tanpa auth guard backend dulu — state mock via `localStorage` flag `nu_onboarded` & `nu_authed`.

## 3. Komponen Inti yang Dibuat

- `components/layout/TopBar.tsx` — judul halaman, avatar kiri, ikon bell kanan, efek translucent saat scroll (backdrop-blur).
- `components/layout/BottomTabNav.tsx` — 5 tab (Home, Ilmu, Ibadah, Sosial, Profil) dengan Lucide icons (stroke saat inactive, fill saat active), floating dengan shadow halus + radius `large`.
- `components/home/GreetingHeader.tsx` — sapaan + ringkasan streak/XP (chip pill).
- `components/home/HeroBanner.tsx` — kartu "Lanjutkan Belajar" radius `large`, gradient lembut primary.
- `components/home/QuickActions.tsx` — grid 4 ikon (Al-Quran, Jadwal Sholat, Arah Kiblat, Tasbih).
- `components/home/ProgressFeed.tsx` — kartu ringkas progres + acara mendatang.
- `components/home/FloatingAIButton.tsx` — FAB AI Ustadz di kanan bawah (di atas bottom nav), pill, gold accent, navigate ke `/ai-ustadz` (route placeholder).
- `components/onboarding/OnboardingSlide.tsx` — slide dengan ilustrasi geometri Islami (SVG inline, faceless), judul, deskripsi, dots indicator.
- `components/auth/AuthCard.tsx` — wrapper form minimalis radius `card`.

## 4. Onboarding & Auth (UI only, mock submit)

- **Onboarding**: 3 slide dengan ilustrasi geometri (bintang 8, kubah, lentera) menggunakan SVG inline. Tombol "Lewati" + "Lanjut" → slide terakhir → "Mulai" navigasi ke `/login` dan set `nu_onboarded=true`.
- **Login**: email + password input (radius sm), tombol "Masuk" (pill primary-900), divider "atau", tombol Google outline. Link ke `/register` dan `/forgot-password`. Submit → set `nu_authed=true` → navigate `/home`.
- **Register**: nama, email, password, tombol "Daftar".
- **Forgot password**: input email + tombol kirim + state sukses inline.

## 5. Home Dashboard (full build)

Urutan vertikal scroll:
1. TopBar (avatar + "Beranda" + bell)
2. GreetingHeader — "Assalamu'alaikum, Ahmad" + chip streak 🔥 7 hari · ⭐ 1,240 XP
3. HeroBanner — "Lanjutkan: Fiqh Sholat — Modul 3" + progress bar + tombol Lanjut
4. QuickActions grid 4 kolom
5. Section "Progres Hari Ini" — 3 baris mutabaah mini (Tilawah, Dhuha, Dzikir Pagi) dengan checkbox custom
6. Section "Acara Mendatang" — list 2 kartu kajian
7. FloatingAIButton (fixed)
8. BottomTabNav (fixed)

## 6. States

- **Loading**: skeleton (bukan spinner) untuk kartu hero & quick actions menggunakan `<Skeleton>` dari shadcn dengan radius sesuai token.
- **Empty**: contoh di "Acara Mendatang" jika kosong — ikon outline + teks muted.
- **Interactive**: active scale 0.97 + transition spring di semua tombol; hover hanya untuk desktop.

## 7. Viewport

Set preview device ke mobile (390px) sejak awal sehingga tampilan dirancang langsung sesuai target.

## Technical Notes

- Stack: TanStack Start (sudah ada) + Tailwind v4 + shadcn UI components yang sudah tersedia (Button, Card, Skeleton, Input, Label, Avatar).
- Tidak ada package baru kecuali jika dibutuhkan (semua sudah cukup).
- Tidak aktifkan Lovable Cloud di fase ini.
- Tab placeholder cukup tampilkan judul + ilustrasi "Segera Hadir" agar bottom nav tetap berfungsi.
- Fase 2 (setelah approval): salah satu tab fitur (rekomendasi: Ibadah karena paling berkarakter) + aktifkan Cloud untuk auth nyata.

## Tidak Termasuk Fase Ini

- Backend (auth, database, AI Gateway)
- Tab Ilmu/Ibadah/Sosial/Profil dengan konten penuh
- Implementasi AI Ustadz (hanya FAB + halaman placeholder)
- Dark mode (blueprint hanya menyebut light theme teduh)
