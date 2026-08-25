---
name: Usaha Warga Sanggrahan
description: Direktori UMKM kampung yang dibangun sebagai lembar registri bidang resmi
colors:
  lembar: "#f7f8fa"
  lembar-alt: "#eceff3"
  lembar-tegas: "#e0e4ea"
  putih: "#ffffff"
  garis: "#878d96"
  garis-tegas: "#7c8593"
  tinta: "#14171c"
  tinta-lembut: "#4b5360"
  resmi: "#1b3b6f"
  resmi-tua: "#10254a"
  resmi-muda: "#e6ecf6"
  stempel: "#9b3627"
  buka: "#0f5d3a"
  tutup: "#6a727e"
typography:
  judul-besar:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.6rem + 3.6vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  judul-bidang:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.5rem + 3.4vw, 3.8rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  judul-baris:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 1.1rem + 1vw, 1.9rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.14em"
  nomor:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  kendali: "2px"
spacing:
  baris: "20px"
  lembar: "24px"
  bagian: "56px"
components:
  tombol-utama:
    backgroundColor: "{colors.resmi}"
    textColor: "{colors.putih}"
    rounded: "{rounded.kendali}"
    padding: "12px 20px"
  tombol-kedua:
    backgroundColor: "{colors.putih}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.kendali}"
    padding: "12px 20px"
  tombol-wa:
    backgroundColor: "{colors.resmi}"
    textColor: "{colors.putih}"
    rounded: "{rounded.kendali}"
    padding: "14px 24px"
  sakelar-aktif:
    backgroundColor: "{colors.resmi}"
    textColor: "{colors.putih}"
    rounded: "{rounded.kendali}"
    padding: "6px 12px"
  sakelar-diam:
    backgroundColor: "{colors.putih}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.kendali}"
    padding: "6px 12px"
  sakelar-buka:
    backgroundColor: "{colors.buka}"
    textColor: "{colors.putih}"
    rounded: "{rounded.kendali}"
    padding: "8px 12px"
  kolom-cari:
    backgroundColor: "{colors.lembar}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.kendali}"
    padding: "12px 12px 12px 44px"
  kunci-kategori-aktif:
    backgroundColor: "{colors.resmi-muda}"
    textColor: "{colors.resmi}"
    rounded: "{rounded.kendali}"
    padding: "6px 8px"
---

# Design System: Usaha Warga Sanggrahan

## Overview

**Creative North Star: "Registri Bidang"**

Direktori ini diperlakukan sebagai registri resmi, bukan etalase. Setiap usaha
adalah satu **bidang terdaftar**: punya nomor registri, batas wilayah, jam
tercatat, dan tanda periksa pengurus. Bahasa bentuknya diambil dari lembar
registri dan peta bidang, tetapi dirender sebagai sistem digital masa kini —
presisi, bersih, dan tidak sedikit pun bernuansa dokumen kertas tua.

Dua keputusan menanggung seluruh sistem ini. Pertama, **kategori tidak
dibedakan oleh warna**: kategori dibedakan oleh kode huruf dalam kotak dan
arsiran petaknya, seluruhnya dalam satu tinta. Kedua, **keadaan tidak
dibedakan oleh warna**: buka dan tutup dibedakan oleh bentuk petak — terisi,
separuh, atau bersilang. Warna hanya menguatkan, tidak pernah menanggung arti
sendirian. Akibatnya palet bisa dipangkas sampai satu biru resmi dan satu merah
stempel yang muncul sangat jarang, dan seluruh isinya tetap terbaca oleh
pengunjung yang sulit membedakan warna maupun yang membaca di bawah matahari.

Yang ditolak secara sadar: kisi kartu berfoto, bayangan lembut, sudut membulat
besar, hero bergradasi, label kecil di atas judul, emoji sebagai ikon, dan
dinding warna penuh yang dipakai versi sebelumnya.

**Key Characteristics:**
- Satu warna resmi; kategori dan keadaan dibawa oleh kode dan bentuk
- Garis 1.5px yang terukur, bukan garis rambut yang hilang di bawah matahari
- Baris registri bernomor, bukan kartu
- Nama usaha diset sampai skala poster sebagai antarmukanya sendiri
- Satu momen gerak: garis dasar baris ditarik saat lembar dibuka

## Colors

Palet sengaja pendek. Netral menanggung hampir seluruh permukaan; satu biru
resmi menandai apa pun yang bisa ditindak; satu merah stempel muncul hanya pada
tanda periksa dan peringatan.

