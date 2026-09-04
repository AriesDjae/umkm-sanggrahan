# Rencana: Web Promosi UMKM Desa Sanggrahan (RW 1 & RW 3)

Dokumen ini adalah rencana kerja.

> **Status per 4 September 2026:** Tahap 2, 3, 4, dan 7 selesai. Registri berisi
> **26 bidang** hasil baca banner Tourist RoadMap kampung, dan sejak hari ini isinya
> dikelola pengurus lewat **panel di `/admin`** — bukan lagi berkas JSON yang perlu
> deploy ulang. Yang tersisa: menyambangi 26 bidang itu untuk melengkapi nama pemilik,
> nomor WhatsApp, jam buka, produk, dan foto (tahap 1 & 5), lalu publikasi (tahap 6).
> Panduan pengelolaan harian ada di [CARA-TAMBAH-UMKM.md](CARA-TAMBAH-UMKM.md).

---

## 1. Tujuan

Web ini **bukan** profil desa. Fokusnya satu: **etalase online UMKM RW 1 & RW 3 agar ditemukan orang di internet dan menghasilkan chat/order masuk.**

Ukuran keberhasilan:
- Setiap UMKM punya satu halaman sendiri yang bisa dishare linknya.
- Nama UMKM + "Sanggrahan" muncul di pencarian Google.
- Ada jalur langsung dari pengunjung ke penjual (WhatsApp / marketplace).
- Muncul di Google Maps lewat Google Bisnisku (gratis, dampaknya paling besar untuk usaha lokal).

## 2. Keputusan yang sudah diambil

| Hal | Pilihan | Alasan |
|---|---|---|
| Stack | Next.js (App Router) + Tailwind CSS | Halaman di-generate statis → cepat, SEO kuat, sitemap & metadata otomatis |
| Data UMKM | ~~File JSON di dalam project~~ → **PostgreSQL (Neon) + Prisma** | Diubah 4 Sep 2026. Berkas JSON menuntut pengurus paham Git dan deploy ulang tiap kali; itu memastikan registri berhenti diperbarui begitu saya lepas tangan. Berkas JSON yang lama kini jadi bahan seed. |
| Pengelolaan isi | Panel pengurus di `/admin`, login sendiri | Pengurus bisa menambah dan menyunting dari HP, tanpa terminal |
| Penyimpanan foto | Vercel Blob (produksi), `public/unggahan` (lokal) | Sistem berkas Vercel hanya-baca, jadi unggahan tidak bisa ditulis ke folder project |
| Kontak pembeli | Tombol WhatsApp + link marketplace | Sesuai kebiasaan UMKM desa, nol biaya, tanpa maintenance |
| Hosting | Vercel (paket gratis) | Deploy otomatis, HTTPS, CDN, tanpa biaya bulanan |
| Status data | Belum ada → perlu pendataan dulu | Web dibangun paralel dengan data contoh, lalu diisi data asli |

## 3. Struktur halaman

```
/                      Beranda — hero, UMKM unggulan, kategori, ajakan daftar
/umkm                  Daftar semua UMKM + filter kategori & RW + pencarian
/umkm/[slug]           Halaman detail satu UMKM (INI ujung tombak SEO)
/kategori/[kategori]   Kumpulan UMKM per kategori (Kuliner, Kerajinan, dst.)
/tentang               Tentang program & profil singkat RW 1 dan RW 3
/daftar                Cara UMKM ikut bergabung (form/kontak pengurus)
```

Isi halaman detail UMKM (`/umkm/[slug]`):
- Nama usaha, foto/logo, deskripsi, kategori, RW
- Daftar produk + harga + foto
- Tombol **Chat WhatsApp** (pesan otomatis sudah terisi nama produk)
- Link marketplace bila punya (Shopee / Tokopedia / GoFood / TikTok Shop)
- Alamat + link Google Maps, jam buka
- Data terstruktur `LocalBusiness` (schema.org) → syarat agar tampil bagus di Google

## 4. Skema data UMKM

> **Usang sejak 4 September 2026.** Skema yang berlaku sekarang ada di
> [`prisma/schema.prisma`](../prisma/schema.prisma): tabel `Umkm`, `ProdukUmkm`,
> `Kategori`, `User`, dan `Pengaturan`. Bentuk JSON di bawah masih dipakai
> `data/umkm/*.json` sebagai bahan seed, jadi tetap dicatat di sini.

