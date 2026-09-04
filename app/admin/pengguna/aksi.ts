"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { nilaiForm, teks, type HasilAksi } from "@/lib/formulir";
import { PERAN, PERAN_PENYELIA, type Peran } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";

export type Hasil = HasilAksi;

const PERAN_SAH: string[] = Object.values(PERAN);
const PANJANG_SANDI_MIN = 8;

function segarkan() {
  revalidatePath("/admin/pengguna");
}

export async function simpanPengguna(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const nilai = nilaiForm(formData);
  const saya = await wajibPeran(PERAN_PENYELIA);

  const id = Number(formData.get("id")) || null;

  const nama = teks(formData, "nama");
  if (nama.length < 2) return { galat: "Nama wajib diisi.", nilai };

  const email = teks(formData, "email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { galat: "Alamat email tidak sah.", nilai };
  }

  const peran = teks(formData, "peran");
  if (!PERAN_SAH.includes(peran)) return { galat: "Peran tidak dikenal.", nilai };

  const bentrok = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (bentrok && bentrok.id !== id) {
    return { galat: `Email ${email} sudah dipakai akun lain.`, nilai };
  }

  const sandi = String(formData.get("sandi") ?? "");
  if (sandi && sandi.length < PANJANG_SANDI_MIN) {
    return { galat: `Sandi minimal ${PANJANG_SANDI_MIN} karakter.`, nilai };
  }

  const aktif = formData.get("aktif") === "on";

  // Administrator tidak boleh mengunci dirinya sendiri keluar: menurunkan
  // perannya sendiri atau menonaktifkan akunnya sendiri akan membuat panel ini
  // tidak bisa dibuka lagi oleh siapa pun kalau ia satu-satunya administrator.
  if (id === saya.id && (peran !== PERAN.ADMIN || !aktif)) {
    return {
      galat:
        "Anda tidak bisa menurunkan peran atau menonaktifkan akun Anda sendiri. Minta administrator lain yang melakukannya.",
      nilai,
    };
  }

  const data = {
    nama,
    email,
    peran,
    telepon: teks(formData, "telepon"),
    aktif,
    ...(sandi ? { passwordHash: await bcrypt.hash(sandi, 10) } : {}),
  };

  if (id) {
    await db.user.update({ where: { id }, data });
    segarkan();
    return { sukses: sandi ? "Akun dan sandinya diperbarui." : "Akun diperbarui." };
  }

  if (!sandi) return { galat: "Sandi wajib diisi untuk akun baru.", nilai };

  await db.user.create({ data: { ...data, passwordHash: await bcrypt.hash(sandi, 10) } });
  segarkan();
  return { sukses: `Akun untuk ${nama} dibuat.` };
}

export async function hapusPengguna(formData: FormData): Promise<void> {
  const saya = await wajibPeran(PERAN_PENYELIA);
  const id = Number(formData.get("id"));

  if (id === saya.id) return;

  // Registri harus selalu menyisakan satu administrator aktif, kalau tidak
  // panel ini tidak bisa dibuka lagi oleh siapa pun.
  const target = await db.user.findUnique({ where: { id }, select: { peran: true } });
  if (target?.peran === PERAN.ADMIN) {
    const sisa = await db.user.count({
      where: { peran: PERAN.ADMIN as Peran, aktif: true, id: { not: id } },
    });
    if (sisa === 0) return;
  }

  await db.user.delete({ where: { id } }).catch(() => null);
  segarkan();
}
