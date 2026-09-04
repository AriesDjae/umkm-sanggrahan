import KepalaHalaman from "@/components/admin/KepalaHalaman";
import TombolHapus from "@/components/admin/TombolHapus";
import KodeBidang from "@/components/KodeBidang";
import { db } from "@/lib/db";
import { PERAN_PENGELOLA } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";
import { semuaKategori } from "@/lib/umkm";

import { hapusKategori } from "./aksi";
import FormKategori from "./FormKategori";

export const metadata = { title: "Kategori" };

export default async function HalamanKategoriAdmin({
  searchParams,
}: PageProps<"/admin/kategori">) {
  await wajibPeran(PERAN_PENGELOLA);

  const [sp, kategori, kelompok] = await Promise.all([
    searchParams,
    semuaKategori(),
    db.umkm.groupBy({ by: ["kategoriId"], _count: { _all: true } }),
  ]);

  const dipakai = new Map(kelompok.map((k) => [k.kategoriId, k._count._all]));

  return (
    <>
      <KepalaHalaman
        label="Isi registri"
        judul="Kategori"
        keterangan="Kategori dibedakan oleh kode huruf dan arsirannya, bukan oleh warna — itu yang membuat registri tetap terbaca oleh pengunjung yang sulit membedakan warna. Ikon dan arsiran hanya bisa dipilih dari yang sudah ada di kode situs."
      />

      {sp.kosong === "1" && (
        <p
          role="alert"
          className="mb-8 border-[1.5px] border-[var(--color-stempel)] bg-[var(--color-putih)] px-4 py-4 text-sm font-semibold text-[var(--color-stempel)]"
        >
          Belum ada satu pun kategori, jadi bidang usaha belum bisa dicatat.
          Buat minimal satu kategori di bawah ini dulu.
        </p>
      )}

      <ul className="space-y-4">
        {kategori.map((k) => {
          const jumlah = dipakai.get(k.id) ?? 0;
          return (
            <li key={k.id} className="lembar px-6 py-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b-[1.5px] border-garis pb-4">
                <span className="flex items-center gap-4">
                  <KodeBidang kategori={k} ukuran="besar" />
                  <span className="judul-registri text-base text-tinta">{k.nama}</span>
                </span>

                <span className="flex items-center gap-4">
                  <span className="angka text-sm text-tinta-lembut">
                    {jumlah} bidang
                  </span>
                  {jumlah === 0 ? (
                    <TombolHapus
                      aksi={hapusKategori}
                      id={k.id}
                      nama={k.nama}
                      kecil
                      peringatan={`Hapus kategori "${k.nama}"?`}
                    />
                  ) : (
                    <span className="text-xs text-tinta-lembut">
                      Tidak bisa dihapus selama masih dipakai
                    </span>
                  )}
                </span>
              </div>

              <FormKategori awal={k} />
            </li>
          );
        })}
      </ul>

      <section className="lembar mt-8 px-6 py-6">
        <p className="label-registri mb-4">Tambah kategori</p>
        <FormKategori urutanBawaan={kategori.length} />
      </section>
    </>
  );
}
