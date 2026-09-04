import "server-only";

import { redirect } from "next/navigation";

import { PERAN, type Peran } from "./konstanta";
import { penggunaSaatIni, type PenggunaSesi } from "./sesi";

/** Wajib masuk. Mengalihkan ke halaman masuk bila belum. */
export async function wajibMasuk(kembaliKe?: string): Promise<PenggunaSesi> {
  const pengguna = await penggunaSaatIni();
  if (!pengguna) {
    redirect(kembaliKe ? `/masuk?lanjut=${encodeURIComponent(kembaliKe)}` : "/masuk");
  }
  return pengguna;
}

/** Wajib masuk dengan salah satu peran tertentu. */
export async function wajibPeran(peran: Peran[]): Promise<PenggunaSesi> {
  const pengguna = await wajibMasuk();
  if (!peran.includes(pengguna.peran)) redirect("/admin?galat=akses");
  return pengguna;
}

export function bolehKelolaAkun(pengguna: PenggunaSesi): boolean {
  return pengguna.peran === PERAN.ADMIN;
}