### Primary
- **Biru Resmi** (#1b3b6f): Satu-satunya warna tindakan. Tautan, tombol utama,
  menu aktif, kunci kategori terpilih, patok peta terpilih, dan cincin fokus.
- **Biru Resmi Tua** (#10254a): Garis tepi tombol biru.
- **Biru Resmi Muda** (#e6ecf6): Bidang penanda — baris tersentuh, kunci
  kategori aktif, dan pita "registri disaring".

### Secondary
- **Merah Stempel** (#9b3627): Hanya untuk tanda periksa pengurus, label
  "GRATIS", peringatan lokasi, dan garis tepi kotak peringatan. Kalau warna ini
  muncul di lebih dari satu tempat per layar, sistemnya sedang dilanggar.

### Tertiary
- **Hijau Buka** (#0f5d3a): Menguatkan tanda buka dan sakelar saring buka.
- **Kelabu Tutup** (#6a727e): Menguatkan tanda tutup.

### Neutral
- **Lembar** (#f7f8fa): Latar halaman. Putih dingin, bukan krem.
- **Putih** (#ffffff): Bidang lembar registri, kepala halaman, kaki halaman.
- **Lembar Alt** (#eceff3): Dasar petak arsiran dan kotak peringatan.
- **Garis** (#878d96): Garis batas lembar dan garis dasar tiap baris.
- **Garis Tegas** (#7c8593): Kop bergaris ganda, arsiran, garis kotak.
- **Tinta** (#14171c): Teks utama dan kotak kode kategori.
- **Tinta Lembut** (#4b5360): Teks penjelasan dan label kolom.

### Named Rules

**The One Official Colour Rule.** Biru resmi adalah satu-satunya warna yang
menandai sesuatu bisa ditindak. Kalau sebuah elemen berwarna tapi tidak bisa
ditekan, warnanya salah.

**The Shape-Carries-Meaning Rule.** Kategori dibawa oleh kode huruf dan arsiran;
keadaan dibawa oleh bentuk petak. Warna hanya menguatkan. Setiap penanda baru
wajib tetap terbaca kalau seluruh warnanya dibuang.

**The Rare Stamp Rule.** Merah stempel muncul paling banyak sekali per layar.

**The Measured Contrast Rule.** Setiap pasangan warna teks maupun garis yang
benar dipakai wajib terdaftar di `scripts/cek-kontras.mjs` dan lolos WCAG AA —
teks 4.5:1, garis dan bentuk 3:1. Palet tidak boleh diubah tanpa menjalankan
ulang `npm run cek:kontras`.

## Typography

**Satu keluarga: Barlow** (fallback ui-sans-serif, system-ui, sans-serif).

**Character:** Barlow adalah grotesk rendah kontras yang lahir dari huruf rambu
jalan dan papan infrastruktur umum. Netral tanpa jadi hambar, modern tanpa jadi
tren, dan punya DNA lembaga — persis yang dibutuhkan sebuah registri. Satu
keluarga saja dipakai untuk seluruh situs; hierarki ditanggung ukuran, tebal,
dan jarak huruf, bukan pergantian huruf.

### Hierarchy
- **Judul Besar** (700, `clamp(2.4rem, 1.6rem + 3.6vw, 4.2rem)`, 0.98, −0.03em):
  Judul halaman. Satu per halaman.
- **Judul Bidang** (700, `clamp(2.2rem, 1.5rem + 3.4vw, 3.8rem)`, 0.98): Nama
  usaha di lembar bidang. Skala poster — inilah antarmukanya, bukan judul kartu.
- **Judul Baris** (700, `clamp(1.35rem, 1.1rem + 1vw, 1.9rem)`, 0.98): Nama
  usaha di baris registri.
- **Judul Bagian** (700, 1.25–1.5rem, 0.98): Kepala bagian dalam halaman.
- **Body** (400, 1rem, 1.65): Teks penjelasan. Lebar baris dibatasi 44–70ch
  lewat `max-width` eksplisit, tidak pernah selebar wadahnya.
- **Label** (600, 0.6875rem, tracking 0.14em, KAPITAL): Label kolom, kepala
  tabel, dan judul kunci kategori. Selalu memakai tinta lembut.
- **Nomor Bidang** (600, tracking 0.08em, tabular-nums): Nomor registri.
- **Angka** (tabular-nums): Semua harga, jam, jarak, dan hitungan.

### Named Rules

**The One Family Rule.** Tidak ada huruf kedua. Kalau sesuatu perlu dibedakan,
bedakan dengan ukuran, tebal, jarak huruf, atau kapital — bukan dengan
mendatangkan huruf baru.

**The Tabular Numbers Rule.** Setiap angka yang bisa dibandingkan memakai
`tabular-nums`. Ini dinyalakan global lewat `font-feature-settings` pada `body`
dan dipertegas oleh kelas `.angka` dan `.nomor-bidang`.

**The Label Is Not A Kicker Rule.** Label kapital kecil hanya menamai kolom,
tabel, dan daftar. Ia tidak pernah berdiri sebagai baris kecil di atas sebuah
judul.

## Layout

Wadah utama `max-width: 80rem` dengan padding tepi 1rem.

Halaman registri memakai dua kolom pada lg: **kunci kategori 15rem yang
menempel (`sticky`) dan tidak pernah ikut tergulir**, lalu lembar registri
mengisi sisanya. Di bawah lg kunci kategori jatuh ke atas sebagai baris chip.

Baris bidang memakai grid empat kolom pada sm ke atas —
`[7.5rem auto 1fr auto]`: nomor, kode kategori, isi, petak foto. Di bawah sm
kolomnya runtuh jadi dua dan isinya turun ke baris berikutnya.

### Kisi 8px

**Setiap jarak dan ukuran adalah kelipatan 8.** Tangganya: 8, 16, 24, 32, 40,
48, 56, 64, 80, 96. Tidak ada langkah setengah — 4px, 12px, dan 20px tidak
dipakai. Satu tangga yang dipatuhi membuat jarak antar unsur bisa dibandingkan
dengan mata, dan membuat nilai yang meleset langsung kelihatan alih-alih
bersembunyi sebagai "kira-kira segitu". Pada lembar yang isinya justru
garis dan kolom, ketidakrapian sebesar 2px terbaca sebagai cetakan yang miring.

Ritme yang dipakai: **16px** padding sisi baris dan kop, **24px** padding tegak
baris dan jarak antar lembar, **40px** padding tegak halaman, **56–64px** antar
bagian, **96px** sebelum kaki halaman. Jarak di atas sebuah judul selalu lebih
besar daripada di bawahnya.

Ukuran sasaran sentuh ikut kisi yang sama: tombol menu 48×48, kotak kode
kategori 32×32 (40×40 pada ukuran besar), ikon 16px atau 24px.

Yang **tidak** tunduk pada kisi, karena bukan jarak: tebal garis (1.5px, dan
3px ganda pada kop), bayangan, cincin fokus, sudut 2px, tangga ukuran huruf,
tinggi baris, jarak antar huruf, dan pola arsiran kategori. Ukuran relatif
layar (`62vh` pada peta penuh) juga di luar kisi — ia mengikuti tinggi jendela,
bukan tangga jarak.

`npm run cek:kisi` memeriksanya di seluruh `app/` dan `components/`, dan ikut
dijalankan `npm run qc`.

Halaman peta memakai `[1fr 24rem]` pada lg; petanya `62vh` dengan lantai
`26rem`, dan daftar di sampingnya bergulir sendiri dengan tinggi maksimum sama.

Beranda menaruh **profil singkat dan peta berdampingan** tepat di bawah kop,
`[23rem 1fr]` pada lg dengan `items-start` — profil sebagai blok identitas
wilayah di kiri, peta ringkas di kanan. Peta ringkas memakai komponen peta yang
sama tanpa daftar sampingnya, setinggi `22rem` (`27rem` pada sm).

## Elevation & Depth

**Sistem ini tidak memakai bayangan sama sekali.** Kedalaman ditanggung garis
dan bidang, seperti pada dokumen cetak: lembar putih berdiri di atas latar
lembar yang sedikit lebih gelap, dibatasi garis 1.5px. Kop lembar memakai garis
ganda 3px. Tidak ada bayangan lembut, tidak ada peninggian saat disentuh.

Satu-satunya pengecualian ada di dalam peta: patok bidang memakai
`0 1px 3px rgba(20,23,28,.3)` supaya terangkat dari ubin peta yang ramai. Itu
kebutuhan keterbacaan di atas media asing, bukan bahasa kedalaman sistem ini.

### Named Rules

**The No-Shadow Rule.** Jangan menambahkan bayangan pada komponen baru.
Kalau sebuah elemen perlu dipisahkan, pisahkan dengan garis atau bidang.

## Shapes

Radius 2px di seluruh sistem, untuk semuanya — lembar, tombol, kolom isian,
kotak kode, dan cincin fokus. Tidak ada radius kedua. Bentuknya persegi karena
ini dokumen.

Garis adalah bahan utamanya:
- **1.5px solid** untuk batas lembar, garis dasar baris, dan tepi kendali.
- **3px double** untuk kop lembar dan pemisah bagian besar — inilah yang memberi
  kesan dokumen resmi.
- **Enam arsiran** membedakan kategori: miring rapat, silang, tegak, titik,
  miring renggang, dan penuh.

## Components

### Baris Bidang (komponen tanda tangan)
Satu UMKM sebagai satu baris registri, bukan kartu.
- **Susunan:** nomor bidang · kode kategori + arsiran · nama besar, alamat,
  produk, harga, tanda buka · petak foto opsional 96×64
- **Batas:** garis dasar 1.5px; baris terakhir tanpa garis
- **Sentuh:** latar berubah ke biru resmi muda, tanpa perpindahan dan tanpa bayangan
- **Foto:** kecil dan di kanan, tidak pernah memimpin. Baris tanpa foto tetap setara

### Kode Bidang (komponen tanda tangan)
Penanda kategori: kotak berhuruf kode (K, R, F, T, J, L) dan petak arsirannya.
Nama kategori disembunyikan sebagai teks pembaca layar kecuali diminta tampil.

### Tanda Buka (komponen tanda tangan)
Petak SVG yang bentuknya menanggung arti: terisi = buka, separuh = segera tutup,
bersilang = tutup. Dihitung di peramban dari zona waktu Asia/Jakarta dan
diperbarui tiap menit. **Sebelum halaman terpasang, tandanya tidak menampilkan
apa pun** — situs statis tidak boleh menebak lalu meralat.

### Buttons
- **Shape:** persegi, radius 2px, selalu bergaris 1.5px
- **Utama:** biru resmi + putih, garis tepi biru resmi tua
- **Kedua:** transparan + tinta, garis tepi garis-tegas
- **WhatsApp:** memakai gaya tombol utama — tidak ada hijau WhatsApp di sistem ini
- **Sakelar aktif:** terisi biru resmi; sakelar buka terisi hijau buka
- **Sentuh:** hanya perubahan warna. Tidak ada peninggian dan tidak ada bayangan

### Inputs / Fields
- **Style:** latar lembar, garis 1.5px garis-tegas, radius 2px, ikon cari di
  dalam kolom pada offset kiri 12px
- **Focus:** cincin `3px solid biru resmi` offset 2px, berlaku global lewat
  `:focus-visible`

### Tables
Tabel harga memakai kepala berlabel kapital kecil, garis atas-bawah kepala
1.5px garis-tegas, dan garis 1.5px garis antar baris. Harga rata kanan dengan
tabular-nums.

### Navigation
Kepala halaman berlatar putih dengan garis bawah 1.5px. Menu memakai teks tebal
sedang; item aktif terisi biru resmi. Di bawah md menu runtuh jadi daftar
bergaris penuh lebar. Logo kelurahan punya slotnya sendiri; selama kosong,
tempatnya diisi kotak monogram bergaris biru resmi.

### Patok Peta (komponen tanda tangan)
Penanda di peta adalah patok bidang: kotak kode kategori dan nomor bidangnya,
bergaris 1.5px, dengan tiang pendek di bawah. Terpilih berarti terisi biru
resmi. Bukan pin bawaan Leaflet.

### Gelembung Bidang
Hanya pada peta ringkas di beranda, tempat tidak ada daftar samping yang bisa
menjelaskan patok yang ditekan. Bentuknya lembar registri yang mengecil:
bersudut 2px, bergaris 1.5px, berisi nomor dan kategori sebagai label kapital,
nama usaha sebagai judul, alamat dan rentang harga, lalu satu tautan ke lembar
bidangnya di balik garis pemisah. Pada peta penuh gelembung ini tidak dipakai —
di sana ia hanya menutupi peta.

Pemilih CSS-nya diawali `.leaflet-container` karena berkas gaya bawaan Leaflet
dimuat sesudah `globals.css`; tanpa itu sudut bulat 12px bawaannya yang menang.

## Do's and Don'ts

**Do** beri kategori baru satu huruf kode yang belum terpakai dan satu arsiran
yang belum terpakai.

**Do** pastikan setiap penanda baru masih terbaca kalau seluruh warnanya dibuang.

**Do** pakai `.angka` atau `.nomor-bidang` untuk setiap angka.

**Do** batasi lebar baris teks isi dengan `max-width` dalam satuan `ch`.

**Do** jawab pertanyaan "buka nggak sekarang" sebelum apa pun yang lain.

**Don't** menambahkan warna kategori. Enam warna penuh sudah pernah dicoba dan
ditolak karena terlalu ramai.

**Don't** menambahkan bayangan pada komponen baru.

**Don't** memakai emoji sebagai ikon. Ikon digambar di `components/Ikon.tsx`
sebagai bidang penuh 24×24.

**Don't** memakai radius selain 2px.

**Don't** mendatangkan huruf kedua.

**Don't** menaruh label kapital kecil sebagai baris di atas judul.

**Don't** menulis warna langsung di komponen. Semua warna berasal dari `@theme`
di `app/globals.css` supaya warna resmi kelurahan bisa menggantikannya dari
satu tempat.
