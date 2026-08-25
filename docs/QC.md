# Pemeriksaan Mutu (QC)

Web ini punya enam pemeriksaan otomatis. Semuanya bisa dijalankan sekaligus:

```
npm run qc
```

Perintah itu berhenti di pemeriksaan pertama yang gagal, jadi kalau sampai selesai
berarti semuanya lolos.

---

## Isi pemeriksaan

| Perintah | Yang diperiksa | Gagal berarti |
|---|---|---|
| `npm run cek:tipe` | Kecocokan tipe data di seluruh kode TypeScript | Ada kode yang berpotensi error saat dijalankan |
| `npm run lint` | Gaya penulisan dan pola berbahaya menurut aturan Next.js | Ada kode yang perlu dirapikan |
| `npm run cek:kontras` | Keterbacaan 23 pasangan warna dan garis menurut standar WCAG AA | Ada teks atau garis yang sulit dibaca |
| `npm run build` | Seluruh halaman berhasil dibangun jadi HTML statis | Ada halaman yang error saat dibangun |
| `npm run cek:halaman` | Mutu HTML hasil build: judul, deskripsi, heading, gambar, tautan | Ada masalah SEO atau aksesibilitas |
| `npm run umkm:cek` | Kelengkapan dan kebenaran data UMKM | Ada data yang salah atau belum diisi |

`cek:halaman` membaca hasil build, jadi harus dijalankan **sesudah** `npm run build`.
Kalau dijalankan lewat `npm run qc`, urutannya sudah benar dengan sendirinya.

---

## Yang diperiksa `cek:kontras`

Membandingkan warna teks dengan warna latarnya, lalu menghitung rasio kontras
sesuai rumus WCAG 2.1. Ambang batasnya:

- teks biasa — minimal **4.5:1**
- teks besar atau tebal — minimal **3.0:1**

Kalau nanti Anda mengubah warna di `app/globals.css`, jalankan perintah ini untuk
memastikan teksnya masih terbaca. Daftar pasangan warna yang diuji ada di
`scripts/cek-kontras.mjs` — tambahkan pasangan baru di sana kalau ada kombinasi
warna baru.

## Yang diperiksa `cek:halaman`

Untuk setiap halaman hasil build:

- `<html lang="id">` — supaya mesin pencari tidak salah menebak bahasa
- ada `<title>`, panjangnya di bawah 65 huruf
- ada meta description, panjangnya 70–160 huruf
- ada `og:title` dan `og:description` untuk pratinjau saat tautan dibagikan
- tepat satu `<h1>`, dan tingkat heading tidak melompat (h1 → h3 tanpa h2)
- setiap gambar punya teks alternatif (`alt`)
- setiap tautan punya teks atau `aria-label`, dan tidak ada `href` kosong
- setiap tautan yang membuka jendela baru memakai `rel="noopener"`
- setiap tombol punya teks atau `aria-label`

---

## Hasil terakhir

Dijalankan 24 Agustus 2026, sesudah perombakan desain kedua (Registri Bidang),
dengan 5 data contoh:

```
cek:tipe      ✓ lolos
lint          ✓ lolos, tanpa peringatan
cek:kontras   ✓ 23 dari 23 pasangan warna lolos WCAG AA
build         ✓ 23 halaman dibangun jadi statis
cek:halaman   ✓ 16 halaman lolos, tanpa peringatan
umkm:cek      ✗ 5 kesalahan — semuanya nomor WhatsApp contoh (disengaja)
```

Kegagalan `umkm:cek` itu **memang dipasang sebagai pengaman**: selama data contoh
belum diganti data asli, pemeriksaan akan terus gagal supaya nomor WhatsApp
palsu tidak ikut terpublikasi. Begitu kelima berkas contoh di `data/umkm/`
diganti data sungguhan, pemeriksaan ini ikut hijau.

Selain keenam pemeriksaan itu, perombakan desain juga melewati:

- `node .claude/skills/impeccable/scripts/detect.mjs` — detektor pola desain
  bawaan skill impeccable: **bersih, tanpa temuan**.
- Dua putaran tangkapan layar desktop (1440×900) dan HP (390×844) pada lima
  halaman, lewat `node scripts/tangkap-layar.mjs`.

