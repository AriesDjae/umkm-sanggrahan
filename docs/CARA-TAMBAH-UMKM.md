# Cara Menambah UMKM Baru

Panduan ini untuk Anda yang mengelola web Usaha Warga Sanggrahan. Tidak perlu bisa
memprogram — cukup ikuti langkah di bawah.

---

## Cara tercepat: pakai wizard

Buka terminal di folder proyek, lalu ketik:

```
npm run umkm:baru
```

Program akan bertanya satu per satu: nama usaha, pemilik, RW, kategori, jam
buka, titik lokasi, produk, harga, nomor WhatsApp. Cukup jawab dan tekan Enter.

Setelah selesai, program otomatis membuat:

- berkas data di `data/umkm/nama-usaha.json`
- folder foto di `public/img/umkm/nama-usaha/`

Yang tersisa: **masukkan fotonya** (lihat bagian berikutnya).

> Kolom bertanda `*` wajib diisi. Yang lain boleh dilewati dengan menekan Enter,
> dan bisa dilengkapi belakangan.

---

## Memasukkan foto

Setiap UMKM punya satu folder foto sendiri di `public/img/umkm/<nama-usaha>/`.
Salin foto ke folder itu dengan aturan penamaan berikut:

| Nama berkas | Untuk apa |
|---|---|
| `utama.jpg` | Foto usaha — tampil paling besar di halaman |
| `1.jpg` | Foto produk **pertama** (urutannya sama dengan urutan di data) |
| `2.jpg` | Foto produk **kedua** |
| `3.jpg` | dan seterusnya |

Boleh juga `.png` atau `.webp`, dan huruf besar-kecil tidak masalah
(`UTAMA.JPG` tetap terbaca). **Tidak perlu mengedit berkas JSON** — foto
terbaca otomatis dari nama berkasnya.

Kalau foto belum ada, barisnya tetap tampil utuh: nama usahanya diset besar dan
setara dengan yang sudah berfoto. Itu memang bagian dari desainnya, jadi usaha
tanpa foto tidak terlihat seperti kesalahan. Tetap saja, foto membuat orang
lebih tertarik.

### Tips foto pakai HP

- Ambil siang hari di dekat jendela — cahaya alami paling bagus, jangan pakai lampu kilat.
- Latar belakang polos: meja kayu, kain putih, atau tembok.
- Produk memenuhi bingkai, jangan terlalu jauh.
- Foto mendatar (landscape) untuk `utama.jpg` supaya pas dengan bentuk kotaknya.
- Kalau ukuran berkas di atas 2 MB, kecilkan dulu. Foto terlalu besar bikin web
  lambat dibuka, dan `npm run umkm:cek` akan memperingatkan Anda.

---

## Memeriksa data sebelum ditayangkan

```
npm run umkm:cek
```

Perintah ini memeriksa seluruh data dan melaporkan dua jenis temuan:

- **HARUS DIPERBAIKI** (merah) — kesalahan yang bikin data salah tampil, misalnya
  nomor WhatsApp salah format, kategori tidak dikenal, atau koordinat tertukar.
- **SEBAIKNYA DILENGKAPI** (kuning) — bukan kesalahan, tapi sebaiknya diisi,
  misalnya foto yang belum ada, jam buka yang belum terstruktur, atau deskripsi
  yang terlalu pendek.

Jalankan ini setiap kali selesai menambah atau mengubah data.

---

## Melihat hasilnya

```
npm run dev
```

Lalu buka <http://localhost:3000> di browser. Setiap perubahan data langsung
terlihat tanpa perlu menjalankan ulang.

Tekan `Ctrl + C` di terminal untuk berhenti.

---

## Cara manual (tanpa wizard)

Kalau lebih suka mengetik langsung:

1. Salin `data/umkm/_TEMPLATE.json`.
2. Ganti namanya jadi nama usaha, **huruf kecil semua dan pakai tanda hubung**.
   Contoh: `sate-pak-udin.json`. Nama berkas ini menentukan alamat halamannya
   menjadi `/umkm/sate-pak-udin`.
3. Isi datanya, simpan.
4. Buat folder foto `public/img/umkm/sate-pak-udin/` lalu masukkan fotonya.
5. Jalankan `npm run umkm:cek`.

### Arti tiap kolom

| Kolom | Wajib | Keterangan |
|---|---|---|
| `nomor` | sebaiknya | Nomor bidang di registri, misalnya `"SGR-01-003"`. Diisi otomatis oleh wizard |
| `nama` | ya | Nama usaha seperti yang dikenal orang |
| `pemilik` | ya | Nama pemilik, dipakai juga di pesan WhatsApp otomatis |
| `rw` | ya | Angka tanpa tanda kutip: `1` atau `3` |
| `rt` | tidak | Ditulis sebagai teks, misalnya `"02"` |
| `kategori` | ya | Harus persis sama dengan salah satu nama di `data/kategori.json` |
| `deskripsi` | ya | 2–3 kalimat. Ini yang dibaca Google, jangan terlalu pendek |
| `alamat` | ya | Alamat usaha |
| `maps` | tidak | Tautan Google Maps. Kosongkan kalau belum ada |
| `koordinat` | sebaiknya | Titik lokasi di peta. Lihat penjelasan di bawah |
| `jam` | sebaiknya | Jam buka terstruktur. Lihat penjelasan di bawah |
| `jamBuka` | tidak | Keterangan jam bebas, cadangan kalau `jam` belum diisi |
| `whatsapp` | ya | Format `628xxxxxxxxxx`, tanpa `+`, spasi, atau tanda hubung |
| `marketplace` | tidak | Tautan Shopee / Tokopedia / TikTok Shop / GoFood |
| `sosmed` | tidak | Tautan Instagram dan Facebook |
| `foto` | tidak | Biarkan kosong — foto dibaca otomatis dari folder |
| `produk` | ya | Daftar produk. Minimal satu |
| `unggulan` | tidak | `true` = ikut tampil lebih dulu di petikan lembar beranda |
| `aktif` | tidak | `false` = sembunyikan dari web tanpa menghapus datanya |

