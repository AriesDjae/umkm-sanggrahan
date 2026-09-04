import KepalaHalaman from "@/components/admin/KepalaHalaman";
import { PERAN_PENYELIA } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";
import { pengaturan } from "@/lib/pengaturan";

import FormPengaturan from "./FormPengaturan";

export const metadata = { title: "Pengaturan situs" };

export default async function HalamanPengaturan() {
  await wajibPeran(PERAN_PENYELIA);
  const awal = await pengaturan();

  return (
    <>
      <KepalaHalaman
        label="Pengelolaan"
        judul="Pengaturan situs"
        keterangan="Nama, wilayah, kontak pengurus, titik tengah peta, dan tautan ke situs Profil RW. Perubahan di sini langsung terlihat di seluruh halaman publik."
      />
      <FormPengaturan awal={awal} />
    </>
  );
}
