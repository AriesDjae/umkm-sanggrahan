#!/usr/bin/env node
/**
 * Pemeriksa mutu halaman hasil build.
 * Jalankan:  npm run cek:halaman   (harus sesudah "npm run build")
 *
 * Memeriksa hal-hal yang menentukan halaman mudah dibaca mesin pencari
 * dan bisa dipakai pengunjung yang memakai pembaca layar:
 * judul, deskripsi, susunan heading, teks alternatif gambar, dan keamanan tautan.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), ".next", "server", "app");

const c = {
  merah: (t) => `\x1b[31m${t}\x1b[0m`,
  kuning: (t) => `\x1b[33m${t}\x1b[0m`,
  hijau: (t) => `\x1b[32m${t}\x1b[0m`,
  tebal: (t) => `\x1b[1m${t}\x1b[0m`,
  redup: (t) => `\x1b[2m${t}\x1b[0m`,
};

if (!fs.existsSync(DIR)) {
  console.error(
    c.merah('Hasil build belum ada. Jalankan "npm run build" dulu, baru "npm run cek:halaman".'),
  );
  process.exit(1);
}

/** Kumpulkan semua .html hasil prerender, kecuali halaman galat internal Next. */
function kumpulkanHtml(dir) {
  const hasil = [];
  for (const entri of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entri.name);
    if (entri.isDirectory()) hasil.push(...kumpulkanHtml(p));
    else if (entri.name.endsWith(".html") && !entri.name.startsWith("_")) hasil.push(p);
  }
  return hasil;
}

/** Buang isi <script> dan <style> supaya regex tidak salah menangkap data RSC. */
function badanBersih(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}

function ambilAtribut(tag, nama) {
  const m = tag.match(new RegExp(`${nama}="([^"]*)"`, "i"));
  return m ? m[1] : null;
}