Untuk `produk`, kolom `harga` diisi angka tanpa titik (`12000`, bukan
`"12.000"`). Kalau harganya tidak menentu, isi `null` — di web akan tampil
"Hubungi penjual".

### Kolom `nomor`

```json
"nomor": "SGR-01-003"
```

Nomor bidang di registri: `SGR` (Sanggrahan) - `01` (nomor RW) - `003`
(urutan pencatatan di RW itu). Wizard mengisinya otomatis dengan nomor bebas
berikutnya, dan **nomor itu tidak boleh diubah lagi** — itulah yang membuatnya
tetap sama meski registri bertambah.

Kalau kolom ini dikosongkan, web tetap memberi nomor sementara, tapi nomornya
bisa bergeser begitu ada usaha baru. `npm run umkm:cek` akan mengingatkan.

### Kolom `jam`

```json
"jam": { "buka": "08:00", "tutup": "17:00", "hari": [1, 2, 3, 4, 5, 6] }
```

Angka hari: **0 = Minggu, 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis,
5 = Jumat, 6 = Sabtu.** Contoh di atas berarti Senin sampai Sabtu. Buka setiap
hari ditulis `[0, 1, 2, 3, 4, 5, 6]`.

Kolom inilah yang membuat tanda **BUKA** atau **TUTUP** muncul di papan usaha,
dan yang membuat saringan "Buka sekarang" bekerja. Jam yang melewati tengah
malam (misalnya `"buka": "17:00"`, `"tutup": "01:00"`) sudah dihitung benar.

Perhitungannya selalu memakai waktu Yogyakarta (WIB), berapa pun zona waktu
perangkat pengunjung.

### Kolom `koordinat`

```json
"koordinat": { "lat": -7.8009, "lng": 110.3806 }
```

Cara mengambilnya: buka Google Maps, tekan lama di titik lokasi usahanya, lalu
salin dua angka yang muncul di bawah layar. Angka pertama `lat`, kedua `lng`.

Usaha tanpa koordinat tetap tampil di daftar dan punya halamannya sendiri, tapi
belum muncul di halaman peta. Pemeriksa data akan mengingatkan kalau lat dan
lng tertukar.

---

## Menyembunyikan atau menghapus UMKM

- **Sembunyikan sementara** (misal usaha sedang libur panjang): ubah
  `"aktif": true` menjadi `"aktif": false`. Data tetap tersimpan.
- **Hapus permanen** (misal pemilik minta datanya dicabut): hapus berkas
  `data/umkm/<nama>.json` beserta folder fotonya.

---

## Menambah kategori baru

Buka `data/kategori.json`, salin salah satu blok, lalu isi:

```json
{
  "slug": "otomotif",
  "nama": "Otomotif",
  "kode": "O",
  "ikon": "kunci",
  "arsir": "arsir-silang",
  "deskripsi": "Bengkel, cuci motor, dan penjualan sparepart."
}
```

- `slug` jadi alamat halaman (`/kategori/otomotif`), harus huruf kecil dan
  pakai tanda hubung.
- `kode` satu huruf kapital yang **belum dipakai kategori lain**. Inilah yang
  dicetak di kotak kode pada tiap baris registri dan pada patok peta.
- `arsir` memilih pola arsiran dari `app/globals.css`. Yang tersedia:
  `arsir-miring-rapat`, `arsir-silang`, `arsir-tegak`, `arsir-titik`,
  `arsir-miring-renggang`, `arsir-penuh`. Pilih yang **belum dipakai**, supaya
  tiap kategori tetap bisa dibedakan tanpa warna sama sekali.
- `ikon` memilih gambar dari `components/Ikon.tsx`. Yang tersedia sekarang:
  `mangkuk`, `anyaman`, `gunting`, `daun`, `kunci`, `toko`. Kalau butuh ikon
  baru, gambarnya harus ditambahkan dulu di berkas itu — **jangan pakai emoji**.

Registri ini sengaja tidak memakai warna per kategori. Kalau arsiran dan kode
huruf sudah habis, itu tanda kategorinya terlalu banyak — bukan tanda perlu
menambah warna.

Setelah itu nilai `nama` bisa dipakai di kolom `kategori` data UMKM.

---
## Menerbitkan perubahan ke internet

Setelah data ditambah dan sudah dicek, perubahan perlu dikirim agar tampil di
web publik:

```
git add .
git commit -m "Tambah UMKM: Sate Pak Udin"
git push
```

Vercel otomatis membangun ulang web dalam 1–2 menit. Setelah itu halaman baru
sudah bisa dibuka siapa saja.

> Bagian ini baru berlaku setelah proyek dihubungkan ke GitHub dan Vercel.
