#!/usr/bin/env node
/**
 * Pemeriksa kisi 8px.
 *
 * Seluruh jarak dan ukuran di web ini berdiri di atas kelipatan 8: 8, 16, 24,
 * 32, 40, 48, 56, 64, dan seterusnya. Bukan karena angkanya keramat, tetapi
 * karena satu tangga yang dipatuhi membuat jarak antar unsur bisa dibandingkan
 * dengan mata — dan membuat nilai yang meleset langsung kelihatan, bukan
 * bersembunyi sebagai "kira-kira segitu".
 *
 * Yang diperiksa:
 *   1. Utilitas jarak Tailwind di app/ dan components/ (p-, mt-, gap-, h-, w-,
 *      dan kerabatnya). Tailwind memakai satuan 4px per langkah, jadi hanya
 *      langkah genap yang jatuh di kisi.
 *   2. Nilai px yang ditulis tangan di berkas .tsx dan .css.
 *
 * Yang sengaja dikecualikan, karena bukan jarak melainkan bagian lain dari
 * sistem desain — lihat bagian "Spacing" di DESIGN.md:
 *   - tebal garis 1px, 1.5px, 2px, dan 3px
 *   - bayangan, cincin fokus, sudut, dan offset garis bawah
 *   - ukuran huruf, tinggi baris, dan jarak antar huruf
 *   - arsiran kategori, yang polanya memang bukan kelipatan 8
 *   - komentar
 *
 * Di luar jangkauan pemeriksa ini: nilai jarak yang ditulis sebagai angka
 * telanjang, bukan untaian "…px" — satu-satunya tempatnya adalah
 * app/opengraph-image.tsx, yang mesin penggambarnya memang menuntut begitu.
 * Aturan kisinya tetap berlaku di sana, hanya penjagaannya dengan mata.
 */
import fs from "node:fs";
import path from "node:path";

const AKAR = process.cwd();
const PERIKSA = ["app", "components"];

const warna = {
  merah: (t) => `\x1b[31m${t}\x1b[0m`,
  hijau: (t) => `\x1b[32m${t}\x1b[0m`,
  tebal: (t) => `\x1b[1m${t}\x1b[0m`,
  redup: (t) => `\x1b[2m${t}\x1b[0m`,
};

/* ---------- kumpulkan berkas ---------- */

const berkas = [];
function jelajah(d) {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) jelajah(p);
    else if (/\.(tsx|ts|css)$/.test(e.name)) berkas.push(p);
  }
}
PERIKSA.forEach((d) => jelajah(path.join(AKAR, d)));

/* ---------- alat ---------- */

/** Kelipatan 8 terdekat; kalau jaraknya sama dibulatkan ke atas. */
function keKisi(px) {
  if (px === 0) return 0;
  if (px < 8) return 8;
  const bawah = Math.floor(px / 8) * 8;
  return px - bawah < bawah + 8 - px ? bawah : bawah + 8;
}

/**
 * Ganti bagian yang cocok dengan spasi sebanyak hurufnya, baris baru dibiarkan.
 * Panjang berkas tetap sama, jadi nomor barisnya masih bisa dihitung.
 */
function kosongkan(teks, pola, boleh = () => true) {
  return teks.replace(pola, (cocok, ...sisa) =>
    boleh(cocok, ...sisa) ? cocok.replace(/[^\n]/g, " ") : cocok,
  );
}

/** Tebal garis dan cincin — bukan jarak. */
const GARIS = new Set([1, 1.5, 2, 3]);

/** Sifat CSS yang nilainya bukan jarak. */
const BUKAN_JARAK =
  /border|shadow|outline|radius|font|line-height|letter-spacing|text-underline-offset|stroke|gradient|background|translate|blur|ring/i;

/** Utilitas Tailwind bernilai bebas yang bukan jarak: text-[11px], dll. */
const UTILITAS_BUKAN_JARAK =
  /\b(?:text|leading|tracking|shadow|border|rounded|outline|ring|blur|stroke|indent)-\[[^\]]*\]/g;

