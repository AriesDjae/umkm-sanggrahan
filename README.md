# Usaha Warga Sanggrahan

Registri usaha warga **Kampung Sanggrahan, Kelurahan Semaki, Kemantren
Umbulharjo, Kota Yogyakarta** — RW 1 dan RW 3. Setiap UMKM adalah satu bidang
terdaftar bernomor: punya lembarnya sendiri yang bisa ditemukan lewat Google,
tautannya bisa disebar ke grup WhatsApp, dan letaknya bisa dilihat di peta
bidang. Pembeli menghubungi penjual langsung lewat WhatsApp: tidak ada
perantara, tidak ada komisi.

Next.js 16 (App Router), React 19, Tailwind CSS v4, Prisma + PostgreSQL
(Neon), Leaflet + OpenStreetMap. Halaman publik dibuat statis dan disegarkan
setiap kali pengurus menyimpan perubahan, jadi tetap cepat dibuka dan ramah
mesin pencari.

Isi registri dikelola pengurus lewat panel di **`/admin`** — bidang usaha
beserta produk dan fotonya, kategori, akun pengurus, dan pengaturan situs.

## Perintah

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Jalankan di komputer sendiri, buka <http://localhost:3000> |
| `npm run db:push` | Terapkan skema Prisma ke basis data |
| `npm run db:seed` | Isi basis data dari `data/umkm/*.json` + buat akun admin pertama |
| `npm run db:studio` | Buka Prisma Studio untuk melihat isi basis data |
| `npm run umkm:baru` | Wizard tanya-jawab yang menulis satu berkas JSON (bahan seed) |
| `npm run umkm:cek` | Periksa isi registri di basis data, laporkan yang salah atau kurang |
| `npm run uji:panel` | Uji jalan panel pengurus ujung-ke-ujung (perlu server hidup di :3210) |
| `npm run qc` | Jalankan semua pemeriksaan mutu sekaligus |
| `npm run build` | Bangun versi produksi |

Pemeriksaan satuan: `cek:tipe` (TypeScript), `lint` (aturan Next.js),
`cek:kisi` (semua jarak kelipatan 8px), `cek:kontras` (keterbacaan warna WCAG
AA), `cek:halaman` (SEO & aksesibilitas HTML hasil build). Penjelasannya di
**[docs/QC.md](docs/QC.md)**.

Untuk melihat hasil rancangan di berbagai ukuran layar:
`node scripts/tangkap-layar.mjs` (memakai Chrome yang sudah terpasang; hasilnya
ke `.impeccable/review/`, tidak ikut masuk git).

## Menyiapkan basis data

Registri ini memakai PostgreSQL sendiri, terpisah dari basis data situs Profil
RW Sanggrahan. Salin `.env.example` menjadi `.env`, isi `DATABASE_URL` dan
`SESSION_SECRET`, lalu:

```bash
npm run db:push     # buat tabelnya
npm run db:seed     # isi dari data/umkm/*.json, buat akun admin pertama
```

Akun admin pertama diambil dari `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_SANDI` di
`.env`. Gantilah sandinya dari `/admin/pengguna` setelah masuk pertama kali;
menjalankan seed lagi tidak pernah menimpa sandi akun yang sudah ada.

## Menambah UMKM

**Cara biasa:** masuk ke `/admin`, buka *Bidang usaha* lalu *Catat bidang
baru*. Nama usaha, RW, dan kategori sudah cukup untuk mencatatnya; sisanya bisa
dilengkapi belakangan. Foto diunggah langsung dari formulirnya.

**Cara borongan:** `npm run umkm:baru` menulis satu berkas JSON di `data/umkm/`,
lalu `npm run db:seed` memasukkannya ke basis data. Berguna kalau ada belasan
usaha yang datanya sudah terkumpul di luar. Seed mencocokkan berdasarkan nama
berkas, jadi menjalankannya berulang memperbarui, bukan menggandakan.

Panduan tanpa istilah teknis: **[docs/CARA-TAMBAH-UMKM.md](docs/CARA-TAMBAH-UMKM.md)**.

## Desain

Dunia visualnya **Registri Bidang** — lembar putih dingin, garis 1.5px yang
tegas, kop bergaris ganda, satu biru resmi. Dua keputusan menanggung seluruh
sistemnya: kategori dibedakan oleh kode huruf dan arsiran (bukan warna), dan
keadaan buka/tutup dibedakan oleh bentuk petak (bukan warna). Akibatnya seluruh
isinya tetap terbaca oleh pengunjung yang sulit membedakan warna maupun yang
membaca di bawah matahari, dan usaha tanpa foto tetap tampil setara.

