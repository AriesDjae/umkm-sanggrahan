import "server-only";

import type { Prisma } from "@prisma/client";

import { db } from "./db";
import type { Kategori, Umkm } from "./types";

export type { Umkm, Produk, Kategori } from "./types";

/**
 * Pembacaan registri dari basis data.
 *
 * Sebelumnya isi registri dibaca dari berkas JSON di data/umkm/. Sejak ada
 * panel pengurus, sumbernya pindah ke PostgreSQL — berkas JSON yang lama
 * hanya dipakai sekali sebagai bahan seed. Nama fungsi di berkas ini sengaja
 * dipertahankan supaya halaman-halaman yang sudah ada tinggal menunggunya.
 */

const PILIH_KATEGORI = {
  id: true,
  slug: true,
  nama: true,
  kode: true,
  ikon: true,
  arsir: true,
  deskripsi: true,
  urutan: true,
} satisfies Prisma.KategoriSelect;

const SERTAKAN = {
  kategori: { select: PILIH_KATEGORI },
  produk: { orderBy: [{ urutan: "asc" }, { id: "asc" }] },
} satisfies Prisma.UmkmInclude;

/** Satu baris Umkm beserta kategori dan produknya, persis seperti yang dibaca. */
type BarisUmkm = Prisma.UmkmGetPayload<{ include: typeof SERTAKAN }>;

/**
 * Bentuk baris basis data menjadi bentuk yang dipakai tampilan.
 *
 * Kolom kosong di basis data ("" dan null) diubah menjadi `undefined` supaya
 * komponen cukup memeriksa "ada atau tidak", persis seperti waktu datanya
 * masih berupa JSON.
 */
function bentuk(baris: BarisUmkm): Umkm {
  const jamLengkap = Boolean(baris.jamMulai && baris.jamSelesai && baris.hari.length);

  return {
    id: baris.id,
    slug: baris.slug,
    nomor: baris.nomor,
    nama: baris.nama,
    pemilik: baris.pemilik,
    rw: baris.rw,
    rt: baris.rt || undefined,
    kategori: baris.kategori.nama,
    kat: baris.kategori,
    deskripsi: baris.deskripsi,
    alamat: baris.alamat,
    maps: baris.maps || undefined,
    koordinat:
      baris.lat !== null && baris.lng !== null
        ? { lat: baris.lat, lng: baris.lng }
        : undefined,
    sumberTitik: (baris.sumberTitik as Umkm["sumberTitik"]) || undefined,
    jam: jamLengkap
      ? { buka: baris.jamMulai!, tutup: baris.jamSelesai!, hari: baris.hari }
      : undefined,
    jamBuka: baris.jamBuka || undefined,
    whatsapp: baris.whatsapp,
    marketplace: {
      shopee: baris.shopee || undefined,
      tokopedia: baris.tokopedia || undefined,
      tiktok: baris.tiktok || undefined,
      gofood: baris.gofood || undefined,
      grabfood: baris.grabfood || undefined,
      lainnya: baris.lainnya || undefined,
    },
    sosmed: {
      instagram: baris.instagram || undefined,
      facebook: baris.facebook || undefined,
    },
    foto: baris.foto || undefined,
    produk: baris.produk.map((p) => ({
      id: p.id,
      nama: p.nama,
      harga: p.harga,
      satuan: p.satuan || undefined,
      foto: p.foto || undefined,
      keterangan: p.keterangan || undefined,
      urutan: p.urutan,
    })),
    unggulan: baris.unggulan,
    aktif: baris.aktif,
  };
}

/** Seluruh kategori, urut sesuai urutan tampil. */
export async function semuaKategori(): Promise<Kategori[]> {
  return db.kategori.findMany({
    select: PILIH_KATEGORI,
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
  });
}

export async function kategoriBySlug(slug: string): Promise<Kategori | null> {
  return db.kategori.findUnique({ where: { slug }, select: PILIH_KATEGORI });
}

/** Bidang usaha yang tampil di situs publik (yang nonaktif disembunyikan). */
export async function semuaUmkm(): Promise<Umkm[]> {
  const baris = await db.umkm.findMany({
    where: { aktif: true },
    include: SERTAKAN,
    orderBy: { nama: "asc" },
  });
  return baris.map(bentuk);
}

export async function umkmUnggulan(batas = 6): Promise<Umkm[]> {
  const semua = await semuaUmkm();
  const unggulan = semua.filter((u) => u.unggulan);
  return (unggulan.length ? unggulan : semua).slice(0, batas);
}

export async function umkmBySlug(slug: string): Promise<Umkm | undefined> {
  const baris = await db.umkm.findFirst({
    where: { slug, aktif: true },
    include: SERTAKAN,
  });
  return baris ? bentuk(baris) : undefined;
}

export async function umkmByKategori(slugKategori: string): Promise<Umkm[]> {
  const baris = await db.umkm.findMany({
    where: { aktif: true, kategori: { slug: slugKategori } },
    include: SERTAKAN,
    orderBy: { nama: "asc" },
  });
  return baris.map(bentuk);
}

/** Jumlah bidang per nama kategori, untuk pita sebaran di beranda. */
export async function jumlahPerKategori(): Promise<Record<string, number>> {
  const kelompok = await db.umkm.groupBy({
    by: ["kategoriId"],
    where: { aktif: true },
    _count: { _all: true },
  });

  const kategori = await semuaKategori();
  const namaDari = new Map(kategori.map((k) => [k.id, k.nama]));

  const hitung: Record<string, number> = {};
  for (const k of kelompok) {
    const nama = namaDari.get(k.kategoriId);
    if (nama) hitung[nama] = k._count._all;
  }
  return hitung;
}

/* ── Dipakai panel pengurus ─────────────────────────────────────────────── */

/** Termasuk bidang yang dinonaktifkan — hanya untuk panel pengurus. */
export async function semuaUmkmAdmin(): Promise<Umkm[]> {
  const baris = await db.umkm.findMany({
    include: SERTAKAN,
    orderBy: [{ aktif: "desc" }, { nomor: "asc" }],
  });
  return baris.map(bentuk);
}

export async function umkmById(id: number): Promise<Umkm | null> {
  const baris = await db.umkm.findUnique({ where: { id }, include: SERTAKAN });
  return baris ? bentuk(baris) : null;
}
