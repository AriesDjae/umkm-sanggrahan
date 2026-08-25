# UMKM Sanggrahan

Registri usaha warga **Kampung Sanggrahan, Kelurahan Semaki, Kemantren
Umbulharjo, Kota Yogyakarta** — RW 1 dan RW 3. Setiap UMKM adalah satu bidang
terdaftar bernomor: punya lembarnya sendiri yang bisa ditemukan lewat Google,
tautannya bisa disebar ke grup WhatsApp, dan letaknya bisa dilihat di peta
bidang. Pembeli menghubungi penjual langsung lewat WhatsApp: tidak ada
perantara, tidak ada komisi.

Next.js 16 (App Router), React 19, Tailwind CSS v4, Leaflet + OpenStreetMap.
Seluruh halaman dibuat statis saat build, jadi cepat dibuka dan ramah mesin
pencari.

## Perintah

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Jalankan di komputer sendiri, buka <http://localhost:3000> |
| `npm run umkm:baru` | Wizard tanya-jawab untuk menambah UMKM baru |
| `npm run umkm:cek` | Periksa seluruh data UMKM, laporkan yang salah atau kurang |
| `npm run qc` | Jalankan semua pemeriksaan mutu sekaligus |
| `npm run build` | Bangun versi produksi |

Pemeriksaan satuan: `cek:tipe` (TypeScript), `lint` (aturan Next.js),
`cek:kontras` (keterbacaan warna WCAG AA), `cek:halaman` (SEO & aksesibilitas
HTML hasil build). Penjelasannya di **[docs/QC.md](docs/QC.md)**.

Untuk melihat hasil rancangan di berbagai ukuran layar:
`node scripts/tangkap-layar.mjs` (memakai Chrome yang sudah terpasang; hasilnya
ke `.impeccable/review/`, tidak ikut masuk git).

## Menambah UMKM

Baca **[docs/CARA-TAMBAH-UMKM.md](docs/CARA-TAMBAH-UMKM.md)** — panduan lengkap
tanpa istilah teknis.

Ringkasnya: `npm run umkm:baru`, jawab pertanyaannya, lalu taruh foto di
`public/img/umkm/<nama-usaha>/` dengan nama `utama.jpg`, `1.jpg`, `2.jpg`, dst.

## Desain

Dunia visualnya **Registri Bidang** — lembar putih dingin, garis 1.5px yang
tegas, kop bergaris ganda, satu biru resmi. Dua keputusan menanggung seluruh
sistemnya: kategori dibedakan oleh kode huruf dan arsiran (bukan warna), dan
keadaan buka/tutup dibedakan oleh bentuk petak (bukan warna). Akibatnya seluruh
isinya tetap terbaca oleh pengunjung yang sulit membedakan warna maupun yang
membaca di bawah matahari, dan usaha tanpa foto tetap tampil setara.

Aturan sistemnya tercatat di **[DESIGN.md](DESIGN.md)**. Kebenaran produk —
siapa penggunanya, apa batasannya, apa yang tidak boleh dikarang — di
**[PRODUCT.md](PRODUCT.md)**.

## Struktur folder

```
app/                     Halaman web
  page.tsx                 Beranda — kop registri dan petikan lembar
  umkm/                    Daftar UMKM & halaman detail tiap usaha
  peta/                    Peta bidang (Leaflet + OpenStreetMap)
  kategori/[kategori]/     Halaman per kategori
  tentang/  daftar/        Halaman informasi
  sitemap.ts  robots.ts    Berkas untuk mesin pencari
  opengraph-image.tsx      Gambar pratinjau saat tautan dibagikan

components/
  BarisBidang.tsx          Satu UMKM sebagai satu baris registri bernomor
  KodeBidang.tsx           Kode huruf + arsiran kategori, pengganti warna
  TandaBuka.tsx            Tanda BUKA/TUTUP; bentuk petaknya yang menanggung arti
  PetaUmkm.tsx             Peta beserta patok bidang bernomor
  Ikon.tsx                 Ikon digambar sendiri — tanpa emoji

lib/
  site.ts                  Nama situs, wilayah, kontak pengurus, slot logo
  kategori.ts              Kategori beserta kode huruf dan arsirannya
  umkm.ts                  Pembaca data UMKM dari folder data/
  jam.ts                   Perhitungan "buka sekarang" zona waktu WIB
  gunakanJam.ts            Kaitan jam peramban
  format.ts                Format rupiah, tautan WhatsApp, dll.

data/
  kategori.json            Kategori usaha + kode huruf dan arsirannya
  umkm/*.json              Satu berkas per UMKM  ← yang sering diubah
  umkm/_TEMPLATE.json      Contoh kosong untuk disalin

public/img/umkm/<slug>/  Foto tiap UMKM
scripts/                 Wizard, pemeriksa data, pemeriksa mutu, tangkap layar
docs/                    Rencana kerja, panduan pengelolaan, prosedur QC
```

## Yang perlu diganti sebelum dipublikasikan

Di `lib/site.ts`:

- `url` — alamat web sesungguhnya setelah deploy
- `kontakPengurus.whatsapp` — nomor WhatsApp pengurus yang asli
- `logo` — path logo kelurahan begitu berkasnya ada (sekarang kosong)
- `pusatPeta` — titik tengah peta, kalau perlu digeser
- `sosmed` — akun Instagram dan Facebook program, kalau sudah ada

Warna resmi kelurahan diganti di `app/globals.css` pada blok `@theme` saja —
tidak ada satu pun warna yang ditulis langsung di komponen. Yang paling mungkin
Anda ganti: `--color-resmi` beserta pasangan tua dan mudanya. Setelah
menggantinya, jalankan `npm run cek:kontras`.

Di `data/umkm/`:

- Hapus kelima berkas data contoh, ganti dengan data UMKM sungguhan.
  Nama, harga, nomor WhatsApp, koordinat, dan nomor bidangnya semua karangan.
  `npm run umkm:cek` menandai nomor WhatsApp contoh sebagai kesalahan supaya
  tidak ikut terpublikasi.