Satu berkas per UMKM di `data/umkm/`, berisi objek seperti ini:

```json
{
  "slug": "keripik-bu-sri",
  "nama": "Keripik Bu Sri",
  "pemilik": "Sri Wahyuni",
  "rw": 1,
  "kategori": "Kuliner",
  "deskripsi": "Keripik singkong dan pisang produksi rumahan sejak 2015.",
  "alamat": "RT 02 RW 01, Sanggrahan",
  "maps": "https://maps.app.goo.gl/...",
  "jamBuka": "08.00 - 17.00 (Senin-Sabtu)",
  "whatsapp": "628xxxxxxxxxx",
  "marketplace": {
    "shopee": "",
    "tokopedia": "",
    "gofood": "",
    "tiktok": ""
  },
  "sosmed": { "instagram": "", "facebook": "" },
  "foto": "/img/umkm/keripik-bu-sri/utama.jpg",
  "produk": [
    { "nama": "Keripik Singkong 250gr", "harga": 12000, "foto": "/img/umkm/keripik-bu-sri/singkong.jpg" }
  ],
  "unggulan": true
}
```

Kategori yang disiapkan: **Kuliner, Kerajinan, Fashion & Konveksi, Pertanian & Ternak, Jasa, Lainnya.**

## 5. Form pendataan UMKM

Karena data belum ada, langkah pertama adalah mengumpulkannya. Yang akan saya siapkan:

1. **Formulir cetak (PDF/Word)** — untuk disebar pengurus RT/RW ke pelaku usaha.
2. **Panduan foto produk pakai HP** — 1 halaman, sederhana; foto jelek = promosi gagal.
3. **Template Google Form** (opsional) — kalau mau isi lewat HP.

Kolom yang didata (wajib bertanda \*):
Nama usaha\*, Nama pemilik\*, RW & RT\*, Kategori usaha\*, Deskripsi singkat\*,
Alamat\*, Nomor WhatsApp aktif\*, Jam buka, Daftar produk + harga\*,
Akun marketplace (bila ada), Instagram/Facebook (bila ada),
Foto usaha + foto tiap produk\*, Persetujuan data ditampilkan publik\*.

> Catatan penting: nomor WA dan alamat akan tampil publik di internet. Perlu ada
> pernyataan persetujuan tertulis dari tiap pemilik usaha di formulir.

## 6. Strategi sebar ke internet

Web yang tidak disebar = tidak ada gunanya. Tiga lapis:

**Lapis 1 — Fondasi teknis (dikerjakan bersama web)**
- Judul & deskripsi tiap halaman dioptimasi kata kunci lokal
  (contoh: "Keripik Singkong Sanggrahan | Keripik Bu Sri")
- `sitemap.xml` + `robots.txt` otomatis
- Data terstruktur schema.org di tiap halaman UMKM
- Gambar preview saat link dishare ke WA/FB (Open Graph)
- Situs cepat & rapi di layar HP (mayoritas pengunjung dari HP)

**Lapis 2 — Didaftarkan ke platform (setelah web online)**
- Google Search Console → daftarkan sitemap
- Google Bisnisku untuk tiap UMKM → ini yang membuat muncul di Google Maps
- Akun Instagram & Facebook Page bersama "Usaha Warga Sanggrahan"
- Daftarkan ke direktori UMKM daerah / dinas terkait

**Lapis 3 — Penyebaran manual (dikerjakan pengurus, berkelanjutan)**
- Sebar link web di grup WA warga, RT, RW, karang taruna
- QR code menuju halaman UMKM → ditempel di warung/kemasan produk
- Konten rutin di IG/FB: 1 UMKM disorot per minggu
- Kerja sama dengan akun info kota/kabupaten setempat

## 7. Tahapan pengerjaan

