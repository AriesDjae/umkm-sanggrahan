# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Pengguna utama: warga Yogyakarta di sekitar Umbulharjo.** Mereka sedang mencari
kebutuhan yang bisa dipenuhi dekat rumah — makan siang, jasa jahit, servis motor,
sayur segar, laundry. Situasinya: memegang HP, butuh sekarang atau hari ini,
dan yang menentukan keputusan adalah **sedang buka atau tidak, seberapa dekat,
dan bisa langsung dihubungi atau tidak**. Bukan wisatawan dan bukan pencari
oleh-oleh; kalaupun ada, mereka bukan yang dimenangkan lebih dulu.

**Pengguna kedua: pemilik UMKM Sanggrahan.** Mereka tidak memakai situs ini,
tetapi menerima hasilnya berupa pesan WhatsApp. Sebagian tidak akrab dengan
teknologi dan hanya menyerahkan data serta foto ke pengurus.

**Pengguna ketiga: pengurus RW.** Satu-satunya orang yang memasukkan data.
Bukan pemrogram. Kemudahan menambah data adalah syarat kelangsungan proyek ini.

## Product Purpose

Membuat usaha milik warga Kampung Sanggrahan RW 1 dan RW 3 dapat ditemukan oleh
orang di luar lingkaran perkenalan pribadi mereka — lewat mesin pencari, lewat
tautan yang disebar di grup WhatsApp, dan lewat peta.

Berhasil kalau: pemilik usaha menerima pesan WhatsApp dari orang yang belum
pernah mereka kenal, dan orang itu menemukannya lewat situs ini.

## Positioning

Direktori kampung yang dikelola swadaya oleh pengurus RW, bukan lokapasar.
Tidak ada komisi, tidak ada biaya pendaftaran, tidak ada perantara: pengunjung
menekan tombol dan langsung sampai di WhatsApp pemilik usaha. Cakupannya sempit
dengan sengaja — satu kampung, dua RW — sehingga tiap usaha benar-benar
diverifikasi pengurus, sesuatu yang tidak bisa ditiru direktori berskala kota.

## Operating Context

- Hampir seluruh kunjungan lewat **HP**, sering dengan kuota seluler dan sinyal
  yang tidak selalu bagus.
- Situs sering dibuka **di luar ruangan pada siang hari** — layar silau.
- Titik akhir setiap alur adalah **WhatsApp**, bukan keranjang belanja. Transaksi
  terjadi di luar situs: COD, datang langsung, atau transfer.
- Wilayah: Kampung Sanggrahan, Kelurahan Semaki, Kemantren Umbulharjo,
  Kota Yogyakarta. Semaki dan Umbulharjo hadir sebagai **konteks wilayah**
  di peta, bukan sebagai cakupan pendataan.
- Penambahan data terjadi **berkala dan manual** oleh satu orang pengurus,
  lewat wizard baris perintah, lalu diterbitkan ulang.

## Capabilities and Constraints

**Yang bisa:** daftar UMKM dengan pencarian dan penyaring, halaman detail per
usaha, halaman per kategori, tombol WhatsApp dengan pesan siap kirim, tautan ke
lokapasar milik UMKM, peta lokasi, sitemap dan data terstruktur untuk mesin pencari.

**Yang tidak:** tidak ada keranjang belanja, pembayaran, akun pengguna, ulasan,
maupun basis data. Situs seluruhnya statis.

**Kendala teknis yang mengikat:**
- Next.js 16 App Router, React 19, Tailwind v4, seluruh halaman dibangun statis.
- Data berupa satu berkas JSON per UMKM di `data/umkm/`; tidak ada backend.
- Foto berasal dari HP warga — kualitas, orientasi, dan ukurannya tidak seragam,
  dan **banyak UMKM akan tayang tanpa foto sama sekali** untuk waktu yang lama.
- Ditayangkan di Vercel paket gratis.

**Belum diputuskan:** nama domain, dan apakah setiap UMKM akan didaftarkan ke
Google Bisnisku.

## Brand Commitments

- Nama program: **Usaha Warga Sanggrahan**.
- **Logo dan warna resmi kelurahan bersifat mengikat**, tetapi berkasnya belum
  diterima. Identitas visual harus dibangun dengan slot logo yang siap diisi dan
  palet yang bisa disetel ulang mengikuti warna resmi begitu berkasnya ada.
  **Jangan menciptakan logo kelurahan.**
- Bahasa: Indonesia. Nada bicara: hormat, lugas, tanpa jargon pemasaran. Pengurus
  berbicara kepada tetangga, bukan pemasar kepada pasar.

## Evidence on Hand

- 5 berkas data UMKM **contoh** di `data/umkm/` — nama, harga, dan nomor
  WhatsApp seluruhnya karangan. Bukan usaha nyata dan tidak boleh diperlakukan
  sebagai bukti.
- **Belum ada satu pun foto asli.** Tidak ada foto usaha, produk, maupun kampung.
- **Belum ada koordinat asli** untuk lokasi UMKM.
- Belum ada logo, testimoni, angka penjualan, maupun jumlah UMKM sebenarnya.
  Semua itu tidak boleh dikarang.
- Dokumen kerja yang sudah ada: `docs/PLAN.md`, `docs/CARA-TAMBAH-UMKM.md`,
  `docs/QC.md`.

## Product Principles

1. **Pertanyaan pertama pengunjung adalah "buka nggak sekarang, dan jauh nggak".**
   Status buka dan jarak lebih penting daripada foto besar dan slogan.
2. **Setiap layar berakhir di WhatsApp.** Tidak ada langkah antara yang tidak
   mendekatkan pengunjung ke percakapan dengan pemilik usaha.
3. **Ketiadaan foto adalah keadaan normal, bukan kasus tepi.** Tampilan harus
   tetap layak dan tidak memalukan ketika sebagian besar usaha belum berfoto.
4. **Kalau pengurus tidak sanggup merawatnya, situs ini mati.** Setiap penambahan
   fitur harus lolos uji: apakah ini menambah pekerjaan pengurus?
5. **Sempit dengan sengaja.** Satu kampung, dua RW, terverifikasi. Jangan
   melebarkan cakupan demi terlihat lebih besar.

## Accessibility & Inclusion

- Standar yang dipakai: **WCAG 2.1 AA**, sudah diukur otomatis lewat
  `npm run cek:kontras` dan `npm run cek:halaman`.
- Dibaca di luar ruangan pada siang hari, sehingga kontras rendah bukan pilihan
  gaya melainkan kegagalan.
- Sebagian pengguna berusia lanjut: ukuran teks dan sasaran sentuh harus longgar.
- Sebagian pengguna berkuota terbatas: berat halaman adalah masalah aksesibilitas,
  bukan sekadar performa.
