#!/usr/bin/env node
/**
 * Penangkap layar untuk pemeriksaan desain.
 * Jalankan:  node scripts/tangkap-layar.mjs [alamat]
 *
 * Memakai Chrome yang sudah terpasang di komputer ini, jadi tidak perlu
 * mengunduh peramban terpisah. Hasilnya masuk ke .impeccable/review/.
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const ALAMAT = process.argv[2] ?? "http://localhost:3000";
const KELUARAN = path.join(process.cwd(), ".impeccable", "review");

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error("Tidak menemukan Chrome atau Edge di komputer ini.");
  process.exit(1);
}

const HALAMAN = [
  { nama: "beranda", jalur: "/" },
  { nama: "daftar-umkm", jalur: "/umkm" },
  { nama: "detail-umkm", jalur: "/umkm/keripik-bu-sri" },
  { nama: "peta", jalur: "/peta" },
  { nama: "kategori", jalur: "/kategori/kuliner" },
];

const UKURAN = [
  { nama: "desktop", width: 1440, height: 900, deviceScaleFactor: 1 },
  { nama: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
];

fs.mkdirSync(KELUARAN, { recursive: true });

const peramban = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  for (const ukuran of UKURAN) {
    for (const h of HALAMAN) {
      const tab = await peramban.newPage();
      await tab.setViewport({
        width: ukuran.width,
        height: ukuran.height,
        deviceScaleFactor: ukuran.deviceScaleFactor,
        isMobile: Boolean(ukuran.isMobile),
        hasTouch: Boolean(ukuran.isMobile),
      });

      await tab.goto(`${ALAMAT}${h.jalur}`, {
        waitUntil: "networkidle2",
        timeout: 60_000,
      });

      // Gerak masuk harus sudah selesai, kalau tidak elemennya terekam separuh.
      await tab.evaluate(() => {
        for (const el of document.querySelectorAll(".pelat-pasang")) {
          el.classList.remove("pelat-pasang");
        }
        window.scrollTo(0, 0);
      });
      await new Promise((r) => setTimeout(r, h.nama === "peta" ? 3500 : 900));

      const berkas = path.join(KELUARAN, `${ukuran.nama}-${h.nama}.png`);
      await tab.screenshot({ path: berkas, fullPage: h.nama !== "peta" });

      const ukuranKb = (fs.statSync(berkas).size / 1024).toFixed(0);
      console.log(`${path.basename(berkas)} — ${ukuranKb} KB`);

      await tab.close();
    }
  }
} finally {
  await peramban.close();
}

console.log(`\nSelesai. Hasil ada di ${KELUARAN}`);
