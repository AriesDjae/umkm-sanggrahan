import daftar from "@/data/kategori.json";

/**
 * Daftar kategori usaha ada di data/kategori.json.
 *
 * Di registri ini kategori TIDAK dibedakan oleh warna, melainkan oleh
 * kode huruf dan arsirannya. Itu yang membuat lembarnya tetap tenang
 * dan tetap terbaca oleh pengunjung yang sulit membedakan warna.
 */
export type Kategori = {
  slug: string;
  nama: string;
  /** Satu huruf kode bidang, dicetak di kolom kode. */
  kode: string;
  /** Nama ikon di components/Ikon.tsx */
  ikon: string;
  /** Nama kelas arsiran di app/globals.css */
  arsir: string;
  deskripsi: string;
};

export const KATEGORI: Kategori[] = daftar;

export const NAMA_KATEGORI = KATEGORI.map((k) => k.nama);

export function cariKategori(slugAtauNama: string): Kategori | undefined {
  const q = slugAtauNama.toLowerCase();
  return KATEGORI.find(
    (k) => k.slug === q || k.nama.toLowerCase() === q || k.kode.toLowerCase() === q,
  );
}

/** Kategori cadangan supaya tampilan tidak pernah kehilangan kode dan arsirannya. */
export const KATEGORI_CADANGAN: Kategori =
  KATEGORI.find((k) => k.slug === "lainnya") ?? KATEGORI[0];
