/**
 * Mengisi basis data dari berkas JSON yang lama.
 *
 * Registri ini semula hidup sebagai berkas: data/kategori.json dan satu berkas
 * per bidang usaha di data/umkm/. Skrip ini memindahkannya sekali ke
 * PostgreSQL, lalu berkas-berkas itu tinggal menjadi arsip.
 *
 * Aman dijalankan berulang: setiap baris dicocokkan dengan slug-nya, jadi
 * menjalankan ulang akan memperbarui, bukan menggandakan. Yang TIDAK pernah
 * ditimpa adalah sandi akun yang sudah ada — supaya sandi yang sudah diganti
 * pengurus tidak kembali ke sandi awal hanya karena seed dijalankan lagi.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const AKAR = process.cwd();
const DIR_UMKM = path.join(AKAR, "data", "umkm");
const DIR_FOTO = path.join(AKAR, "public", "img", "umkm");
const EKSTENSI = [".jpg", ".jpeg", ".png", ".webp"];

type KategoriJson = {
  slug: string;
  nama: string;
  kode: string;
  ikon: string;
  arsir: string;
  deskripsi: string;
};

type UmkmJson = {
  nomor?: string;
  nama: string;
  pemilik?: string;
  rw: number;
  rt?: string;
  kategori: string;
  deskripsi?: string;
  alamat?: string;
  maps?: string;
  koordinat?: { lat: number; lng: number };
  sumberTitik?: string;
  jam?: { buka: string; tutup: string; hari: number[] };
  jamBuka?: string;
  whatsapp?: string;
  marketplace?: Record<string, string | undefined>;
  sosmed?: { instagram?: string; facebook?: string };
  foto?: string;
  produk?: {
    nama: string;
    harga: number | null;
    satuan?: string;
    foto?: string;
    keterangan?: string;
  }[];
  unggulan?: boolean;
  aktif?: boolean;
};

/**
 * Foto lama cukup ditaruh di public/img/umkm/<slug>/ tanpa ditulis di JSON:
 * utama.* untuk foto usaha, 1.* / 2.* sesuai urutan produk. Pencocokan
 * mengabaikan besar-kecil huruf karena Windows tidak membedakannya sedangkan
 * server tempat situs ini berjalan membedakannya.
 */
function cariFoto(slug: string, namaBerkas: string): string {
  const folder = path.join(DIR_FOTO, slug);
  if (!existsSync(folder)) return "";
  const dicari = EKSTENSI.map((e) => (namaBerkas + e).toLowerCase());
  const ada = readdirSync(folder).find((f) => dicari.includes(f.toLowerCase()));
  return ada ? `/img/umkm/${slug}/${ada}` : "";
}

function bacaJson<T>(berkas: string): T {
  // Membuang penanda BOM yang sering terselip kalau berkas JSON
  // pernah disimpan lewat Notepad.
  const isi = readFileSync(berkas, "utf8").replace(/^﻿/, "");
  return JSON.parse(isi) as T;
}

async function seedKategori(): Promise<Map<string, number>> {
  const daftar = bacaJson<KategoriJson[]>(path.join(AKAR, "data", "kategori.json"));
  const peta = new Map<string, number>();

  for (const [i, k] of daftar.entries()) {
    const isi = {
      nama: k.nama,
      kode: k.kode,
      ikon: k.ikon,
      arsir: k.arsir,
      deskripsi: k.deskripsi,
      urutan: i,
    };
    const baris = await db.kategori.upsert({
      where: { slug: k.slug },
      update: isi,
      create: { slug: k.slug, ...isi },
    });
    peta.set(baris.nama.toLowerCase(), baris.id);
    peta.set(baris.slug, baris.id);
  }

  console.log(`  kategori  : ${daftar.length}`);
  return peta;
}

/** Nomor bidang untuk berkas lama yang belum punya, mengikuti pola SGR-<rw>-<urut>. */
function pemberiNomor() {
  const terpakai = new Set<string>();
  return {
    pesan(nomor: string) {
      terpakai.add(nomor);
    },
    berikutnya(rw: number) {
      const awalan = `SGR-${String(rw).padStart(2, "0")}-`;
      let urut = 1;
      let calon = "";
      do {
        calon = `${awalan}${String(urut).padStart(3, "0")}`;
        urut++;
      } while (terpakai.has(calon));
      terpakai.add(calon);
      return calon;
    },
  };
}

