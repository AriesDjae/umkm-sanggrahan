#!/usr/bin/env node
/**
 * Wizard tambah UMKM.
 * Jalankan:  npm run umkm:baru
 *
 * Script ini bertanya satu per satu, lalu membuatkan file data
 * di data/umkm/<slug>.json dan folder foto di public/img/umkm/<slug>/.
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const AKAR = process.cwd();
const DIR_DATA = path.join(AKAR, "data", "umkm");
const DIR_FOTO = path.join(AKAR, "public", "img", "umkm");
const KATEGORI = JSON.parse(
  fs.readFileSync(path.join(AKAR, "data", "kategori.json"), "utf8"),
);

const warna = {
  judul: (t) => `\x1b[1m\x1b[32m${t}\x1b[0m`,
  tebal: (t) => `\x1b[1m${t}\x1b[0m`,
  redup: (t) => `\x1b[2m${t}\x1b[0m`,
  merah: (t) => `\x1b[31m${t}\x1b[0m`,
  kuning: (t) => `\x1b[33m${t}\x1b[0m`,
};

const rl = readline.createInterface({ input: stdin, output: stdout });

/** Tanya sesuatu. Kalau wajib, akan diulang sampai diisi. */
async function tanya(label, { wajib = false, bawaan = "", petunjuk = "" } = {}) {
  const sisip = bawaan ? warna.redup(` [${bawaan}]`) : "";
  const tanda = wajib ? warna.merah("*") : "";
  if (petunjuk) console.log(warna.redup("  " + petunjuk));

  while (true) {
    const jawab = (await rl.question(`${label}${tanda}${sisip}: `)).trim();
    if (jawab) return jawab;
    if (bawaan) return bawaan;
    if (!wajib) return "";
    console.log(warna.merah("  Bagian ini wajib diisi."));
  }
}

async function tanyaYaTidak(label, bawaan = false) {
  const pilihan = bawaan ? "Y/t" : "y/T";
  const jawab = (await rl.question(`${label} (${pilihan}): `)).trim().toLowerCase();
  if (!jawab) return bawaan;
  return jawab === "y" || jawab === "ya";
}

async function tanyaPilihan(label, opsi) {
  console.log(`\n${warna.tebal(label)}`);
  opsi.forEach((o, i) =>
    console.log(`  ${i + 1}. [${o.kode}] ${o.nama}`),
  );
  while (true) {
    const jawab = (await rl.question("Pilih nomor: ")).trim();
    const n = Number(jawab);
    if (Number.isInteger(n) && n >= 1 && n <= opsi.length) return opsi[n - 1];
    console.log(warna.merah(`  Masukkan angka 1 sampai ${opsi.length}.`));
  }
}

