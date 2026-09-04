"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { nilaiForm, type HasilAksi } from "@/lib/formulir";
import type { Peran } from "@/lib/konstanta";
import { buatSesi, hapusSesi } from "@/lib/sesi";

export type Hasil = HasilAksi;

/** Pesan yang sama untuk email tak dikenal maupun sandi salah — supaya halaman
 * masuk tidak bisa dipakai menebak-nebak email siapa saja yang terdaftar. */
const DITOLAK = "Email atau sandi tidak cocok.";

export async function masuk(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const nilai = nilaiForm(formData);
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const sandi = String(formData.get("sandi") ?? "");
  const lanjut = String(formData.get("lanjut") ?? "");

  if (!email || !sandi) return { galat: "Email dan sandi wajib diisi.", nilai };

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.aktif) return { galat: DITOLAK, nilai };

  const cocok = await bcrypt.compare(sandi, user.passwordHash);
  if (!cocok) return { galat: DITOLAK, nilai };

  await buatSesi({ uid: user.id, peran: user.peran as Peran, nama: user.nama });

  // Hanya alamat di dalam situs ini yang diikuti, supaya parameter ?lanjut=
  // tidak bisa dipakai melempar pengurus ke situs lain setelah masuk.
  const tujuan = lanjut.startsWith("/") && !lanjut.startsWith("//") ? lanjut : "/admin";
  redirect(tujuan);
}

export async function keluar() {
  await hapusSesi();
  redirect("/masuk");
}