function teksPolos(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const salah = [];
const ingat = [];
const catat = (daftar, halaman, pesan) => daftar.push({ halaman, pesan });

const berkas = kumpulkanHtml(DIR);
let jumlahGambar = 0;
let jumlahTautan = 0;

for (const b of berkas) {
  const halaman =
    "/" +
    path
      .relative(DIR, b)
      .replace(/\\/g, "/")
      .replace(/\.html$/, "")
      .replace(/^index$/, "");

  const mentah = fs.readFileSync(b, "utf8");
  const badan = badanBersih(mentah);

  // --- Bahasa halaman ---
  const html = mentah.match(/<html[^>]*>/i)?.[0] ?? "";
  if (ambilAtribut(html, "lang") !== "id") {
    catat(salah, halaman, `Atribut lang pada <html> bukan "id" — mesin pencari salah menebak bahasa`);
  }

  // --- Judul ---
  const judul = mentah.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!judul) {
    catat(salah, halaman, `Tidak punya <title>`);
  } else if (judul.length > 65) {
    catat(ingat, halaman, `Judul ${judul.length} huruf — Google memotong di sekitar 60`);
  }

  // --- Deskripsi ---
  const metaDesk = mentah.match(/<meta name="description" content="([^"]*)"/i)?.[1];
  if (!metaDesk) {
    catat(salah, halaman, `Tidak punya meta description`);
  } else {
    const n = metaDesk.length;
    if (n < 70) catat(ingat, halaman, `Deskripsi cuma ${n} huruf — sebaiknya 70–160`);
    if (n > 165) catat(ingat, halaman, `Deskripsi ${n} huruf — akan terpotong di hasil pencarian`);
  }

  // --- Open Graph (tampilan saat tautan dibagikan) ---
  for (const properti of ["og:title", "og:description"]) {
    if (!new RegExp(`property="${properti}"`, "i").test(mentah)) {
      catat(ingat, halaman, `Tidak punya ${properti} — pratinjau saat dishare jadi seadanya`);
    }
  }

  // --- Susunan heading ---
  const heading = [...badan.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    tingkat: Number(m[1]),
    teks: teksPolos(m[2]),
  }));

  const jumlahH1 = heading.filter((h) => h.tingkat === 1).length;
  if (jumlahH1 === 0) catat(salah, halaman, `Tidak punya <h1>`);
  if (jumlahH1 > 1) catat(salah, halaman, `Punya ${jumlahH1} buah <h1> — seharusnya tepat satu`);

  let sebelumnya = 0;
  for (const h of heading) {
    if (sebelumnya && h.tingkat > sebelumnya + 1) {
      catat(
        ingat,
        halaman,
        `Lompatan heading h${sebelumnya} → h${h.tingkat} pada "${h.teks.slice(0, 40)}"`,
      );
    }
    if (!h.teks) catat(salah, halaman, `Ada heading h${h.tingkat} yang kosong`);
    sebelumnya = h.tingkat;
  }

  // --- Gambar ---
  for (const tag of badan.match(/<img[^>]*>/gi) ?? []) {
    jumlahGambar++;
    const alt = ambilAtribut(tag, "alt");
    if (alt === null) catat(salah, halaman, `Ada <img> tanpa atribut alt`);
    else if (alt.trim() === "") catat(ingat, halaman, `Ada <img> dengan alt kosong`);
  }

  // --- Tautan ---
  for (const m of badan.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    jumlahTautan++;
    const atribut = m[1];
    const isi = teksPolos(m[2]);
    const href = ambilAtribut(`<a ${atribut}>`, "href");
    const label = ambilAtribut(`<a ${atribut}>`, "aria-label");

    if (!href) {
      catat(salah, halaman, `Ada tautan tanpa href`);
    } else if (href === "#" || href.trim() === "") {
      catat(salah, halaman, `Ada tautan dengan href kosong`);
    }
    if (!isi && !label) {
      catat(salah, halaman, `Ada tautan tanpa teks maupun aria-label (href: ${href})`);
    }
    if (/target="_blank"/i.test(atribut) && !/rel="[^"]*noopener/i.test(atribut)) {
      catat(salah, halaman, `Tautan ke jendela baru tanpa rel="noopener" (href: ${href})`);
    }
  }

  // --- Tombol ---
  for (const m of badan.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const isi = teksPolos(m[2]);
    const label = ambilAtribut(`<button ${m[1]}>`, "aria-label");
    if (!isi && !label) catat(salah, halaman, `Ada tombol tanpa teks maupun aria-label`);
  }
}

// ---------- Laporan ----------
console.log(`\n${c.tebal("Pemeriksaan mutu halaman")}`);
console.log(c.redup(`${berkas.length} halaman · ${jumlahGambar} gambar · ${jumlahTautan} tautan\n`));

const tampilkan = (judul, daftar, warna) => {
  if (daftar.length === 0) return;
  console.log(warna(c.tebal(`${judul} (${daftar.length})`)));
  let terakhir = "";
  for (const { halaman, pesan } of daftar) {
    if (halaman !== terakhir) {
      console.log(`\n  ${c.tebal(halaman || "/")}`);
      terakhir = halaman;
    }
    console.log(`    ${warna("•")} ${pesan}`);
  }
  console.log("");
};

tampilkan("HARUS DIPERBAIKI", salah, c.merah);
tampilkan("SEBAIKNYA DIPERBAIKI", ingat, c.kuning);

if (salah.length === 0 && ingat.length === 0) {
  console.log(c.hijau(`✓ Semua ${berkas.length} halaman lolos pemeriksaan.\n`));
} else if (salah.length === 0) {
  console.log(c.hijau("✓ Tidak ada kesalahan fatal pada halaman.\n"));
} else {
  console.log(c.merah(`✗ Ada ${salah.length} masalah halaman yang harus diperbaiki.\n`));
}

process.exit(salah.length > 0 ? 1 : 0);
