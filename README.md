<div align="center">

# Usaha Warga Sanggrahan

**Registri usaha warga Kampung Sanggrahan — RW 1 dan RW 3.**
Satu usaha, satu lembar bernomor: bisa ditemukan lewat Google, tautannya bisa
disebar ke grup WhatsApp, letaknya terlihat di peta. Pembeli menghubungi
penjual langsung — tidak ada perantara, tidak ada komisi.

[**Lihat situsnya →**](https://umkm-sanggrahan.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)

</div>

---

## Daftar isi

1. [Untuk siapa situs ini](#untuk-siapa-situs-ini)
2. [Apa yang bisa dilakukan](#apa-yang-bisa-dilakukan)
3. [Mulai cepat](#mulai-cepat)
4. [Berkas lingkungan (.env)](#berkas-lingkungan-env)
5. [Akun pengurus](#akun-pengurus)
6. [Menambah UMKM](#menambah-umkm)
7. [Perintah](#perintah)
8. [Desain](#desain)
9. [Struktur folder](#struktur-folder)
10. [Penerapan (deploy)](#penerapan-deploy)
11. [Yang perlu diganti sebelum dipublikasikan](#yang-perlu-diganti-sebelum-dipublikasikan)
12. [Situs warga yang bersebelahan](#situs-warga-yang-bersebelahan)

---

## Untuk siapa situs ini

| Siapa | Perannya di sini |
| --- | --- |
| **Warga sekitar Umbulharjo** | Pengunjung. Memegang HP, butuh sesuatu hari ini, dan yang menentukan keputusannya: sedang buka atau tidak, seberapa dekat, bisa langsung dihubungi atau tidak. |
| **Pemilik UMKM** | Tidak memakai situs ini, tetapi menerima hasilnya berupa pesan WhatsApp. |
| **Pengurus RW** | Satu-satunya orang yang memasukkan data, lewat panel di `/admin`. Bukan pemrogram. |

Wilayah: **Kampung Sanggrahan, Kelurahan Semaki, Kemantren Umbulharjo,
Kota Yogyakarta** — RW 1 dan RW 3.

Berhasil kalau pemilik usaha menerima pesan WhatsApp dari orang yang belum
pernah mereka kenal, dan orang itu menemukannya lewat situs ini.

## Apa yang bisa dilakukan

**Halaman pengunjung**

- **Beranda** — kop lembar sampul, profil singkat kampung, peta, dan petikan registri.
- **Daftar UMKM** (`/umkm`) — semua bidang usaha sebagai baris registri bernomor.
- **Halaman tiap usaha** (`/umkm/<slug>`) — deskripsi, produk beserta harganya,
  jam buka, alamat, peta, dan tombol WhatsApp.
- **Peta bidang** (`/peta`) — Leaflet + OpenStreetMap, tiap usaha jadi patok bernomor.
- **Kategori** (`/kategori/<kategori>`), **Tentang**, dan **Daftar** (cara warga
  mendaftarkan usahanya).
- Tiap halaman punya metadata dan data terstrukturnya sendiri, dibuat statis lalu
  disegarkan setiap kali pengurus menyimpan perubahan — cepat dibuka, ramah mesin
  pencari.

**Panel pengurus** (`/masuk` lalu `/admin`)

- **Bidang usaha** — tambah, ubah, hapus; produk dan foto ikut di dalamnya.
  Foto diunggah langsung dari formulir.
- **Kategori** — nama, kode huruf, ikon, arsiran, urutan.
- **Akun pengurus** dan **Pengaturan situs** — khusus administrator.

**Yang dijaga di sisi server**

- Sesi berupa cookie `httpOnly` bertanda tangan JWT (`jose`), sandi di-hash `bcrypt`.
- Foto dikecilkan sekali saat diunggah ke maksimal 1600px dan disimpan sebagai
  WEBP (`sharp`). Efek sampingnya disengaja: metadata EXIF terbuang, termasuk
  titik GPS yang tertanam pada foto dari HP — **letak rumah atau warung warga
  tidak ikut terbawa ke situs**.

## Mulai cepat

Butuh Node.js 20+ dan sebuah basis data PostgreSQL (lokal, atau gratis dari
[Neon](https://neon.tech)).

```bash
git clone https://github.com/AriesDjae/umkm-sanggrahan.git
cd umkm-sanggrahan
npm install

cp .env.example .env     # isi DATABASE_URL dan SESSION_SECRET
npm run db:push          # buat tabelnya
npm run db:seed          # isi dari data/umkm/*.json + buat akun admin pertama

npm run dev              # http://localhost:3000
```

Registri ini memakai PostgreSQL **sendiri**, terpisah dari basis data situs
Profil RW Sanggrahan. Jangan diarahkan ke basis data yang sama.

### Berkas lingkungan (.env)

| Nama | Wajib | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | ya | Alamat PostgreSQL, mis. `postgresql://…?sslmode=require`. |
| `SESSION_SECRET` | ya | Kunci penanda tangan sesi, **minimal 32 karakter**. |
| `BLOB_READ_WRITE_TOKEN` | tidak | Bila diisi, unggahan foto masuk ke Vercel Blob. Bila kosong, ditulis ke `public/unggahan` — dipakai saat lokal dan saat dipasang di server sendiri. |
| `SEED_ADMIN_EMAIL` | seed | Surel akun pengelola pertama, dipakai sekali saat `npm run db:seed`. |
| `SEED_ADMIN_SANDI` | seed | Sandi awal akun itu. |

## Akun pengurus

Akun administrator pertama dibuat oleh `npm run db:seed` dari `SEED_ADMIN_EMAIL`
dan `SEED_ADMIN_SANDI`. **Gantilah sandinya dari `/admin/pengguna` setelah masuk
pertama kali.** Menjalankan seed lagi tidak pernah menimpa sandi akun yang sudah
ada.

Ada dua peran:

| Peran | Boleh |
| --- | --- |
| **Administrator** | Segalanya, termasuk akun pengguna dan pengaturan situs. |
| **Pengurus RW** | Bidang usaha, produk, foto, dan kategori. Tidak menyentuh akun maupun pengaturan. |

## Menambah UMKM

**Cara biasa** — masuk ke `/admin`, buka *Bidang usaha* lalu *Catat bidang baru*.
Nama usaha, RW, dan kategori sudah cukup untuk mencatatnya; sisanya bisa
dilengkapi belakangan. Foto diunggah langsung dari formulirnya.

**Cara borongan** — `npm run umkm:baru` menulis satu berkas JSON di `data/umkm/`,
lalu `npm run db:seed` memasukkannya ke basis data. Berguna kalau ada belasan
usaha yang datanya sudah terkumpul di luar. Seed mencocokkan berdasarkan nama
berkas, jadi menjalankannya berulang **memperbarui, bukan menggandakan**.

Panduan tanpa istilah teknis untuk pengurus:
**[docs/CARA-TAMBAH-UMKM.md](docs/CARA-TAMBAH-UMKM.md)**.

## Perintah

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Jalankan di komputer sendiri, buka <http://localhost:3000> |
| `npm run build` | Bangun versi produksi (`prisma generate` + `next build`) |
| `npm run db:push` | Terapkan skema Prisma ke basis data |
| `npm run db:seed` | Isi basis data dari `data/umkm/*.json` + buat akun admin pertama |
| `npm run db:studio` | Buka Prisma Studio untuk melihat isi basis data |
| `npm run umkm:baru` | Wizard tanya-jawab yang menulis satu berkas JSON (bahan seed) |
| `npm run umkm:cek` | Periksa isi registri di basis data, laporkan yang salah atau kurang |
| `npm run uji:panel` | Uji jalan panel pengurus ujung-ke-ujung (perlu server hidup di `:3210`) |
| `npm run qc` | Jalankan semua pemeriksaan mutu sekaligus |

Pemeriksaan satuan: `cek:tipe` (TypeScript), `lint` (aturan Next.js), `cek:kisi`
(semua jarak kelipatan 8px), `cek:kontras` (keterbacaan warna WCAG AA),
`cek:halaman` (SEO & aksesibilitas HTML hasil build). Penjelasannya di
**[docs/QC.md](docs/QC.md)**.

Melihat hasil rancangan di berbagai ukuran layar:
`node scripts/tangkap-layar.mjs` — memakai Chrome yang sudah terpasang, hasilnya
ke `.impeccable/review/` dan tidak ikut masuk git.

## Desain

Dunia visualnya **Registri Bidang** — lembar putih dingin, garis 1.5px yang
tegas, kop bergaris ganda, satu biru resmi. Dua keputusan menanggung seluruh
sistemnya:

- **Kategori dibedakan oleh kode huruf dan arsiran, bukan warna.**
- **Keadaan buka/tutup dibedakan oleh bentuk petak, bukan warna.**

Akibatnya seluruh isinya tetap terbaca oleh pengunjung yang sulit membedakan
warna maupun yang membaca di bawah matahari, dan usaha tanpa foto tetap tampil
setara.

Seluruh jarak dan ukuran berdiri di **kisi 8px** — 8, 16, 24, 32, 40, 48, 56, 64
— tanpa langkah setengah; `npm run cek:kisi` menjaganya. Susunan berkolom
berganti di satu titik untuk seluruh situs, `lg` (1024px), dan lebar halaman
ditetapkan di satu tempat saja — `components/Halaman.tsx` — sehingga tepi kiri
isi selalu sejajar dengan kop dan kaki halaman.

Aturan sistemnya di **[DESIGN.md](DESIGN.md)**. Kebenaran produk — siapa
penggunanya, apa batasannya, apa yang tidak boleh dikarang — di
**[PRODUCT.md](PRODUCT.md)**.

## Struktur folder

```
app/
  (publik)/                Halaman pengunjung, berkop dan berkaki situs
    page.tsx                 Beranda — kop, profil singkat, peta, petikan lembar
    umkm/                    Daftar UMKM & halaman detail tiap usaha
    peta/                    Peta bidang (Leaflet + OpenStreetMap)
    kategori/[kategori]/     Halaman per kategori
    tentang/  daftar/        Halaman informasi
  masuk/                   Halaman masuk pengurus
  admin/                   Panel pengurus
    umkm/                    CRUD bidang usaha beserta produknya
    kategori/                CRUD kategori
    pengguna/                CRUD akun pengurus (administrator saja)
    pengaturan/              Pengaturan situs (administrator saja)
  sitemap.ts  robots.ts    Berkas untuk mesin pencari
  opengraph-image.tsx      Gambar pratinjau saat tautan dibagikan

components/
  Halaman.tsx              Wadah halaman: lebar, padding, dan ukuran baris baca
  BarisBidang.tsx          Satu UMKM sebagai satu baris registri bernomor
  KodeBidang.tsx           Kode huruf + arsiran kategori, pengganti warna
  TandaBuka.tsx            Tanda BUKA/TUTUP; bentuk petaknya yang menanggung arti
  PetaUmkm.tsx             Peta beserta patok bidang bernomor
  Ikon.tsx                 Ikon digambar sendiri — tanpa emoji
  admin/                   Bidang isian, laci navigasi, kop, tombol hapus

lib/
  db.ts                    Klien Prisma
  umkm.ts                  Pembaca registri dari basis data
  kategori.ts              Tipe kategori dan kategori cadangan
  sesi.ts  otorisasi.ts    Sesi cookie JWT dan pemeriksaan peran
  unggah.ts  gambar.ts     Simpan foto (Vercel Blob / public/unggahan) + pengecil foto
  pengaturan.ts            Pengaturan situs dari basis data
  site.ts                  Nilai bawaan situs + alamat situs Profil RW
  slug.ts                  Slug unik dan nomor bidang berikutnya
  konstanta.ts             Peran, daftar ikon, daftar arsiran, asal titik
  jam.ts  gunakanJam.ts    Perhitungan "buka sekarang" zona WIB + kaitan jam peramban
  format.ts                Format rupiah, tautan WhatsApp, dll.
  formulir.ts              Pembantu server action dan pengisian ulang formulir

prisma/
  schema.prisma            Skema basis data
  seed.ts                  Pemindah data/umkm/*.json ke basis data

uji/panel.mjs              Uji jalan panel pengurus lewat peramban sungguhan

data/
  kategori.json            Bahan seed kategori (setelahnya dikelola di /admin)
  umkm/*.json              Bahan seed bidang usaha
  umkm/_TEMPLATE.json      Contoh kosong untuk disalin

public/img/umkm/<slug>/    Foto tiap UMKM
scripts/                   Wizard, pemeriksa data, pemeriksa mutu, tangkap layar
docs/                      Rencana kerja, panduan pengelolaan, prosedur QC
```

### Basis data

Lima model di `prisma/schema.prisma`:

| Model | Isi |
| --- | --- |
| `Umkm` | Satu bidang usaha: nomor registri, slug, RW/RT, kategori, koordinat, jam buka terstruktur, WhatsApp, tautan lapak daring. |
| `ProdukUmkm` | Barang/jasa yang dijual satu usaha. `harga` boleh kosong — artinya belum didata, bukan gratis. |
| `Kategori` | Nama, kode huruf, ikon, dan arsiran pembeda. |
| `User` | Akun pengelola: `ADMIN` atau `PENGURUS`. |
| `Pengaturan` | Baris tunggal `id = 1`: identitas situs, kontak, titik tengah peta, tautan ke Profil RW. |

Kolom `sumberTitik` merekam asal koordinat (`gps`, `osm`, atau
`perkiraan-banner`). Titik dari banner kampung meleset puluhan meter, jadi situs
**mengatakannya**, bukan memajangnya seolah hasil ukur.

## Penerapan (deploy)

Dipasang di Vercel, region **Singapura** (`sin1`, disetel di `vercel.json`)
supaya dekat dengan pengunjung dan basis data Neon.

1. Buat basis data PostgreSQL di Neon, salin connection string.
2. Impor repositori ini di Vercel.
3. Isi environment variable: `DATABASE_URL`, `SESSION_SECRET`, dan
   `BLOB_READ_WRITE_TOKEN`. **`BLOB_READ_WRITE_TOKEN` wajib diisi di Vercel** —
   sistem berkas di sana hanya-baca, jadi tanpa token itu unggahan foto pengurus
   akan gagal.
4. Jalankan `npm run db:push` (atau `npm run db:deploy` bila memakai migrasi)
   dari komputer sambil diarahkan ke basis data produksi. Skema **tidak**
   dijalankan saat build Vercel.

Untuk server sendiri: kosongkan `BLOB_READ_WRITE_TOKEN` agar unggahan memakai
folder `public/unggahan`, lalu `npm run build && npm start`. Sertakan basis data
dan folder itu dalam pencadangan rutin.

## Yang perlu diganti sebelum dipublikasikan

Sebagian besar sudah pindah ke **`/admin/pengaturan`**: nama situs, wilayah,
logo, kontak WhatsApp pengurus, akun media sosial, titik tengah peta, dan tautan
ke Profil RW.

Yang masih berupa berkas:

- `lib/site.ts` pada `url` — alamat web sesungguhnya setelah deploy, dipakai
  peta situs dan pratinjau tautan.
- `lib/site.ts` pada `kontakPengurus.whatsapp` — masih nomor contoh.
- `.env` pada `DATABASE_URL`, `SESSION_SECRET`, dan `BLOB_READ_WRITE_TOKEN`.

Warna resmi kelurahan diganti di `app/globals.css` pada blok `@theme` **saja** —
tidak ada satu pun warna yang ditulis langsung di komponen. Yang paling mungkin
Anda ganti: `--color-resmi` beserta pasangan tua dan mudanya. Setelah
menggantinya, jalankan `npm run cek:kontras`.

Isi registri: `npm run umkm:cek` membaca basis data dan menandai nomor WhatsApp
contoh, koordinat yang lintang-bujurnya tertukar, dan tautan tanpa `https://`
sebagai kesalahan, supaya tidak ikut terpublikasi.

## Situs warga yang bersebelahan

**[Profil RW Sanggrahan](https://profil-rw-sanggrahan.vercel.app)** — portal
warga RW 01, 02, dan 03: berita, kegiatan, data kependudukan, galeri, dan
laporan kas RT berjenjang
([repositori](https://github.com/AriesDjae/profil-rw-sanggrahan)).

Kedua situs berdiri sendiri-sendiri — basis data, panel pengurus, dan deploy
masing-masing — tetapi melayani warga yang sama, jadi kop dan kaki halaman
keduanya saling menautkan. Alamat tujuannya diatur dari `/admin/pengaturan`,
dengan nilai bawaan di `lib/site.ts` pada `profilRw`.

---

<div align="center">
<sub>Dibangun swadaya untuk warga Kampung Sanggrahan, Semaki, Umbulharjo, Yogyakarta.</sub>
</div>
