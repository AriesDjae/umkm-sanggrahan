import fs from "node:fs";
import path from "node:path";
import { cariKategori } from "./kategori";
import type { Umkm } from "./types";

export type { Umkm, Produk } from "./types";

const DIR_DATA = path.join(process.cwd(), "data", "umkm");
const DIR_FOTO = path.join(process.cwd(), "public", "img", "umkm");
const EKSTENSI = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Cari foto di public/img/umkm/<slug>/ berdasarkan nama berkas (tanpa ekstensi).
 * Dipakai supaya cukup taruh foto di folder yang benar tanpa mengetik path di JSON.
 *
 * Pencocokan mengabaikan besar-kecil huruf: "UTAMA.JPG" dari kamera HP tetap
 * terbaca. Ini penting karena Windows tidak membedakan huruf besar-kecil
 * sedangkan server tempat web ini nanti berjalan membedakannya.
 */
function cariFoto(slug: string, namaBerkas: string): string | undefined {
  const folder = path.join(DIR_FOTO, slug);
  if (!fs.existsSync(folder)) return undefined;

  const dicari = EKSTENSI.map((e) => (namaBerkas + e).toLowerCase());
  const ada = fs.readdirSync(folder).find((f) => dicari.includes(f.toLowerCase()));
  return ada ? `/img/umkm/${slug}/${ada}` : undefined;
}

/** Baca semua file JSON di data/umkm/ — tambah file baru, otomatis muncul di web. */
function bacaSemua(): Umkm[] {
  if (!fs.existsSync(DIR_DATA)) return [];

  const berkas = fs
    .readdirSync(DIR_DATA)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  const daftar: Umkm[] = [];
  for (const f of berkas) {
    // Membuang penanda BOM yang sering ikut terselip
    // kalau berkas JSON pernah disimpan lewat Notepad.
    const isi = fs.readFileSync(path.join(DIR_DATA, f), "utf8").replace(/^\uFEFF/, "");
    let data: Umkm;
    try {
      data = JSON.parse(isi) as Umkm;
    } catch {
      throw new Error(
        `File data/umkm/${f} bukan JSON yang sah. Jalankan "npm run umkm:cek" untuk melihat detail kesalahannya.`,
      );
    }

    // Slug mengikuti nama file supaya alamat halaman selalu cocok dengan berkasnya.
    data.slug = f.replace(/\.json$/, "");
    data.produk = data.produk ?? [];
    if (data.aktif === false) continue;

    // Foto boleh ditulis manual di JSON, atau cukup ditaruh di folder fotonya:
    // utama.jpg untuk foto usaha, 1.jpg / 2.jpg / … sesuai urutan produk.
    data.foto = data.foto || cariFoto(data.slug, "utama");
    data.produk = data.produk.map((p, i) => ({
      ...p,
      foto: p.foto || cariFoto(data.slug, String(i + 1)),
    }));

    daftar.push(data);
  }

  daftar.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
  return beriNomor(daftar);
}

/**
 * Beri nomor bidang pada usaha yang belum punya, misalnya "SGR-01-003".
 * Nomor yang sudah tertulis di berkas datanya tidak pernah diubah — itulah
 * yang membuat nomor registri tetap sama meski daftarnya bertambah.
 */
function beriNomor(daftar: Umkm[]): Umkm[] {
  const terpakai = new Set(daftar.map((u) => u.nomor).filter(Boolean));

  for (const u of daftar) {
    if (u.nomor) continue;

    const rw = String(u.rw).padStart(2, "0");
    let urut = 1;
    let calon = "";
    do {
      calon = `SGR-${rw}-${String(urut).padStart(3, "0")}`;
      urut++;
    } while (terpakai.has(calon));

    u.nomor = calon;
    terpakai.add(calon);
  }

  return daftar;
}

export function semuaUmkm(): Umkm[] {
  return bacaSemua();
}

export function umkmUnggulan(batas = 6): Umkm[] {
  const semua = bacaSemua();
  const unggulan = semua.filter((u) => u.unggulan);
  return (unggulan.length ? unggulan : semua).slice(0, batas);
}

export function umkmBySlug(slug: string): Umkm | undefined {
  return bacaSemua().find((u) => u.slug === slug);
}

export function umkmByKategori(slugKategori: string): Umkm[] {
  const kat = cariKategori(slugKategori);
  if (!kat) return [];
  return bacaSemua().filter((u) => u.kategori === kat.nama);
}

export function jumlahPerKategori(): Record<string, number> {
  const hitung: Record<string, number> = {};
  for (const u of bacaSemua()) hitung[u.kategori] = (hitung[u.kategori] ?? 0) + 1;
  return hitung;
}
