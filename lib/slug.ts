import "server-only";

import { db } from "./db";

/** Ubah judul bebas menjadi potongan alamat yang aman. */
export function slugify(teks: string): string {
  return teks
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Model = "umkm" | "kategori";

/** Slug unik untuk sebuah model, dengan menambahkan angka bila bentrok. */
export async function slugUnik(
  model: Model,
  judul: string,
  abaikanId?: number,
): Promise<string> {
  const dasar = slugify(judul) || "tanpa-nama";
  let calon = dasar;
  let n = 1;

  for (;;) {
    const ada =
      model === "umkm"
        ? await db.umkm.findUnique({ where: { slug: calon }, select: { id: true } })
        : await db.kategori.findUnique({ where: { slug: calon }, select: { id: true } });

    if (!ada || ada.id === abaikanId) return calon;
    n += 1;
    calon = `${dasar}-${n}`;
  }
}

/**
 * Nomor bidang berikutnya untuk sebuah RW, misalnya "SGR-01-003".
 *
 * Nomor yang sudah terbit tidak pernah dipakai ulang walau bidangnya dihapus:
 * fungsi ini selalu melanjutkan dari nomor tertinggi yang pernah ada, supaya
 * nomor di registri tetap menunjuk satu bidang saja sepanjang waktu.
 */
export async function nomorBidangBaru(rw: number): Promise<string> {
  const awalan = `SGR-${String(rw).padStart(2, "0")}-`;
  const terakhir = await db.umkm.findFirst({
    where: { nomor: { startsWith: awalan } },
    orderBy: { nomor: "desc" },
    select: { nomor: true },
  });

  const urut = terakhir ? Number(terakhir.nomor.slice(awalan.length)) + 1 : 1;
  return `${awalan}${String(urut).padStart(3, "0")}`;
}
