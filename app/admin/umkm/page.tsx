import Link from "next/link";

import KepalaHalaman from "@/components/admin/KepalaHalaman";
import KodeBidang from "@/components/KodeBidang";
import { PERAN_PENGELOLA } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";
import { semuaUmkmAdmin } from "@/lib/umkm";

export const metadata = { title: "Bidang usaha" };

/**
 * Daftar seluruh bidang, termasuk yang disembunyikan dari situs publik.
 *
 * Kolom terakhir bukan tombol-tombol, melainkan catatan apa yang masih kurang
 * dari sebuah bidang. Pengurus datang ke halaman ini justru untuk mencari itu.
 */
export default async function DaftarUmkm() {
  await wajibPeran(PERAN_PENGELOLA);
  const daftar = await semuaUmkmAdmin();

  return (
    <>
      <KepalaHalaman
        label="Isi registri"
        judul="Bidang usaha"
        keterangan={`${daftar.length} bidang tercatat. Yang bertanda “disembunyikan” tetap tersimpan tapi tidak tampil di situs publik.`}
        aksi={{ href: "/admin/umkm/baru", label: "Catat bidang baru" }}
      />

      {daftar.length === 0 ? (
        <div className="lembar px-6 py-10 text-center">
          <p className="text-sm text-tinta-lembut">
            Belum ada bidang yang tercatat.{" "}
            <Link href="/admin/umkm/baru" className="text-resmi underline underline-offset-4">
              Catat yang pertama
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="lembar">
          {daftar.map((u) => {
            const kurang = [
              !u.whatsapp && "WhatsApp",
              !u.jam && !u.jamBuka && "jam buka",
              !u.koordinat && "titik peta",
              u.produk.length === 0 && "produk",
              !u.foto && "foto",
            ].filter(Boolean) as string[];

            return (
              <li key={u.id} className="border-b-[1.5px] border-garis last:border-b-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 px-6 py-4">
                  <span className="nomor-bidang w-24 shrink-0 text-xs text-tinta-lembut">
                    {u.nomor}
                  </span>

                  <span className="shrink-0 self-center">
                    <KodeBidang kategori={u.kat} />
                  </span>

                  <span className="min-w-0 flex-1 basis-64">
                    <Link
                      href={`/admin/umkm/${u.id}`}
                      className="judul-registri text-lg text-tinta hover:text-resmi hover:underline hover:underline-offset-4"
                    >
                      {u.nama}
                    </Link>
                    <span className="mt-2 block text-xs text-tinta-lembut">
                      RW {u.rw}
                      {u.rt ? ` · RT ${u.rt}` : ""} · {u.kategori}
                      {u.pemilik ? ` · ${u.pemilik}` : ""}
                    </span>
                    {kurang.length > 0 && (
                      <span className="mt-2 block text-xs text-[var(--color-stempel)]">
                        Belum ada: {kurang.join(", ")}.
                      </span>
                    )}
                  </span>

                  <span className="flex shrink-0 items-center gap-4">
                    {u.unggulan && <span className="label-registri">Unggulan</span>}
                    {!u.aktif && (
                      <span className="label-registri text-[var(--color-stempel)]">
                        Disembunyikan
                      </span>
                    )}
                    <Link
                      href={`/admin/umkm/${u.id}`}
                      className="text-sm font-semibold text-resmi underline-offset-4 hover:underline"
                    >
                      Sunting
                    </Link>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