Catatan soal ambang batas: pemeriksaan kontras sekarang juga menguji **garis**,
bukan hanya teks. Di dunia Registri Bidang garis adalah strukturnya, jadi garis
wajib lolos ambang 3:1 (WCAG 1.4.11) — bukan sekadar hiasan.

## Perbaikan yang sudah dilakukan lewat QC

Temuan nyata yang ditemukan pemeriksaan ini dan sudah diperbaiki:

1. **Kotak pengganti foto tidak punya tinggi.** Selama foto belum ada, ikon
   penggantinya menempel di atas kartu, bukan di tengah — karena kotaknya tidak
   diberi `absolute inset-0`.
2. **Nama berkas foto peka huruf besar-kecil.** `UTAMA.JPG` dari kamera HP terbaca
   di Windows tapi tidak akan terbaca di server tempat web ini nanti berjalan.
   Sekarang pencocokan mengabaikan besar-kecil huruf.
3. **Empat pasangan warna kurang kontras.** Teks penjelasan hanya 3.70:1 (butuh
   4.5:1), label kuning 4.45:1, dan ikon pengganti foto 2.51:1. Warna
   `tanah-500`, `panen-700`, dan `desa-400` digelapkan sampai semuanya lolos.
4. **Heading melompat h1 → h3** di halaman kategori dan halaman daftar UMKM.
   Ditambahkan h2 tersembunyi yang tetap terbaca pembaca layar.
5. **Judul halaman terlalu panjang** (74 dan 78 huruf) di dua halaman UMKM,
   karena imbuhan nama situs. Halaman detail kini memakai judul tanpa imbuhan.
6. **Meta description beranda 169 huruf**, terpotong di hasil pencarian.
   Dipendekkan jadi 147.
7. **`tsc` gagal setelah folder `.next` dihapus** karena tipe rute Next belum
   dibuat ulang. `cek:tipe` sekarang menjalankan `next typegen` lebih dulu.
8. **Berkas JSON dengan penanda BOM** (akibat disimpan lewat Notepad) bikin web
   gagal membaca data. Sekarang penandanya dibuang otomatis, dan `umkm:cek`
   memberi peringatan supaya berkasnya disimpan ulang dengan benar.

Temuan dari putaran perombakan desain:

9. **Pelat diregangkan sampai sama tinggi** dalam satu baris grid, sehingga
   papan di kolom kanan punya bidang kosong besar dan dinding papan terbaca
   seperti kisi cetak. Grid diberi `items-start` dan pelat induk diberi
   `row-span-2`.
10. **Nama usaha terpotong di penanda peta** ("KONVEKSI BERKAH JA…"). Penanda
    kini boleh melebar dan turun ke baris kedua.
11. **Dua error lint `react-hooks/set-state-in-effect`** dari pola "tandai
    sudah terpasang" di komponen jam. Diganti `useSyncExternalStore` lewat
    `lib/gunakanJam.ts`, yang sekaligus menghapus render beruntun tiap menit.
12. **442 peringatan lint dari kode pihak ketiga** — JS bawaan skill impeccable
    di `.claude/`, `.agents/`, dan `.cursor/` ikut diperiksa. Ketiganya
    dimasukkan ke daftar abaikan di `eslint.config.mjs`.

Temuan dari putaran perombakan kedua (Registri Bidang):

13. **Garis pemisah cuma 1.83:1** terhadap lembar putih, jauh di bawah ambang
    3:1. Di dunia ini garis adalah struktur, jadi ini bukan hiasan yang boleh
    pudar. Warna `garis` digelapkan dari `#b9c0ca` ke `#878d96`.
14. **Nomor bidang terpotong jadi tiga baris** di patok peta karena kotaknya
    membungkus teks. Ditambah `white-space: nowrap`.
15. **Warna lama tertinggal di gambar preview.** `app/opengraph-image.tsx` masih
    memakai `#b9c0ca` sesudah paletnya berubah — ketahuan oleh detektor desain,
    bukan oleh mata.
16. **Dua ukuran huruf dan satu bayangan di luar sistem** pada kendali peta.
    Disesuaikan ke tangga huruf dan bayangan yang terdokumentasi.
