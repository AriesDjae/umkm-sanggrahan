#!/usr/bin/env node
/**
 * Ubah lembar kerja banner jadi berkas data UMKM.
 * Jalankan:  npm run umkm:dari-banner
 *
 * Membaca data/umkm/_dari-banner.json — hasil pembacaan banner Tourist RoadMap
 * RW 01 dan RW 03 — lalu membuatkan data/umkm/<slug>.json untuk setiap usaha
 * yang datanya sudah lengkap. Yang belum lengkap dilaporkan beserta kolom apa
 * saja yang masih kurang, jadi skrip ini sekaligus jadi penanda kemajuan
 * pendataan.
 *
 * Berkas yang sudah pernah dibuat tidak ditimpa, supaya data yang sudah
 * disunting tangan tidak hilang. Pakai --timpa kalau memang ingin menimpanya.
 */
import fs from "node:fs";
import path from "node:path";

const AKAR = process.cwd();
const DIR_DATA = path.join(AKAR, "data", "umkm");
const DIR_FOTO = path.join(AKAR, "public", "img", "umkm");
const LEMBAR = path.join(DIR_DATA, "_dari-banner.json");

const TIMPA = process.argv.includes("--timpa");

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

function buatSlug(teks) {
  return teks
    .toLowerCase()
    // Apostrof dibuang, bukan diubah jadi tanda hubung, supaya
    // "Pak Warto's" jadi "pak-wartos" dan bukan "pak-warto-s".
    .replace(/['’`]/g, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ubah "0812-3456-7890" atau "+62812…" jadi format 628xxxxxxxx. */
function rapikanWa(nomor) {
  let n = String(nomor).replace(/\D/g, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  else if (n.startsWith("8")) n = "62" + n;
  return n;
}

const waSahih = (n) => /^628\d{7,13}$/.test(n);

/** Nomor bidang yang sudah dipakai berkas data, supaya tidak bentrok. */
function nomorTerpakai() {
  const dipakai = new Set();
  if (!fs.existsSync(DIR_DATA)) return dipakai;

  for (const f of fs.readdirSync(DIR_DATA)) {
    if (!f.endsWith(".json") || f.startsWith("_")) continue;
    try {
      const d = JSON.parse(fs.readFileSync(path.join(DIR_DATA, f), "utf8"));
      if (d.nomor) dipakai.add(d.nomor);
    } catch {
      // Berkas rusak diabaikan di sini; cek-data.mjs yang melaporkannya.
    }
  }
  return dipakai;
}

/** Nomor bidang yang sudah tertulis di berkas yang akan ditimpa, kalau ada. */
function nomorBerkasLama(berkas) {
  if (!fs.existsSync(berkas)) return "";
  try {
    return JSON.parse(fs.readFileSync(berkas, "utf8")).nomor ?? "";
  } catch {
    return "";
  }
}

function nomorBerikutnya(rw, dipakai) {
  const kodeRw = String(rw).padStart(2, "0");
  for (let i = 1; i < 1000; i++) {
    const calon = `SGR-${kodeRw}-${String(i).padStart(3, "0")}`;
    if (!dipakai.has(calon)) return calon;
  }
  return `SGR-${kodeRw}-999`;
}

/**
 * Kolom yang benar-benar menghalangi sebuah entri jadi berkas data.
 *
 * Sengaja sedikit: pendataan kampung datang bertahap, jadi nama, kategori,
 * dan RW sudah cukup untuk membuat lembar bidangnya berdiri. Pemilik, nomor
 * WhatsApp, produk, dan titik peta menyusul — situs sudah tahu cara menampilkan
 * bidang yang datanya belum lengkap.
 */
function kolomWajibKurang(u) {
  const kurang = [];

  if (!u.nama?.trim()) kurang.push("nama");
  if (!u.deskripsi?.trim()) kurang.push("deskripsi");
  if (u.rw !== 1 && u.rw !== 3) kurang.push("rw (harus 1 atau 3)");
  if (!NAMA_KATEGORI.includes(u.kategori)) {
    kurang.push(`kategori (pilih: ${NAMA_KATEGORI.join(", ")})`);
  }
  if (u.whatsapp?.trim() && !waSahih(rapikanWa(u.whatsapp))) {
    kurang.push("whatsapp (format salah)");
  }

  return kurang;
}

/** Kolom yang belum terisi tapi tidak menghalangi — dilaporkan sebagai sisa pekerjaan. */
function kolomMenyusul(u) {
  const sisa = [];
  if (!u.pemilik?.trim()) sisa.push("pemilik");
  if (!u.whatsapp?.trim()) sisa.push("whatsapp");
  const produk = Array.isArray(u.produk) ? u.produk.filter((p) => p?.nama?.trim()) : [];
  if (produk.length === 0) sisa.push("produk");
  if (!u.koordinat) sisa.push("koordinat");
  return sisa;
}

/** Susun bentuk akhir sesuai skema di lib/types.ts. */
function susunData(u, nomor) {
  const rt = u.rt?.trim() ?? "";
  // RW tidak ikut ditulis di alamat: tampilan daftar sudah mencetak kolom RW
  // sendiri, jadi "RW 01, Sanggrahan · RW 1" cuma mengulang dirinya.
  const alamat = u.alamat?.trim() || (rt ? `RT ${rt}, Sanggrahan` : "Sanggrahan");

  return {
    nomor,
    nama: u.nama.trim(),
    pemilik: u.pemilik?.trim() ?? "",
    rw: u.rw,
    rt,
    kategori: u.kategori,
    deskripsi: u.deskripsi.trim(),
    alamat,
    maps: u.maps?.trim() ?? "",
    koordinat: u.koordinat ?? undefined,
    sumberTitik: u.koordinat ? (u.sumberTitik ?? "perkiraan-banner") : undefined,
    jam: u.jam ?? undefined,
    whatsapp: u.whatsapp?.trim() ? rapikanWa(u.whatsapp) : "",
    marketplace: u.marketplace ?? { shopee: "", tokopedia: "", tiktok: "", gofood: "" },
    sosmed: u.sosmed ?? { instagram: "", facebook: "" },
    foto: "",
    produk: (Array.isArray(u.produk) ? u.produk : [])
      .filter((p) => p?.nama?.trim())
      .map((p) => ({
        nama: p.nama.trim(),
        harga: typeof p.harga === "number" && p.harga > 0 ? p.harga : null,
        satuan: p.satuan ?? "pcs",
        foto: p.foto ?? "",
        keterangan: p.keterangan ?? "",
      })),
    unggulan: u.unggulan === true,
    aktif: true,
  };
}

// ---------- Jalan ----------

if (!fs.existsSync(LEMBAR)) {
  console.error(c.merah(`\nLembar kerja tidak ditemukan: data/umkm/_dari-banner.json\n`));
  process.exit(1);
}

let lembar;
try {
  lembar = JSON.parse(fs.readFileSync(LEMBAR, "utf8").replace(/^﻿/, ""));
} catch (e) {
  console.error(c.merah(`\n_dari-banner.json bukan JSON yang sah — ${e.message}\n`));
  process.exit(1);
}

const usaha = Array.isArray(lembar.usaha) ? lembar.usaha : [];
if (usaha.length === 0) {
  console.error(c.merah(`\n_dari-banner.json tidak berisi daftar "usaha".\n`));
  process.exit(1);
}

const dipakai = nomorTerpakai();
const dibuat = [];
const dilewati = [];
const belumLengkap = [];

for (const u of usaha) {
  const penanda = u.pin ?? u.namaBanner ?? "(tanpa penanda)";

  const kurang = kolomWajibKurang(u);
  if (kurang.length > 0) {
    belumLengkap.push({ penanda, nama: u.namaBanner || "—", kurang });
    continue;
  }

  const slug = buatSlug(u.nama);
  const berkas = path.join(DIR_DATA, `${slug}.json`);

  if (fs.existsSync(berkas) && !TIMPA) {
    dilewati.push({ penanda, slug });
    continue;
  }

  // Nomor bidang tidak boleh bergeser saat berkasnya ditimpa ulang — itu nomor
  // registri yang sudah beredar. Urutan cari: yang ditulis di lembar kerja,
  // lalu yang sudah ada di berkas lamanya, baru nomor bebas berikutnya.
  const nomor =
    u.nomor?.trim() || nomorBerkasLama(berkas) || nomorBerikutnya(u.rw, dipakai);
  dipakai.add(nomor);

  fs.mkdirSync(DIR_DATA, { recursive: true });
  fs.writeFileSync(berkas, JSON.stringify(susunData(u, nomor), null, 2) + "\n", "utf8");
  const folderFoto = path.join(DIR_FOTO, slug);
  fs.mkdirSync(folderFoto, { recursive: true });
  const petunjukFoto = path.join(folderFoto, "TARUH-FOTO-DI-SINI.txt");
  if (!fs.existsSync(petunjukFoto)) {
    fs.writeFileSync(
      petunjukFoto,
      "Taruh foto usaha ini di folder ini:\n" +
        "  utama.jpg  -> foto usaha\n" +
        "  1.jpg      -> foto produk pertama\n" +
        "  2.jpg      -> foto produk kedua\n" +
        "  dst.\n",
      "utf8",
    );
  }

  dibuat.push({ penanda, slug, nomor, nama: u.nama.trim(), menyusul: kolomMenyusul(u) });
}

// ---------- Laporan ----------
console.log(`\n${c.tebal("Lembar banner → berkas data")}`);
console.log(c.redup(`${usaha.length} usaha di lembar kerja\n`));

if (dibuat.length > 0) {
  console.log(c.hijau(c.tebal(`DIBUAT (${dibuat.length})`)));
  for (const d of dibuat) {
    const sisa = d.menyusul.length ? c.redup(`  · menyusul: ${d.menyusul.join(", ")}`) : "";
    console.log(`  ${c.hijau("•")} ${d.nomor}  ${c.tebal(d.nama)}${sisa}`);
  }
  console.log("");
}

if (dilewati.length > 0) {
  console.log(c.kuning(c.tebal(`DILEWATI — berkasnya sudah ada (${dilewati.length})`)));
  for (const d of dilewati) {
    console.log(`  ${c.kuning("•")} ${d.penanda} → data/umkm/${d.slug}.json`);
  }
  console.log(c.redup(`  Pakai "npm run umkm:dari-banner -- --timpa" kalau memang mau ditimpa.\n`));
}

if (belumLengkap.length > 0) {
  console.log(c.kuning(c.tebal(`BELUM LENGKAP (${belumLengkap.length})`)));
  for (const d of belumLengkap) {
    console.log(`\n  ${c.tebal(d.penanda)} ${c.redup(d.nama)}`);
    console.log(`    ${c.kuning("kurang:")} ${d.kurang.join(", ")}`);
  }
  console.log("");
}

const hitungSisa = (kolom) => dibuat.filter((d) => d.menyusul.includes(kolom)).length;

if (belumLengkap.length === 0 && dibuat.length > 0) {
  console.log(c.hijau("✓ Semua entri di lembar kerja sudah jadi berkas data.\n"));
} else if (belumLengkap.length > 0) {
  console.log(
    c.redup(
      `Lengkapi kolom yang kurang di data/umkm/_dari-banner.json, lalu jalankan skrip ini lagi.\n`,
    ),
  );
}

if (dibuat.length > 0) {
  const sisa = [
    ["pemilik", "belum ada nama pemilik"],
    ["whatsapp", "belum ada nomor WhatsApp, jadi tombol pesan belum aktif"],
    ["produk", "belum ada daftar produk"],
    ["koordinat", "belum ada titik peta, jadi belum muncul di /peta"],
  ]
    .map(([kolom, teks]) => [hitungSisa(kolom), teks])
    .filter(([n]) => n > 0);

  if (sisa.length > 0) {
    console.log(c.tebal("Sisa pendataan:"));
    for (const [n, teks] of sisa) console.log(c.redup(`  ${n} usaha ${teks}`));
    console.log("");
  }
}

if (dibuat.length > 0) {
  console.log(`${c.tebal("Lalu:")}`);
  console.log(`  1. ${c.tebal("npm run umkm:cek")}  → periksa datanya sudah benar`);
  console.log(`  2. ${c.tebal("npm run dev")}       → lihat hasilnya di browser\n`);
}
