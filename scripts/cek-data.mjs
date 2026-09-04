#!/usr/bin/env node
/**
 * Pemeriksa isi registri.
 * Jalankan:  npm run umkm:cek
 *
 * Menemukan kesalahan sebelum situs dipublikasikan: kolom kosong, nomor
 * WhatsApp salah format, koordinat tertukar, tautan tanpa https, dan
 * sebagainya.
 *
 * Sejak isi registri pindah ke basis data, pemeriksa ini membaca basis data,
 * bukan lagi berkas JSON di data/umkm/. Berkas-berkas itu kini hanya bahan
 * seed; yang menentukan tampilan situs adalah apa yang tersimpan di sini.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const c = {
  merah: (t) => `\x1b[31m${t}\x1b[0m`,
  kuning: (t) => `\x1b[33m${t}\x1b[0m`,
  hijau: (t) => `\x1b[32m${t}\x1b[0m`,
  tebal: (t) => `\x1b[1m${t}\x1b[0m`,
  redup: (t) => `\x1b[2m${t}\x1b[0m`,
};

const salah = [];
const ingat = [];
const catat = (daftar, bidang, pesan) => daftar.push({ bidang, pesan });

const tautanSah = (url) => /^https?:\/\//.test(url);

async function main() {
  const daftar = await db.umkm.findMany({
    include: { kategori: true, produk: { orderBy: [{ urutan: "asc" }, { id: "asc" }] } },
    orderBy: { nomor: "asc" },
  });

  if (daftar.length === 0) {
    console.log(
      c.kuning(
        'Basis data belum berisi satu pun bidang usaha. Jalankan "npm run db:seed" untuk memasukkan data dari data/umkm/.',
      ),
    );
    return 0;
  }

  const nomorWa = new Map();
  let jumlahProduk = 0;

  for (const d of daftar) {
    const label = `${d.nomor} · ${d.nama}`;

    // --- Nomor bidang ---
    if (!/^SGR-\d{2}-\d{3}$/.test(d.nomor)) {
      catat(salah, label, `Nomor bidang salah format. Contoh yang benar: SGR-01-003`);
    }

    // --- Slug ---
    if (!/^[a-z0-9-]+$/.test(d.slug)) {
      catat(
        salah,
        label,
        `Slug "${d.slug}" harus huruf kecil, angka, dan tanda hubung saja`,
      );
    }

    // --- Kolom wajib ---
    // Tanpa ini lembar bidangnya tidak bisa berdiri sama sekali.
    for (const [kolom, isi] of [
      ["nama", d.nama],
      ["deskripsi", d.deskripsi],
      ["alamat", d.alamat],
    ]) {
      if (!String(isi ?? "").trim()) catat(salah, label, `Kolom "${kolom}" masih kosong`);
    }

    // --- Kolom yang boleh menyusul ---
    // Pendataan kampung datang bertahap: banyak bidang lebih dulu terdaftar dari
    // papan peta kampung, baru kemudian disambangi untuk dilengkapi. Situs sudah
    // tahu cara menampilkan bidang seperti itu, jadi ini catatan, bukan kesalahan.
    if (!d.pemilik.trim()) catat(ingat, label, `Belum ada nama pemilik`);
    if (!d.whatsapp.trim()) {
      catat(ingat, label, `Belum ada nomor WhatsApp, jadi tombol pesan belum muncul`);
    }

    // --- WhatsApp ---
    if (d.whatsapp) {
      if (!/^628\d{7,13}$/.test(d.whatsapp)) {
        catat(
          salah,
          label,
          `Nomor WhatsApp "${d.whatsapp}" salah format. Harus diawali 628, contoh: 6281234567890`,
        );
      } else if (/^62811000000\d$/.test(d.whatsapp)) {
        catat(salah, label, `Nomor WhatsApp masih nomor contoh bawaan — ganti dengan yang asli`);
      } else {
        const sebelumnya = nomorWa.get(d.whatsapp);
        if (sebelumnya) {
          catat(ingat, label, `Nomor WhatsApp sama dengan ${sebelumnya} — pastikan disengaja`);
        } else {
          nomorWa.set(d.whatsapp, label);
        }
      }
    }

    // --- Deskripsi ---
    const panjang = d.deskripsi.trim().length;
    if (panjang > 0 && panjang < 60) {
      catat(
        ingat,
        label,
        `Deskripsi cuma ${panjang} huruf — terlalu pendek untuk muncul baik di Google (usahakan 100+)`,
      );
    }

    // --- Produk ---
    if (d.produk.length === 0) {
      catat(ingat, label, `Belum ada satu pun produk atau layanan`);
    } else {
      jumlahProduk += d.produk.length;
      d.produk.forEach((p, i) => {
        const ke = `produk ke-${i + 1}`;
        if (!p.nama.trim()) catat(salah, label, `${ke} belum ada namanya`);
        if (p.harga !== null && p.harga <= 0) {
          catat(salah, label, `${ke} ("${p.nama}") harganya ${p.harga} — tidak masuk akal`);
        }
        if (!p.foto) catat(ingat, label, `${ke} ("${p.nama}") belum punya foto`);
      });
    }

    // --- Foto usaha ---
    if (!d.foto) catat(ingat, label, `Belum ada foto usaha`);

    // --- Jam buka terstruktur ---
    const adaJam = d.jamMulai && d.jamSelesai && d.hari.length > 0;
    if (!adaJam) {
      catat(ingat, label, `Jam buka belum lengkap, jadi tanda BUKA/TUTUP tidak muncul`);
    } else {
      const pola = /^([01]?[0-9]|2[0-3])[:.][0-5][0-9]$/;
      if (!pola.test(d.jamMulai) || !pola.test(d.jamSelesai)) {
        catat(
          salah,
          label,
          `Jam harus format 24 jam seperti "08:00" — sekarang "${d.jamMulai}" dan "${d.jamSelesai}"`,
        );
      }
      if (d.hari.some((h) => !Number.isInteger(h) || h < 0 || h > 6)) {
        catat(salah, label, `Hari buka cuma boleh angka 0 sampai 6 (0 = Minggu)`);
      }
    }

    // --- Titik lokasi ---
    if (d.lat === null || d.lng === null) {
      catat(ingat, label, `Belum ada titik lokasi, jadi belum muncul di halaman peta`);
    } else if (d.lat < -11 || d.lat > 6 || d.lng < 95 || d.lng > 141) {
      catat(
        salah,
        label,
        `Koordinat ${d.lat}, ${d.lng} berada di luar Indonesia — kemungkinan lat dan lng tertukar`,
      );
    } else if (!d.sumberTitik) {
      catat(ingat, label, `Titik lokasinya belum diberi keterangan asalnya (GPS/OSM/banner)`);
    }

    // --- Tautan ---
    for (const [nama, url] of [
      ["maps", d.maps],
      ["shopee", d.shopee],
      ["tokopedia", d.tokopedia],
      ["tiktok", d.tiktok],
      ["gofood", d.gofood],
      ["grabfood", d.grabfood],
      ["lainnya", d.lainnya],
      ["instagram", d.instagram],
      ["facebook", d.facebook],
    ]) {
      if (url && !tautanSah(url)) {
        catat(salah, label, `Tautan ${nama} harus diawali http:// atau https:// — sekarang: "${url}"`);
      }
    }

    if (!d.aktif) catat(ingat, label, `Disembunyikan dari situs publik`);
  }

  // ---------- Laporan ----------
  console.log(`\n${c.tebal("Pemeriksaan isi registri")}`);
  console.log(c.redup(`${daftar.length} bidang · ${jumlahProduk} produk\n`));

  const tampilkan = (judul, daftar, warna) => {
    if (daftar.length === 0) return;
    console.log(warna(c.tebal(`${judul} (${daftar.length})`)));
    let terakhir = "";
    for (const { bidang, pesan } of daftar) {
      if (bidang !== terakhir) {
        console.log(`\n  ${c.tebal(bidang)}`);
        terakhir = bidang;
      }
      console.log(`    ${warna("•")} ${pesan}`);
    }
    console.log("");
  };

  tampilkan("HARUS DIPERBAIKI", salah, c.merah);
  tampilkan("SEBAIKNYA DILENGKAPI", ingat, c.kuning);

  if (salah.length === 0 && ingat.length === 0) {
    console.log(c.hijau("✓ Semua data sudah rapi. Siap dipublikasikan.\n"));
  } else if (salah.length === 0) {
    console.log(
      c.hijau("✓ Tidak ada kesalahan fatal.") +
        c.redup(` ${ingat.length} hal masih bisa dilengkapi.\n`),
    );
  }

  return salah.length > 0 ? 1 : 0;
}

main()
  .then((kode) => {
    process.exitCode = kode;
  })
  .catch((e) => {
    console.error(c.merah(`Gagal membaca basis data: ${e.message}`));
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