| Tahap | Isi | Hasil |
|---|---|---|
| **1. Pendataan** | Formulir + panduan foto + daftar kategori final | Berkas siap disebar ke RW 1 & 3 |
| **2. Pondasi web** | Setup Next.js + Tailwind, struktur data, komponen dasar | Project jalan di lokal |
| **3. Halaman inti** | Beranda, daftar UMKM, detail UMKM, filter & pencarian | Web fungsional dengan data contoh |
| **4. SEO & share** | Metadata, sitemap, schema.org, Open Graph, QR code | Siap ditemukan mesin pencari |
| **5. Isi data asli** | Masukkan data + foto hasil pendataan | Web berisi UMKM sungguhan |
| **6. Online** | Deploy ke Vercel, daftar Search Console & Google Bisnisku | Web bisa diakses publik |
| **7. Serah terima** | Panel pengurus + panduan cara menambah UMKM baru | Bisa dirawat tanpa saya |

Tahap 2–4 bisa dikerjakan sekarang tanpa menunggu data selesai, memakai data contoh.

## 8. Biaya

- Hosting Vercel: **Rp 0**
- Domain: **Rp 0** kalau pakai subdomain gratis (`umkm-sanggrahan.vercel.app`).
  Kalau mau nama sendiri, domain `.my.id` sekitar **Rp 15–25 ribu/tahun**,
  `.com` sekitar **Rp 150–200 ribu/tahun**. Domain sendiri lebih meyakinkan dan lebih baik untuk SEO.
- Google Bisnisku, Instagram, Facebook: **Rp 0**

## 9. Yang saya butuhkan dari Anda

1. Nama resmi program/web dan apakah pakai domain sendiri atau subdomain gratis.
2. Kontak penanggung jawab (nomor WA pengurus) untuk halaman `/daftar`.
3. Logo desa/RW bila ada, dan warna khas yang diinginkan.
4. Perkiraan jumlah UMKM di RW 1 dan RW 3 (untuk menentukan perlu-tidaknya pencarian & paginasi).

## 10. Batasan yang perlu disadari

- Google butuh waktu **beberapa minggu sampai berbulan-bulan** untuk mengindeks situs baru. Hasil tidak instan.
- ~~Situs statis berarti setiap penambahan UMKM baru perlu deploy ulang.~~ Tidak lagi
  berlaku sejak 4 September 2026: pengurus menambah dan menyunting dari `/admin`, dan
  halaman publiknya menyegarkan diri sendiri. Yang tetap dibutuhkan adalah satu orang
  yang mau rutin melakukannya.
- Dampak terbesar untuk usaha lokal justru datang dari **Google Bisnisku dan media sosial**, bukan dari web itu sendiri. Web berperan sebagai pusat/rujukan yang linknya disebar.

---

## 11. Riwayat perubahan besar

### 4 September 2026 — registri pindah ke basis data, panel pengurus berdiri

Sebelumnya isi registri hidup sebagai berkas JSON di dalam project. Bagus untuk dua
tiga orang yang paham Git, tetapi mustahil dipakai pengurus RW dari peramban — dan
sistem berkas Vercel hanya-baca, jadi menulis dari web pun tidak mungkin.

Yang berubah:

- **Basis data** PostgreSQL sendiri di Neon, terpisah dari basis data Profil RW.
  Tabel: `User`, `Kategori`, `Umkm`, `ProdukUmkm`, `Pengaturan`.
- **Seed** memindahkan 26 berkas JSON + `kategori.json` ke basis data. Aman diulang:
  mencocokkan per slug, dan tidak pernah menimpa sandi akun yang sudah ada.
- **Login sendiri** — cookie JWT, bcrypt, dua peran: `ADMIN` dan `PENGURUS`.
- **Panel `/admin`** — CRUD bidang usaha (beserta produk dan unggah foto), kategori,
  akun pengurus, dan pengaturan situs. Dasbornya berupa daftar pekerjaan, bukan
  pajangan angka: bidang mana yang belum punya WhatsApp, jam buka, produk, titik peta.
- **Halaman publik** pindah ke grup rute `app/(publik)/` supaya panel bisa memakai
  kerangka halaman sendiri. Halamannya tetap statis, disegarkan lewat `revalidatePath`
  setiap kali pengurus menyimpan.
- **Tautan dua arah** dengan situs Profil RW Sanggrahan di kop dan kaki kedua situs.
- **`npm run uji:panel`** — uji jalan ujung-ke-ujung lewat peramban sungguhan.

Yang belum: environment variable di Vercel (`DATABASE_URL`, `SESSION_SECRET`,
`BLOB_READ_WRITE_TOKEN`) dan penggantian sandi admin bawaan.