function tanpaGangguan(isi, adalahCss) {
  let s = isi;
  s = kosongkan(s, /\/\*[\s\S]*?\*\//g); // komentar blok
  s = kosongkan(s, /(?<!:)\/\/[^\n]*/g); // komentar baris, tapi bukan https://
  s = kosongkan(s, UTILITAS_BUKAN_JARAK);
  // Deklarasi yang sifatnya bukan jarak. Di CSS nilainya boleh melintasi baris
  // (arsiran kategori ditulis begitu); di TSX dibatasi satu baris.
  const deklarasi = adalahCss
    ? /([a-zA-Z-]+)\s*:\s*[^;{}]*/g
    : /([a-zA-Z-]+)\s*:\s*[^;{}\n]*/g;
  s = kosongkan(s, deklarasi, (cocok) => BUKAN_JARAK.test(cocok));
  return s;
}

function nomorBaris(teks, posisi) {
  let n = 1;
  for (let i = 0; i < posisi; i++) if (teks[i] === "\n") n++;
  return n;
}

/* ---------- pola yang dicari ---------- */

const AWALAN = [
  "p", "px", "py", "pt", "pb", "pl", "pr",
  "m", "mx", "my", "mt", "mb", "ml", "mr",
  "gap", "gap-x", "gap-y", "space-x", "space-y",
  "w", "h", "size", "min-w", "min-h", "max-w", "max-h",
  "top", "bottom", "left", "right", "inset",
];
const urutAwalan = [...AWALAN].sort((a, b) => b.length - a.length);
const polaKelas = new RegExp(
  "[\\s\"'`:\\[]-?(" + urutAwalan.join("|") + ")-(\\d+(?:\\.\\d+)?)(?=[\\s\"'`\\]]|$)",
  "g",
);
const polaPx = /(-?\d+(?:\.\d+)?)px/g;

/* ---------- jalankan ---------- */

const temuan = [];

for (const f of berkas) {
  const rel = path.relative(AKAR, f).split(path.sep).join("/");
  const asli = fs.readFileSync(f, "utf8");
  const adalahCss = f.endsWith(".css");
  const bersih = tanpaGangguan(asli, adalahCss);

  if (!adalahCss) {
    for (const m of bersih.matchAll(polaKelas)) {
      const px = Number(m[2]) * 4;
      if (px % 8 === 0) continue;
      temuan.push({
        di: `${rel}:${nomorBaris(asli, m.index)}`,
        apa: `${m[1]}-${m[2]}`,
        px,
        saran: `${m[1]}-${keKisi(px) / 4}`,
      });
    }
  }

  for (const m of bersih.matchAll(polaPx)) {
    const px = Math.abs(Number(m[1]));
    if (px === 0 || px % 8 === 0 || GARIS.has(px)) continue;
    temuan.push({
      di: `${rel}:${nomorBaris(asli, m.index)}`,
      apa: `${m[1]}px`,
      px,
      saran: `${keKisi(px)}px`,
    });
  }
}

/* ---------- laporan ---------- */

console.log(`\n${warna.tebal("Pemeriksaan kisi 8px")}`);
console.log(warna.redup(`${berkas.length} berkas diperiksa\n`));

if (temuan.length === 0) {
  console.log(warna.hijau("✓ Semua jarak dan ukuran jatuh di kelipatan 8.\n"));
  process.exit(0);
}

const kelompok = new Map();
for (const t of temuan) {
  const kunci = `${t.apa} (${t.px}px) → ${t.saran}`;
  if (!kelompok.has(kunci)) kelompok.set(kunci, []);
  kelompok.get(kunci).push(t.di);
}

for (const [kunci, tempat] of [...kelompok].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${warna.merah("•")} ${warna.tebal(kunci)}`);
  console.log(warna.redup(`      ${tempat.slice(0, 4).join(", ")}`));
  if (tempat.length > 4) {
    console.log(warna.redup(`      dan ${tempat.length - 4} tempat lain`));
  }
}

console.log(
  warna.merah(
    `\n✗ ${temuan.length} nilai di luar kisi 8px, dalam ${kelompok.size} bentuk berbeda.\n`,
  ),
);
console.log(
  warna.redup(
    "Kalau salah satunya memang disengaja dan bukan jarak, catat alasannya di\n" +
      "DESIGN.md lalu tambahkan ke daftar kecuali di scripts/cek-kisi.mjs.\n",
  ),
);
process.exit(1);
