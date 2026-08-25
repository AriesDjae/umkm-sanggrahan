#!/usr/bin/env node
/**
 * Pemeriksa kontras warna (WCAG 2.1).
 * Jalankan:  npm run cek:kontras
 *
 * Memastikan teks di web ini tetap terbaca, termasuk oleh pengunjung
 * yang penglihatannya kurang tajam atau yang membuka web di bawah sinar matahari.
 *
 * Ambang batas WCAG AA:
 *   - teks biasa      : minimal 4.5
 *   - teks besar/tebal: minimal 3.0
 */
import fs from "node:fs";
import path from "node:path";

const css = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");

/** Ambil semua --color-xxx: #rrggbb dari blok @theme. */
const PALET = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]),
);
PALET["putih"] = "#ffffff";

function keRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminansi(hex) {
  const [r, g, b] = keRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rasio(depan, belakang) {
  const a = luminansi(depan);
  const b = luminansi(belakang);
  const [terang, gelap] = a > b ? [a, b] : [b, a];
  return (terang + 0.05) / (gelap + 0.05);
}

/** Pasangan warna yang benar-benar dipakai di halaman. */
const PASANGAN = [
  // Teks di atas lembar
  ["Teks isi di latar halaman", "tinta", "lembar", 4.5],
  ["Teks isi di lembar putih", "tinta", "putih", 4.5],
  ["Teks penjelasan di latar halaman", "tinta-lembut", "lembar", 4.5],
  ["Teks penjelasan di lembar putih", "tinta-lembut", "putih", 4.5],
  ["Label kolom di baris berselang", "tinta-lembut", "lembar-alt", 4.5],

  // Warna resmi
  ["Tautan resmi di lembar putih", "resmi", "putih", 4.5],
  ["Tautan resmi di latar halaman", "resmi", "lembar", 4.5],
  ["Kunci kategori aktif", "resmi", "resmi-muda", 4.5],
  ["Teks di pita saring", "resmi", "resmi-muda", 4.5],
  ["Tombol resmi", "putih", "resmi", 4.5],
  ["Menu aktif di kepala halaman", "putih", "resmi", 4.5],

  // Keadaan buka dan tutup
  ["Tanda BUKA di lembar putih", "buka", "putih", 4.5],
  ["Tanda BUKA di latar halaman", "buka", "lembar", 4.5],
  ["Tanda TUTUP di lembar putih", "tutup", "putih", 4.5],
  ["Tanda TUTUP di latar halaman", "tutup", "lembar", 4.5],
  ["Tombol saring buka", "putih", "buka", 4.5],

  // Stempel dan pesan galat
  ["Stempel diperiksa di lembar putih", "stempel", "putih", 4.5],
  ["Stempel di kotak peringatan", "stempel", "lembar-alt", 4.5],

  // Garis dan arsiran: bukan teks, ambangnya 3.0 (WCAG 1.4.11)
  ["Garis baris di lembar putih", "garis", "putih", 3.0],
  ["Garis baris di latar halaman", "garis", "lembar", 3.0],
  ["Garis tegas di lembar putih", "garis-tegas", "putih", 3.0],
  ["Arsiran kategori di petaknya", "garis-tegas", "lembar-alt", 3.0],
  ["Kotak kode kategori", "tinta", "putih", 3.0],
];

const c = {
  merah: (t) => `\x1b[31m${t}\x1b[0m`,
  kuning: (t) => `\x1b[33m${t}\x1b[0m`,
  hijau: (t) => `\x1b[32m${t}\x1b[0m`,
  tebal: (t) => `\x1b[1m${t}\x1b[0m`,
  redup: (t) => `\x1b[2m${t}\x1b[0m`,
};

console.log(`\n${c.tebal("Pemeriksaan kontras warna (WCAG AA)")}\n`);

let gagal = 0;
const lebar = Math.max(...PASANGAN.map((p) => p[0].length));

for (const [nama, depan, belakang, ambang] of PASANGAN) {
  const hexDepan = PALET[depan];
  const hexBelakang = PALET[belakang];

  if (!hexDepan || !hexBelakang) {
    console.log(c.merah(`  ? ${nama} — warna ${!hexDepan ? depan : belakang} tidak ada di palet`));
    gagal++;
    continue;
  }

  const r = rasio(hexDepan, hexBelakang);
  const lolos = r >= ambang;
  if (!lolos) gagal++;

  const tanda = lolos ? c.hijau("✓") : c.merah("✗");
  const angka = `${r.toFixed(2)}:1`;
  console.log(
    `  ${tanda} ${nama.padEnd(lebar)}  ${lolos ? angka : c.merah(angka)}` +
      c.redup(`  (min ${ambang.toFixed(1)})  ${depan} di atas ${belakang}`),
  );
}

console.log("");
if (gagal === 0) {
  console.log(c.hijau(`✓ Semua ${PASANGAN.length} pasangan warna lolos WCAG AA.\n`));
} else {
  console.log(c.merah(`✗ ${gagal} dari ${PASANGAN.length} pasangan warna kurang kontras.\n`));
}

process.exit(gagal > 0 ? 1 : 0);
