"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { angka, nilaiForm, teks, type HasilAksi } from "@/lib/formulir";
import { PERAN_PENYELIA } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";
import { simpanBerkas } from "@/lib/unggah";

export type Hasil = HasilAksi;

/** Nomor WhatsApp pengurus dirapikan sama seperti nomor bidang usaha. */
function rapikanWa(mentah: string): string {
  const digit = mentah.replace(/\D/g, "");
  if (!digit) return "";
  if (digit.startsWith("62")) return digit;
  if (digit.startsWith("0")) return `62${digit.slice(1)}`;
  if (digit.startsWith("8")) return `62${digit}`;
  return digit;
}

export async function simpanPengaturan(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const nilai = nilaiForm(formData);
  await wajibPeran(PERAN_PENYELIA);

  const nama = teks(formData, "nama");
  if (nama.length < 2) return { galat: "Nama situs wajib diisi.", nilai };

  const tautanProfilRw = teks(formData, "tautanProfilRw");
  if (tautanProfilRw && !/^https?:\/\/\S+$/.test(tautanProfilRw)) {
    return {
      galat: "Tautan Profil RW harus alamat lengkap, diawali http:// atau https://.",
      nilai,
    };
  }

  const pusatLat = angka(formData, "pusatLat");
  const pusatLng = angka(formData, "pusatLng");
  if (pusatLat === null || pusatLng === null) {
    return { galat: "Titik tengah peta wajib diisi.", nilai };
  }
  if (pusatLat < -90 || pusatLat > 90 || pusatLng < -180 || pusatLng > 180) {
    return { galat: "Titik tengah peta di luar jangkauan koordinat bumi.", nilai };
  }

  let logo: string | null = null;
  try {
    logo = await simpanBerkas(formData.get("berkasLogo") as File | null, "situs");
  } catch (e) {
    return { galat: e instanceof Error ? e.message : "Gagal mengunggah logo.", nilai };
  }

  const data = {
    nama,
    deskripsi: teks(formData, "deskripsi"),
    kampung: teks(formData, "kampung"),
    kelurahan: teks(formData, "kelurahan"),
    kemantren: teks(formData, "kemantren"),
    kota: teks(formData, "kota"),
    kontakNama: teks(formData, "kontakNama"),
    kontakWhatsapp: rapikanWa(teks(formData, "kontakWhatsapp")),
    instagram: teks(formData, "instagram"),
    facebook: teks(formData, "facebook"),
    pusatLat,
    pusatLng,
    tautanProfilRw,
    // Logo dikosongkan lewat kotak centang tersendiri, bukan dengan tidak
    // memilih berkas — kalau tidak, logo akan terhapus setiap kali menyimpan.
    ...(formData.get("hapusLogo") === "on" ? { logo: "" } : logo ? { logo } : {}),
  };

  await db.pengaturan.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  revalidatePath("/", "layout");
  return { sukses: "Pengaturan situs disimpan." };
}