function buatSlug(teks) {
  return teks
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ubah "0812-3456-7890" atau "+62812..." jadi format 628xxxxxxxx. */
function rapikanWa(nomor) {
  let n = nomor.replace(/\D/g, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  if (n.startsWith("8")) n = "62" + n;
  return n;
}

function waSahih(nomor) {
  return /^628\d{7,13}$/.test(nomor);
}

async function tanyaWa() {
  while (true) {
    const mentah = await tanya("Nomor WhatsApp", {
      wajib: true,
      petunjuk: "Boleh ditulis 08xx… atau 62 8xx…, nanti dirapikan otomatis.",
    });
    const rapi = rapikanWa(mentah);
    if (waSahih(rapi)) {
      console.log(warna.redup(`  → disimpan sebagai ${rapi}`));
      return rapi;
    }
    console.log(warna.merah("  Nomor tidak dikenali. Contoh yang benar: 081234567890"));
  }
}

/** Jam buka terstruktur, supaya situs bisa menjawab "buka nggak sekarang". */
async function tanyaJam() {
  console.log(
    `\n${warna.tebal("Jam buka")} ${warna.redup("(dipakai untuk tanda BUKA/TUTUP di situs)")}`,
  );

  const buka = await tanya("  Jam buka", { bawaan: "08:00", petunjuk: "Format 24 jam, contoh 08:00" });
  const tutup = await tanya("  Jam tutup", { bawaan: "17:00" });

  console.log(warna.redup("  Hari buka: 0=Minggu 1=Senin 2=Selasa 3=Rabu 4=Kamis 5=Jumat 6=Sabtu"));
  const hariTeks = await tanya("  Hari buka", {
    bawaan: "1,2,3,4,5,6",
    petunjuk: "Pisahkan dengan koma. Setiap hari = 0,1,2,3,4,5,6",
  });

  const hari = [...new Set(
    hariTeks.split(/[^0-9]+/).filter(Boolean).map(Number).filter((h) => h >= 0 && h <= 6),
  )].sort((a, b) => a - b);

  return { buka, tutup, hari: hari.length ? hari : [1, 2, 3, 4, 5, 6] };
}

/** Titik lokasi untuk peta. Boleh dilewati. */
async function tanyaKoordinat() {
  const teks = await tanya("Titik lokasi (lat, lng)", {
    petunjuk: "Di Google Maps: tekan lama titiknya, lalu salin angka yang muncul. Contoh: -7.8009, 110.3806. Boleh dikosongkan.",
  });
  if (!teks) return undefined;

  const angka = teks.split(/[^0-9.-]+/).filter(Boolean).map(Number);
  if (angka.length < 2 || !Number.isFinite(angka[0]) || !Number.isFinite(angka[1])) {
    console.log(warna.kuning("  Tidak terbaca, dilewati. Bisa diisi belakangan di berkas JSON-nya."));
    return undefined;
  }
  return { lat: angka[0], lng: angka[1] };
}

async function tanyaProduk() {
  const produk = [];
  console.log(
    `\n${warna.tebal("Produk / layanan")} ${warna.redup("(minimal satu, kosongkan nama untuk berhenti)")}`,
  );

  while (true) {
    const nomor = produk.length + 1;
    console.log(warna.redup(`\n  — Produk ke-${nomor} —`));
    const nama = await tanya(`  Nama produk`, { wajib: produk.length === 0 });
    if (!nama) break;

    const hargaTeks = await tanya("  Harga (angka saja, kosongkan jika tidak menentu)");
    const harga = hargaTeks ? Number(hargaTeks.replace(/\D/g, "")) : null;
    const satuan = await tanya("  Satuan", { bawaan: "pcs" });
    const keterangan = await tanya("  Keterangan tambahan");

    produk.push({
      nama,
      harga: Number.isFinite(harga) && harga > 0 ? harga : null,
      satuan,
      foto: "",
      keterangan,
    });
    console.log(warna.redup(`  ✓ ${nama} tersimpan`));
  }

  return produk;
}

/**
 * Cari nomor bidang bebas berikutnya untuk sebuah RW, misalnya SGR-01-004.
 * Nomor ditulis ke berkas datanya supaya tidak pernah berubah lagi
 * meski daftar registri bertambah.
 */
function nomorBerikutnya(rw) {
  const dipakai = new Set();
  if (fs.existsSync(DIR_DATA)) {
    for (const f of fs.readdirSync(DIR_DATA)) {
      if (!f.endsWith('.json') || f.startsWith('_')) continue;
      try {
        const d = JSON.parse(fs.readFileSync(path.join(DIR_DATA, f), 'utf8'));
        if (d.nomor) dipakai.add(d.nomor);
      } catch {
        // berkas rusak diabaikan di sini; cek-data.mjs yang melaporkannya
      }
    }
  }

  const kodeRw = String(rw).padStart(2, '0');
  for (let i = 1; i < 1000; i++) {
    const calon = `SGR-${kodeRw}-${String(i).padStart(3, '0')}`;
    if (!dipakai.has(calon)) return calon;
  }
  return `SGR-${kodeRw}-999`;
}

async function main() {
  console.log(warna.judul("\n╭───────────────────────────────────────────╮"));
  console.log(warna.judul("│   Tambah UMKM baru — UMKM Sanggrahan      │"));
  console.log(warna.judul("╰───────────────────────────────────────────╯"));
  console.log(
    warna.redup("Isi pertanyaan berikut. Bertanda * wajib diisi. Tekan Enter untuk melewati.\n"),
  );

  const nama = await tanya("Nama usaha", { wajib: true });
  const slug = buatSlug(nama);
  const berkas = path.join(DIR_DATA, `${slug}.json`);

  if (fs.existsSync(berkas)) {
    console.log(
      warna.merah(`\nSudah ada data dengan nama file ${slug}.json.`) +
        "\nHapus atau ubah dulu file itu, lalu jalankan ulang.",
    );
    rl.close();
    process.exit(1);
  }

  const pemilik = await tanya("Nama pemilik", { wajib: true });
  const rwTeks = await tanya("RW", { wajib: true, bawaan: "1" });
  const rt = await tanya("RT", { bawaan: "" });
  const kategori = await tanyaPilihan("Kategori usaha", KATEGORI);

  console.log("");
  const deskripsi = await tanya("Deskripsi usaha", {
    wajib: true,
    petunjuk: "2-3 kalimat: apa yang dijual, keistimewaannya, sejak kapan berdiri.",
  });
  const alamat = await tanya("Alamat", {
    wajib: true,
    bawaan: rt ? `RT ${rt} RW ${rwTeks}, Sanggrahan` : `RW ${rwTeks}, Sanggrahan`,
  });
  const jam = await tanyaJam();
  const whatsapp = await tanyaWa();
  const maps = await tanya("Tautan Google Maps", {
    petunjuk: "Buka Google Maps → cari lokasi → Bagikan → Salin tautan. Boleh dikosongkan.",
  });
  const koordinat = await tanyaKoordinat();

  console.log(`\n${warna.tebal("Toko online & media sosial")} ${warna.redup("(boleh dikosongkan)")}`);
  const shopee = await tanya("  Tautan Shopee");
  const tokopedia = await tanya("  Tautan Tokopedia");
  const tiktok = await tanya("  Tautan TikTok Shop");
  const gofood = await tanya("  Tautan GoFood");
  const instagram = await tanya("  Tautan Instagram");
  const facebook = await tanya("  Tautan Facebook");

  const produk = await tanyaProduk();
  const unggulan = await tanyaYaTidak(
    `\nTampilkan usaha ini di bagian "Usaha pilihan" beranda?`,
    false,
  );

  const rwAngka = Number(rwTeks.replace(/\D/g, '')) || 1;

  const data = {
    nomor: nomorBerikutnya(rwAngka),
    nama,
    pemilik,
    rw: rwAngka,
    rt,
    kategori: kategori.nama,
    deskripsi,
    alamat,
    maps,
    koordinat,
    jam,
    whatsapp,
    marketplace: { shopee, tokopedia, tiktok, gofood },
    sosmed: { instagram, facebook },
    foto: "",
    produk,
    unggulan,
    aktif: true,
  };

  fs.mkdirSync(DIR_DATA, { recursive: true });
  fs.writeFileSync(berkas, JSON.stringify(data, null, 2) + "\n", "utf8");

  const folderFoto = path.join(DIR_FOTO, slug);
  fs.mkdirSync(folderFoto, { recursive: true });

  console.log(warna.judul("\n✓ Data tersimpan!\n"));
  console.log(`  Berkas data  : ${warna.tebal(`data/umkm/${slug}.json`)}`);
  console.log(`  Folder foto  : ${warna.tebal(`public/img/umkm/${slug}/`)}`);
  console.log(`  Alamat web   : ${warna.tebal(`/umkm/${slug}`)}`);
  console.log(`  Nomor bidang : ${warna.tebal(data.nomor)}`);

  console.log(`\n${warna.tebal("Langkah berikutnya — taruh fotonya:")}`);
  console.log(`  Salin foto ke folder ${warna.tebal(`public/img/umkm/${slug}/`)} dengan nama:`);
  console.log(`    ${warna.tebal("utama.jpg")}  → foto usaha (tampil paling besar)`);
  produk.forEach((p, i) => {
    console.log(`    ${warna.tebal(`${i + 1}.jpg`)}      → foto "${p.nama}"`);
  });
  console.log(warna.redup("  Boleh juga .png atau .webp. Foto terbaca otomatis, tanpa edit JSON."));

  console.log(`\n${warna.tebal("Lalu:")}`);
  console.log(`  1. ${warna.tebal("npm run umkm:cek")}  → periksa datanya sudah benar`);
  console.log(`  2. ${warna.tebal("npm run dev")}       → lihat hasilnya di browser`);
  console.log("");

  rl.close();
}

main().catch((e) => {
  console.error(warna.merah("\nTerjadi kesalahan:"), e.message);
  rl.close();
  process.exit(1);
});
