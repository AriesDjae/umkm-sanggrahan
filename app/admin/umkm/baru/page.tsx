import { redirect } from "next/navigation";

import KepalaHalaman from "@/components/admin/KepalaHalaman";
import { PERAN_PENGELOLA } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";
import { semuaKategori } from "@/lib/umkm";

import FormUmkm from "../FormUmkm";

export const metadata = { title: "Catat bidang baru" };

export default async function BidangBaru() {
  await wajibPeran(PERAN_PENGELOLA);
  const kategori = await semuaKategori();

  // Tanpa satu pun kategori, formulirnya tidak bisa disimpan sama sekali —
  // lebih baik mengantar pengurus ke tempat membuatnya daripada memajang
  // pilihan kosong yang selalu ditolak.
  if (kategori.length === 0) redirect("/admin/kategori?kosong=1");

  return (
    <>
      <KepalaHalaman
        label="Isi registri"
        judul="Catat bidang baru"
        keterangan="Nama usaha, RW, dan kategori sudah cukup untuk mencatatnya. Sisanya bisa dilengkapi belakangan — daftar produk baru bisa diisi setelah bidangnya tersimpan."
      />
      <FormUmkm kategori={kategori} />
    </>
  );
}
