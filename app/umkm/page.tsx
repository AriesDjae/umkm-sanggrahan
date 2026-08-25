import type { Metadata } from "next";
import Link from "next/link";
import PencarianUmkm from "@/components/PencarianUmkm";
import { IkonPin } from "@/components/Ikon";
import { semuaUmkm } from "@/lib/umkm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Registri Lengkap",
  description: `Registri lengkap usaha warga ${site.wilayahSingkat}, RW 1 dan RW 3. Saring yang sedang buka, cari berdasarkan produk, kategori, atau nomor bidang.`,
  alternates: { canonical: "/umkm" },
};

export default function HalamanUmkm() {
  const daftar = semuaUmkm();

  return (
    <div className="mx-auto max-w-[80rem] px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="judul-registri text-[clamp(2rem,1.5rem+2.2vw,3rem)] text-tinta">
            Registri lengkap
          </h1>
          <p
            className="mt-4 text-base leading-relaxed text-tinta-lembut"
            style={{ maxWidth: "62ch" }}
          >
            Seluruh bidang usaha di RW 1 dan RW 3 yang sudah tercatat. Nyalakan
            “Hanya yang buka sekarang” kalau Anda butuh yang bisa dihubungi hari
            ini juga.
          </p>
        </div>

        <Link
          href="/peta"
          className="inline-flex shrink-0 items-center gap-2 rounded-[2px] border-[1.5px] border-garis-tegas px-4 py-2 text-sm font-semibold text-tinta"
        >
          <IkonPin className="h-4 w-4" />
          Lihat di peta
        </Link>
      </div>

      <div className="mt-10">
        {daftar.length > 0 ? (
          <PencarianUmkm daftar={daftar} />
        ) : (
          <div className="lembar px-6 py-20 text-center">
            <p className="judul-registri text-xl text-tinta">Registri masih kosong</p>
            <p className="mx-auto mt-4 max-w-sm text-sm text-tinta-lembut">
              Pendataan usaha warga sedang berjalan dari RT ke RT. Silakan kembali
              lagi nanti.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
