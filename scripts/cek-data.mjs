#!/usr/bin/env node
/**
 * Pemeriksa data UMKM.
 * Jalankan:  npm run umkm:cek
 *
 * Menemukan kesalahan sebelum web dipublikasikan: kolom kosong,
 * nomor WhatsApp salah format, kategori tidak dikenal, foto belum ada, dan sebagainya.
 */
import fs from "node:fs";
import path from "node:path";

const AKAR = process.cwd();
const DIR_DATA = path.join(AKAR, "data", "umkm");
const DIR_FOTO = path.join(AKAR, "public", "img", "umkm");
const EKSTENSI = [".jpg", ".jpeg", ".png", ".webp"];

const KATEGORI = JSON.parse(
  fs.readFileSync(path.join(AKAR, "data", "kategori.json"), "utf8"),
);
const NAMA_KATEGORI = KATEGORI.map((k) => k.nama);

const c = {
  merah: (t) => `\x1b[31m${t}\x1b[0m`,
  kuning: (t) => `\x1b[33m${t}\x1b[0m`,
  hijau: (t) => `\x1b[32m${t}\x1b[0m`,
  tebal: (t) => `\x1b[1m${t}\x1b[0m`,
  redup: (t) => `\x1b[2m${t}\x1b[0m`,
};

const salah = [];
const ingat = [];
const catat = (daftar, berkas, pesan) => daftar.push({ berkas, pesan });

/**
 * Cari foto <nama>.<ext> di folder foto sebuah UMKM.
 * Besar-kecil huruf diabaikan, sama seperti pembaca data di lib/umkm.ts.
 */
function cariFoto(slug, namaBerkas) {
  const folder = path.join(DIR_FOTO, slug);
  if (!fs.existsSync(folder)) return null;
  const dicari = EKSTENSI.map((e) => (namaBerkas + e).toLowerCase());
  const ada = fs.readdirSync(folder).find((f) => dicari.includes(f.toLowerCase()));
  return ada ? path.join(folder, ada) : null;
}

function adaFoto(slug, namaBerkas) {
  return cariFoto(slug, namaBerkas) !== null;
}

/** Kembalikan ukuran dalam MB kalau foto lebih besar dari 2 MB, selain itu 0. */
function ukuranFotoBesar(slug, namaBerkas) {
  const f = cariFoto(slug, namaBerkas);
  if (!f) return 0;
  const mb = fs.statSync(f).size / (1024 * 1024);
  return mb > 2 ? mb : 0;
}

function tautanSah(url) {
  return /^https?:\/\//.test(url);
}

if (!fs.existsSync(DIR_DATA)) {
  console.error(c.merah(`Folder data/umkm tidak ditemukan.`));
  process.exit(1);
}

const berkasSemua = fs
  .readdirSync(DIR_DATA)
  .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

if (berkasSemua.length === 0) {
  console.log(c.kuning("Belum ada data UMKM sama sekali di data/umkm/."));
  process.exit(0);
}

const nomorTerpakai = new Map();
const bidangTerpakai = new Map();
let jumlahProduk = 0;
let tanpaFoto = 0;

