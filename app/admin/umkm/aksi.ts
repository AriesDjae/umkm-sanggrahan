"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { angka, banyakNilai, nilaiForm, teks, type HasilAksi } from "@/lib/formulir";
import { PERAN_PENGELOLA, SUMBER_TITIK } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";
import { nomorBidangBaru, slugUnik } from "@/lib/slug";
import { simpanBerkas } from "@/lib/unggah";

export type Hasil = HasilAksi;

/**
 * Menyegarkan seluruh halaman yang bisa memuat bidang ini.
 *
 * Halaman publik dibangun statis, jadi perubahan di panel tidak akan terlihat
 * sampai halamannya disegarkan. Daftar di bawah sengaja lebar: satu bidang
 * bisa muncul di beranda, registri lengkap, peta, halaman kategorinya,
 * lembarnya sendiri, dan peta situs.
 */
function segarkan(slug?: string) {
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/umkm/${slug}`);
}

const SUMBER_SAH = SUMBER_TITIK.map((s) => s.nilai) as readonly string[];

/**
 * Nomor WhatsApp dirapikan ke bentuk internasional tanpa tanda baca, karena
 * itu satu-satunya bentuk yang diterima wa.me. Warga menuliskannya dengan
 * segala macam gaya: "0812-3456-7890", "+62 812 3456 7890", "62812...".
 */
function rapikanWa(mentah: string): string {
  const digit = mentah.replace(/\D/g, "");
  if (!digit) return "";
  if (digit.startsWith("62")) return digit;
  if (digit.startsWith("0")) return `62${digit.slice(1)}`;
  if (digit.startsWith("8")) return `62${digit}`;
  return digit;
}

/** "08:00" atau "8.00" → "08:00". String kosong → null. */
function rapikanJam(mentah: string): string | null | undefined {
  const t = mentah.trim();
  if (!t) return null;
  const m = t.match(/^(\d{1,2})[:.](\d{2})$/);
  if (!m) return undefined; // penanda "tidak bisa dibaca"
  const jam = Number(m[1]);
  const menit = Number(m[2]);
  if (jam > 23 || menit > 59) return undefined;
  return `${String(jam).padStart(2, "0")}:${String(menit).padStart(2, "0")}`;
}

export async function simpanUmkm(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const nilai = nilaiForm(formData);
  const banyak = banyakNilai(formData, "hari");
  await wajibPeran(PERAN_PENGELOLA);

  const id = Number(formData.get("id")) || null;

  const nama = teks(formData, "nama");
  if (nama.length < 2) return { galat: "Nama usaha wajib diisi.", nilai, banyak };

  const rw = angka(formData, "rw");
  if (rw === null || rw < 1) return { galat: "Nomor RW wajib diisi.", nilai, banyak };

  const kategoriId = angka(formData, "kategoriId");
  if (!kategoriId) return { galat: "Kategori wajib dipilih.", nilai, banyak };

  const kategoriAda = await db.kategori.findUnique({
    where: { id: kategoriId },
    select: { id: true },
  });
  if (!kategoriAda) return { galat: "Kategori yang dipilih sudah tidak ada.", nilai, banyak };

  const jamMulai = rapikanJam(teks(formData, "jamMulai"));
  const jamSelesai = rapikanJam(teks(formData, "jamSelesai"));
  if (jamMulai === undefined || jamSelesai === undefined) {
    return { galat: "Jam harus ditulis seperti 08:00 atau 17:30.", nilai, banyak };
  }
  if (Boolean(jamMulai) !== Boolean(jamSelesai)) {
    return { galat: "Jam mulai dan jam tutup harus diisi berdua atau dikosongkan berdua.", nilai, banyak };
  }

  const hari = formData
    .getAll("hari")
    .map((h) => Number(h))
    .filter((h) => Number.isInteger(h) && h >= 0 && h <= 6);

  const lat = angka(formData, "lat");
  const lng = angka(formData, "lng");
  if ((lat === null) !== (lng === null)) {
    return { galat: "Lintang dan bujur harus diisi berdua atau dikosongkan berdua.", nilai, banyak };
  }
  if (lat !== null && (lat < -90 || lat > 90)) {
    return { galat: "Lintang harus antara -90 dan 90.", nilai, banyak };
  }
  if (lng !== null && (lng < -180 || lng > 180)) {
    return { galat: "Bujur harus antara -180 dan 180.", nilai, banyak };
  }

  const sumberMentah = teks(formData, "sumberTitik");
  const sumberTitik =
    lat === null ? null : SUMBER_SAH.includes(sumberMentah) ? sumberMentah : "gps";

  let foto: string | null = null;
  try {
    foto = await simpanBerkas(formData.get("berkasFoto") as File | null, "umkm");
  } catch (e) {
    return { galat: e instanceof Error ? e.message : "Gagal mengunggah foto.", nilai, banyak };
  }

  const slug = await slugUnik("umkm", teks(formData, "slug") || nama, id ?? undefined);

  const data = {
    nama,
    slug,
    pemilik: teks(formData, "pemilik"),
    rw,
    rt: teks(formData, "rt"),
    kategoriId,
    deskripsi: teks(formData, "deskripsi"),
    alamat: teks(formData, "alamat"),
    maps: teks(formData, "maps"),
    lat,
    lng,
    sumberTitik,
    jamMulai,
    jamSelesai,
    hari: jamMulai ? hari : [],
    jamBuka: teks(formData, "jamBuka"),
    whatsapp: rapikanWa(teks(formData, "whatsapp")),
    shopee: teks(formData, "shopee"),
    tokopedia: teks(formData, "tokopedia"),
    tiktok: teks(formData, "tiktok"),
    gofood: teks(formData, "gofood"),
    grabfood: teks(formData, "grabfood"),
    lainnya: teks(formData, "lainnya"),
    instagram: teks(formData, "instagram"),
    facebook: teks(formData, "facebook"),
    unggulan: formData.get("unggulan") === "on",
    aktif: formData.get("aktif") === "on",
    // Foto lama dipertahankan bila pengurus tidak memilih berkas baru.
    ...(foto ? { foto } : {}),
  };

  if (id) {
    const lama = await db.umkm.findUnique({ where: { id }, select: { slug: true } });
    await db.umkm.update({ where: { id }, data });
    segarkan(lama?.slug);
    segarkan(slug);
    return { sukses: "Bidang usaha diperbarui." };
  }

  const nomor = teks(formData, "nomor") || (await nomorBidangBaru(rw));
  const bentrok = await db.umkm.findUnique({ where: { nomor }, select: { id: true } });
  if (bentrok) return { galat: `Nomor bidang ${nomor} sudah dipakai bidang lain.`, nilai, banyak };

  const baru = await db.umkm.create({ data: { ...data, nomor } });
  segarkan(slug);
  redirect(`/admin/umkm/${baru.id}?baru=1`);
}

/** Nomor bidang hanya boleh diubah tersendiri, supaya tidak tergeser tak sengaja. */
export async function ubahNomor(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const nilai = nilaiForm(formData);
  await wajibPeran(PERAN_PENGELOLA);

  const id = Number(formData.get("id"));
  const nomor = teks(formData, "nomor").toUpperCase();
  if (!/^SGR-\d{2}-\d{3}$/.test(nomor)) {
    return { galat: "Nomor bidang harus berbentuk SGR-01-003.", nilai };
  }

  const bentrok = await db.umkm.findUnique({ where: { nomor }, select: { id: true } });
  if (bentrok && bentrok.id !== id) {
    return { galat: `Nomor ${nomor} sudah dipakai bidang lain.`, nilai };
  }

  const baris = await db.umkm.update({ where: { id }, data: { nomor } });
  segarkan(baris.slug);
  return { sukses: `Nomor bidang menjadi ${nomor}.` };
}

export async function hapusUmkm(formData: FormData) {
  await wajibPeran(PERAN_PENGELOLA);
  const id = Number(formData.get("id"));

  const baris = await db.umkm.findUnique({ where: { id }, select: { slug: true } });
  await db.umkm.delete({ where: { id } }).catch(() => null);

  segarkan(baris?.slug);
  redirect("/admin/umkm");
}

/* ── Produk ─────────────────────────────────────────────────────────────── */

export async function simpanProduk(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const nilai = nilaiForm(formData);
  await wajibPeran(PERAN_PENGELOLA);

  const umkmId = Number(formData.get("umkmId"));
  const id = Number(formData.get("id")) || null;

  const nama = teks(formData, "nama");
  if (!nama) return { galat: "Nama produk wajib diisi.", nilai };

  const induk = await db.umkm.findUnique({
    where: { id: umkmId },
    select: { slug: true },
  });
  if (!induk) return { galat: "Bidang usahanya sudah tidak ada.", nilai };

  const harga = angka(formData, "harga");
  if (harga !== null && harga < 0) return { galat: "Harga tidak boleh negatif.", nilai };

  let foto: string | null = null;
  try {
    foto = await simpanBerkas(formData.get("berkasFoto") as File | null, "produk");
  } catch (e) {
    return { galat: e instanceof Error ? e.message : "Gagal mengunggah foto.", nilai };
  }

  const data = {
    nama,
    // Harga dikosongkan berarti "hubungi penjual", bukan gratis —
    // itu sebabnya kolomnya boleh null dan tidak dijadikan 0.
    harga,
    satuan: teks(formData, "satuan"),
    keterangan: teks(formData, "keterangan"),
    urutan: angka(formData, "urutan") ?? 0,
    ...(foto ? { foto } : {}),
  };

  if (id) {
    await db.produkUmkm.update({ where: { id }, data });
  } else {
    await db.produkUmkm.create({ data: { ...data, umkmId } });
  }

  revalidatePath(`/admin/umkm/${umkmId}`);
  segarkan(induk.slug);
  return { sukses: id ? "Produk diperbarui." : `Produk "${nama}" ditambahkan.` };
}

export async function hapusProduk(formData: FormData) {
  await wajibPeran(PERAN_PENGELOLA);
  const id = Number(formData.get("id"));

  const baris = await db.produkUmkm
    .delete({ where: { id }, select: { umkmId: true, umkm: { select: { slug: true } } } })
    .catch(() => null);

  if (baris) {
    revalidatePath(`/admin/umkm/${baris.umkmId}`);
    segarkan(baris.umkm.slug);
  }
}
