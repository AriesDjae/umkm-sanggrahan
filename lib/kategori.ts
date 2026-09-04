import type { Kategori } from "./types";

export type { Kategori } from "./types";

/**
 * Kategori kini tersimpan di basis data dan dikelola dari /admin/kategori.
 * Berkas ini tinggal berisi hal-hal yang tidak boleh ikut berubah:
 * pencarian tanpa basis data dan kategori cadangan.
 *
 * Komponen client tidak lagi memuat seluruh daftar kategori. Setiap bidang
 * usaha sudah membawa kategorinya sendiri pada `umkm.kat`, jadi daftar yang
 * dibutuhkan sebuah tampilan selalu bisa diturunkan dari data yang tampil.
 */

/** Cari kategori di dalam sebuah daftar, berdasarkan slug, nama, atau kode. */
export function cariKategoriDi(
  daftar: Kategori[],
  slugAtauNama: string,
): Kategori | undefined {
  const q = slugAtauNama.toLowerCase();
  return daftar.find(
    (k) => k.slug === q || k.nama.toLowerCase() === q || k.kode.toLowerCase() === q,
  );
}

/** Kumpulkan kategori yang benar-benar terpakai oleh sederet bidang usaha. */
export function kategoriTerpakai(daftar: { kat: Kategori }[]): Kategori[] {
  const peta = new Map<number, Kategori>();
  for (const u of daftar) peta.set(u.kat.id, u.kat);
  return [...peta.values()].sort(
    (a, b) => a.urutan - b.urutan || a.nama.localeCompare(b.nama, "id"),
  );
}

/** Kategori cadangan supaya tampilan tidak pernah kehilangan kode dan arsirannya. */
export const KATEGORI_CADANGAN: Kategori = {
  id: 0,
  slug: "lainnya",
  nama: "Lainnya",
  kode: "L",
  ikon: "toko",
  arsir: "arsir-penuh",
  deskripsi: "Usaha warga yang belum masuk kategori mana pun.",
  urutan: 99,
};