for (const f of berkasSemua) {
  const slug = f.replace(/\.json$/, "");
  const isiMentah = fs.readFileSync(path.join(DIR_DATA, f), "utf8");

  if (isiMentah.charCodeAt(0) === 0xfeff) {
    catat(
      ingat,
      f,
      `Berkas punya penanda BOM di awal (biasanya karena disimpan lewat Notepad). Web tetap bisa membacanya, tapi sebaiknya simpan ulang sebagai UTF-8 biasa`,
    );
  }

  let d;
  try {
    d = JSON.parse(isiMentah.replace(/^\uFEFF/, ""));
  } catch (e) {
    catat(salah, f, `Bukan JSON yang sah — ${e.message}`);
    continue;
  }

  // --- Nama berkas ---
  if (!/^[a-z0-9-]+$/.test(slug)) {
    catat(
      salah,
      f,
      `Nama berkas harus huruf kecil, angka, dan tanda hubung saja (contoh: keripik-bu-sri.json)`,
    );
  }

  // --- Nomor bidang ---
  if (!d.nomor) {
    catat(
      ingat,
      f,
      `Belum punya nomor bidang. Web akan memberi nomor sementara, tapi nomornya bisa bergeser kalau ada usaha baru — sebaiknya tulis tetap di berkas ini`,
    );
  } else if (!/^SGR-\d{2}-\d{3}$/.test(d.nomor)) {
    catat(salah, f, `Nomor bidang "${d.nomor}" salah format. Contoh yang benar: SGR-01-003`);
  } else {
    const sebelumnya = bidangTerpakai.get(d.nomor);
    if (sebelumnya) {
      catat(salah, f, `Nomor bidang ${d.nomor} sudah dipakai ${sebelumnya}`);
    } else {
      bidangTerpakai.set(d.nomor, f);
    }
  }

  // --- Kolom wajib ---
  for (const kolom of ["nama", "pemilik", "kategori", "deskripsi", "alamat", "whatsapp"]) {
    if (!d[kolom] || String(d[kolom]).trim() === "") {
      catat(salah, f, `Kolom "${kolom}" masih kosong`);
    }
  }

  if (d.rw === undefined || d.rw === null || d.rw === "") {
    catat(salah, f, `Kolom "rw" masih kosong`);
  } else if (typeof d.rw !== "number") {
    catat(salah, f, `Kolom "rw" harus berupa angka tanpa tanda kutip (contoh: 1, bukan "1")`);
  }

  // --- Kategori ---
  if (d.kategori && !NAMA_KATEGORI.includes(d.kategori)) {
    catat(
      salah,
      f,
      `Kategori "${d.kategori}" tidak dikenal. Pilih salah satu: ${NAMA_KATEGORI.join(", ")}`,
    );
  }

  // --- WhatsApp ---
  if (d.whatsapp) {
    const wa = String(d.whatsapp).replace(/\D/g, "");
    if (!/^628\d{7,13}$/.test(wa)) {
      catat(
        salah,
        f,
        `Nomor WhatsApp "${d.whatsapp}" salah format. Harus diawali 628, contoh: 6281234567890`,
      );
    } else if (/^62811000000\d$/.test(wa)) {
      catat(salah, f, `Nomor WhatsApp masih nomor contoh bawaan — ganti dengan nomor asli`);
    } else {
      const sebelumnya = nomorTerpakai.get(wa);
      if (sebelumnya) {
        catat(ingat, f, `Nomor WhatsApp sama dengan ${sebelumnya} — pastikan memang disengaja`);
      } else {
        nomorTerpakai.set(wa, f);
      }
    }
  }

  // --- Deskripsi ---
  if (d.deskripsi && d.deskripsi.trim().length < 60) {
    catat(
      ingat,
      f,
      `Deskripsi cuma ${d.deskripsi.trim().length} huruf — terlalu pendek untuk muncul baik di Google (usahakan 100+)`,
    );
  }

  // --- Produk ---
  if (!Array.isArray(d.produk) || d.produk.length === 0) {
    catat(salah, f, `Belum ada satu pun produk atau layanan`);
  } else {
    jumlahProduk += d.produk.length;
    d.produk.forEach((p, i) => {
      const ke = `produk ke-${i + 1}`;
      if (!p.nama || String(p.nama).trim() === "") {
        catat(salah, f, `${ke} belum ada namanya`);
      }
      if (p.harga !== null && p.harga !== undefined && typeof p.harga !== "number") {
        catat(
          salah,
          f,
          `${ke} ("${p.nama}") harganya harus angka tanpa titik/kutip, atau null kalau tidak menentu`,
        );
      }
      if (typeof p.harga === "number" && p.harga <= 0) {
        catat(salah, f, `${ke} ("${p.nama}") harganya ${p.harga} — tidak masuk akal`);
      }
      if (!p.foto && !adaFoto(slug, String(i + 1))) {
        catat(ingat, f, `${ke} ("${p.nama}") belum punya foto (taruh ${i + 1}.jpg di folder fotonya)`);
      }
      const besar = ukuranFotoBesar(slug, String(i + 1));
      if (besar) {
        catat(ingat, f, `Foto ${i + 1} berukuran ${besar.toFixed(1)} MB — sebaiknya dikecilkan dulu`);
      }
    });
  }

  // --- Foto usaha ---
  if (!d.foto && !adaFoto(slug, "utama")) {
    tanpaFoto++;
    catat(
      ingat,
      f,
      `Belum ada foto usaha (taruh utama.jpg di public/img/umkm/${slug}/)`,
    );
  }
  const besarUtama = ukuranFotoBesar(slug, "utama");
  if (besarUtama) {
    catat(ingat, f, `utama.jpg berukuran ${besarUtama.toFixed(1)} MB — sebaiknya dikecilkan dulu`);
  }
  if (d.foto && !fs.existsSync(path.join(AKAR, "public", d.foto.replace(/^\//, "")))) {
    catat(salah, f, `Kolom foto menunjuk ke "${d.foto}" tapi berkasnya tidak ada`);
  }


  // --- Jam buka terstruktur ---
  if (!d.jam) {
    catat(
      ingat,
      f,
      `Belum ada jam buka terstruktur, jadi tanda BUKA/TUTUP tidak muncul di situs`,
    );
  } else {
    const pola = /^([01]?[0-9]|2[0-3])[:.][0-5][0-9]$/;
    if (!pola.test(String(d.jam.buka)) || !pola.test(String(d.jam.tutup))) {
      catat(
        salah,
        f,
        `Jam buka/tutup harus format 24 jam seperti "08:00" — sekarang "${d.jam.buka}" dan "${d.jam.tutup}"`,
      );
    }
    if (!Array.isArray(d.jam.hari) || d.jam.hari.length === 0) {
      catat(salah, f, `Kolom jam.hari harus berisi angka hari, misalnya [1,2,3,4,5,6]`);
    } else if (d.jam.hari.some((h) => !Number.isInteger(h) || h < 0 || h > 6)) {
      catat(salah, f, `Kolom jam.hari cuma boleh angka 0 sampai 6 (0 = Minggu)`);
    }
  }

  // --- Titik lokasi ---
  if (!d.koordinat) {
    catat(ingat, f, `Belum ada titik lokasi, jadi usaha ini belum muncul di halaman peta`);
  } else {
    const { lat, lng } = d.koordinat;
    if (typeof lat !== "number" || typeof lng !== "number") {
      catat(salah, f, `Koordinat harus dua angka, contoh { "lat": -7.8009, "lng": 110.3806 }`);
    } else if (lat < -11 || lat > 6 || lng < 95 || lng > 141) {
      catat(
        salah,
        f,
        `Koordinat ${lat}, ${lng} berada di luar Indonesia — kemungkinan lat dan lng tertukar`,
      );
    }
  }

  // --- Tautan ---
  for (const [label, url] of [
    ["maps", d.maps],
    ...Object.entries(d.marketplace ?? {}),
    ...Object.entries(d.sosmed ?? {}),
  ]) {
    if (url && !tautanSah(url)) {
      catat(salah, f, `Tautan ${label} harus diawali http:// atau https:// — sekarang: "${url}"`);
    }
  }

  if (d.aktif === false) {
    catat(ingat, f, `Ditandai aktif: false — tidak akan tampil di web`);
  }
}

// ---------- Laporan ----------
console.log(`\n${c.tebal("Pemeriksaan data UMKM")}`);
console.log(c.redup(`${berkasSemua.length} usaha · ${jumlahProduk} produk\n`));

const tampilkan = (judul, daftar, warna) => {
  if (daftar.length === 0) return;
  console.log(warna(c.tebal(`${judul} (${daftar.length})`)));
  let berkasTerakhir = "";
  for (const { berkas, pesan } of daftar) {
    if (berkas !== berkasTerakhir) {
      console.log(`\n  ${c.tebal(berkas)}`);
      berkasTerakhir = berkas;
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
      c.redup(" Web tetap bisa dipublikasikan, tapi sebaiknya lengkapi catatan kuning di atas.\n"),
  );
} else {
  console.log(
    c.merah(`✗ Ada ${salah.length} hal yang harus diperbaiki sebelum web dipublikasikan.\n`),
  );
}

if (tanpaFoto > 0) {
  console.log(
    c.redup(
      `Catatan: ${tanpaFoto} usaha belum punya foto. Halaman tanpa foto jauh lebih sedikit menarik pembeli.\n`,
    ),
  );
}

process.exit(salah.length > 0 ? 1 : 0);
