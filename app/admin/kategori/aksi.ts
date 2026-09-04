"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { angka, nilaiForm, teks, type HasilAksi } from "@/lib/formulir";
import { NAMA_ARSIR, NAMA_IKON, PERAN_PENGELOLA } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";
import { slugUnik } from "@/lib/slug";

export type Hasil = HasilAksi;

function segarkan() {
  revalidatePath("/admin/kategori");
  revalidatePath("/", "layout");
}

export async function simpanKategori(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const nilai = nilaiForm(formData);
  await wajibPeran(PERAN_PENGELOLA);

  const id = Number(formData.get("id")) || null;

  const nama = teks(formData, "nama");
  if (nama.length < 2) return { galat: "Nama kategori wajib diisi.", nilai };

  const kode = teks(formData, "kode").toUpperCase();
  if (!/^[A-Z]$/.test(kode)) {
    return { galat: "Kode kategori harus tepat satu huruf, misalnya K.", nilai };
  }

  const ikon = teks(formData, "ikon");
  const arsir = teks(formData, "arsir");
  if (!NAMA_IKON.includes(ikon)) return { galat: "Ikon tidak dikenal.", nilai };
  if (!NAMA_ARSIR.includes(arsir)) return { galat: "Arsiran tidak dikenal.", nilai };

  // Nama kategori unik di basis data; diperiksa lebih dulu agar pengurus
  // mendapat kalimat yang jelas, bukan galat unik dari PostgreSQL.
  const bentrok = await db.kategori.findUnique({ where: { nama }, select: { id: true } });
  if (bentrok && bentrok.id !== id) {
    return { galat: `Sudah ada kategori bernama "${nama}".`, nilai };
  }

  const data = {
    nama,
    slug: await slugUnik("kategori", teks(formData, "slug") || nama, id ?? undefined),
    kode,
    ikon,
    arsir,
    deskripsi: teks(formData, "deskripsi"),
    urutan: angka(formData, "urutan") ?? 0,
  };

  if (id) await db.kategori.update({ where: { id }, data });
  else await db.kategori.create({ data });

  segarkan();
  return { sukses: id ? "Kategori diperbarui." : `Kategori "${nama}" ditambahkan.` };
}

/**
 * Kategori yang masih dipakai tidak boleh hilang begitu saja: bidang di
 * bawahnya akan kehilangan kode dan arsirannya. Relasinya memang sudah
 * `onDelete: Restrict`, tetapi galat basis data tidak menjelaskan apa pun
 * kepada pengurus — jadi penolakannya dijelaskan di sini.
 */
export async function hapusKategori(formData: FormData): Promise<void> {
  await wajibPeran(PERAN_PENGELOLA);
  const id = Number(formData.get("id"));

  const dipakai = await db.umkm.count({ where: { kategoriId: id } });
  if (dipakai > 0) {
    revalidatePath("/admin/kategori");
    return;
  }

  await db.kategori.delete({ where: { id } }).catch(() => null);
  segarkan();
}