async function seedUmkm(kategori: Map<string, number>) {
  if (!existsSync(DIR_UMKM)) {
    console.log("  bidang    : 0 (folder data/umkm/ tidak ada)");
    return;
  }

  const berkas = readdirSync(DIR_UMKM)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort();

  // Berkas dibaca lebih dulu supaya nomor yang sudah tertulis bisa dipesan
  // sebelum nomor baru dibagikan — nomor lama tidak boleh bergeser.
  const isi = berkas.map((f) => ({
    slug: f.replace(/\.json$/, ""),
    data: bacaJson<UmkmJson>(path.join(DIR_UMKM, f)),
  }));

  const nomor = pemberiNomor();
  for (const { data } of isi) if (data.nomor) nomor.pesan(data.nomor);

  const cadangan = kategori.get("lainnya");
  let jumlah = 0;

  for (const { slug, data } of isi) {
    const kategoriId = kategori.get((data.kategori ?? "").toLowerCase()) ?? cadangan;
    if (!kategoriId) {
      throw new Error(
        `Kategori "${data.kategori}" pada data/umkm/${slug}.json tidak dikenal, dan kategori cadangan "lainnya" tidak ada di data/kategori.json.`,
      );
    }

    const m = data.marketplace ?? {};
    const s = data.sosmed ?? {};
    const nilai = {
      nomor: data.nomor || nomor.berikutnya(data.rw),
      nama: data.nama,
      pemilik: data.pemilik ?? "",
      rw: data.rw,
      rt: data.rt ?? "",
      kategoriId,
      deskripsi: data.deskripsi ?? "",
      alamat: data.alamat ?? "",
      maps: data.maps ?? "",
      lat: data.koordinat?.lat ?? null,
      lng: data.koordinat?.lng ?? null,
      sumberTitik: data.sumberTitik ?? null,
      jamMulai: data.jam?.buka ?? null,
      jamSelesai: data.jam?.tutup ?? null,
      hari: data.jam?.hari ?? [],
      jamBuka: data.jamBuka ?? "",
      whatsapp: data.whatsapp ?? "",
      shopee: m.shopee ?? "",
      tokopedia: m.tokopedia ?? "",
      tiktok: m.tiktok ?? "",
      gofood: m.gofood ?? "",
      grabfood: m.grabfood ?? "",
      lainnya: m.lainnya ?? "",
      instagram: s.instagram ?? "",
      facebook: s.facebook ?? "",
      foto: data.foto || cariFoto(slug, "utama"),
      unggulan: data.unggulan ?? false,
      aktif: data.aktif ?? true,
    };

    const produk = (data.produk ?? []).map((p, i) => ({
      nama: p.nama,
      harga: p.harga ?? null,
      satuan: p.satuan ?? "",
      foto: p.foto || cariFoto(slug, String(i + 1)),
      keterangan: p.keterangan ?? "",
      urutan: i,
    }));

    // Produk ditulis ulang seluruhnya, bukan dicocokkan satu per satu:
    // berkas JSON tidak punya id produk, jadi tidak ada yang bisa dicocokkan.
    await db.umkm.upsert({
      where: { slug },
      update: { ...nilai, produk: { deleteMany: {}, create: produk } },
      create: { slug, ...nilai, produk: { create: produk } },
    });

    jumlah++;
  }

  console.log(`  bidang    : ${jumlah}`);
}

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@sanggrahan.id").toLowerCase();
  const sandi = process.env.SEED_ADMIN_SANDI ?? "sanggrahan123";

  const ada = await db.user.findUnique({ where: { email } });
  if (ada) {
    console.log(`  akun      : ${email} (sudah ada, sandi tidak diubah)`);
    return;
  }

  await db.user.create({
    data: {
      nama: "Administrator",
      email,
      passwordHash: await bcrypt.hash(sandi, 10),
      peran: "ADMIN",
    },
  });
  console.log(`  akun      : ${email} (baru dibuat, sandi dari SEED_ADMIN_SANDI)`);
}

async function seedPengaturan() {
  await db.pengaturan.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  console.log("  pengaturan: 1 baris");
}

async function main() {
  console.log("Mengisi basis data registri usaha warga Sanggrahan…");
  const kategori = await seedKategori();
  await seedUmkm(kategori);
  await seedAdmin();
  await seedPengaturan();
  console.log("Selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