Seluruh jarak dan ukuran berdiri di **kisi 8px** — 8, 16, 24, 32, 40, 48, 56,
64 — tanpa langkah setengah. `npm run cek:kisi` menjaganya.

Susunan berkolom berganti di satu titik untuk seluruh situs, `lg` (1024px), dan
lebar halaman ditetapkan di satu tempat saja — `components/Halaman.tsx` —
sehingga tepi kiri isi selalu sejajar dengan kop dan kaki halaman.

Aturan sistemnya tercatat di **[DESIGN.md](DESIGN.md)**. Kebenaran produk —
siapa penggunanya, apa batasannya, apa yang tidak boleh dikarang — di
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

lib/
  db.ts                    Klien Prisma
  umkm.ts                  Pembaca registri dari basis data
  kategori.ts              Tipe kategori dan kategori cadangan
  sesi.ts  otorisasi.ts    Sesi cookie JWT dan pemeriksaan peran
  unggah.ts                Simpan foto ke Vercel Blob atau public/unggahan
  pengaturan.ts            Pengaturan situs dari basis data
  site.ts                  Nilai bawaan situs + alamat situs Profil RW
  slug.ts                  Slug unik dan nomor bidang berikutnya
  konstanta.ts             Peran, daftar ikon, daftar arsiran, asal titik
  jam.ts                   Perhitungan "buka sekarang" zona waktu WIB
  gunakanJam.ts            Kaitan jam peramban
  format.ts                Format rupiah, tautan WhatsApp, dll.
  formulir.ts              Pembantu server action dan pengisian ulang formulir

components/admin/          Bidang isian, laci navigasi, kop, tombol hapus

prisma/
  schema.prisma            Skema basis data
  seed.ts                  Pemindah data/umkm/*.json ke basis data

uji/
  panel.mjs                Uji jalan panel pengurus lewat peramban sungguhan

data/
  kategori.json            Bahan seed kategori (setelahnya dikelola di /admin)
  umkm/*.json              Bahan seed bidang usaha
  umkm/_TEMPLATE.json      Contoh kosong untuk disalin

public/img/umkm/<slug>/  Foto tiap UMKM
scripts/                 Wizard, pemeriksa data, pemeriksa mutu, tangkap layar
docs/                    Rencana kerja, panduan pengelolaan, prosedur QC
```

## Tautan ke Profil RW Sanggrahan

Situs ini dan **[Profil RW Sanggrahan](https://profil-rw-sanggrahan.vercel.app)**
berdiri sendiri-sendiri — basis data, panel pengurus, dan deploy masing-masing
— tetapi melayani warga yang sama, jadi kop dan kaki halaman keduanya saling
menautkan. Alamat tujuannya diatur dari `/admin/pengaturan`, dengan nilai
bawaan di `lib/site.ts` pada `profilRw`.

## Yang perlu diganti sebelum dipublikasikan

Sebagian besar sudah pindah ke `/admin/pengaturan`: nama situs, wilayah, logo,
kontak WhatsApp pengurus, akun media sosial, titik tengah peta, dan tautan ke
Profil RW.

Yang masih berupa berkas:

- `lib/site.ts` pada `url` — alamat web sesungguhnya setelah deploy, dipakai
  peta situs dan pratinjau tautan
- `.env` pada `DATABASE_URL`, `SESSION_SECRET`, dan `BLOB_READ_WRITE_TOKEN`
  (kosongkan saat di komputer sendiri; isi di Vercel agar unggahan foto masuk
  ke Vercel Blob, karena sistem berkas Vercel hanya-baca)

Warna resmi kelurahan diganti di `app/globals.css` pada blok `@theme` saja —
tidak ada satu pun warna yang ditulis langsung di komponen. Yang paling mungkin
Anda ganti: `--color-resmi` beserta pasangan tua dan mudanya. Setelah
menggantinya, jalankan `npm run cek:kontras`.

Isi registri: `npm run umkm:cek` membaca basis data dan menandai nomor
WhatsApp contoh, koordinat yang lintang-bujurnya tertukar, dan tautan tanpa
`https://` sebagai kesalahan, supaya tidak ikut terpublikasi.
