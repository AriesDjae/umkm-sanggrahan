import type { Metadata } from "next";
import Link from "next/link";
import PetaLazy from "@/components/PetaLazy";
import Halaman from "@/components/Halaman";
import { semuaUmkm } from "@/lib/umkm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Peta Bidang",
  description: `Peta letak bidang usaha warga ${site.wilayahSingkat}, Yogyakarta. Cari yang paling dekat dari tempat Anda dan lihat yang sedang buka.`,
  alternates: { canonical: "/peta" },
};

export default function HalamanPeta() {
  const daftar = semuaUmkm();
  const berkoordinat = daftar.filter((u) => u.koordinat).length;
  const belum = daftar.length - berkoordinat;

  return (
    <Halaman>
      <div className="max-w-3xl">
        <h1 className="judul-registri text-[clamp(2rem,1.5rem+2.2vw,3rem)] text-tinta">
          Peta bidang
        </h1>
        <p
          className="mt-4 text-base leading-relaxed text-tinta-lembut"
          style={{ maxWidth: "64ch" }}
        >
          Letak bidang usaha di {site.kampung}, {site.kelurahan}, {site.kemantren}.
          Tiap patok memuat kode kategori dan nomor bidangnya. Tekan “Terdekat
          dari saya” untuk mengurutkan dari yang paling dekat dengan posisi Anda.
        </p>
      </div>

      <div className="mt-8">
        <PetaLazy daftar={daftar} />
      </div>

      {belum > 0 && (
        <p className="mt-6 text-sm text-tinta-lembut">
          {belum} bidang belum punya titik lokasi, jadi belum muncul di peta.{" "}
          <Link
            href="/umkm"
            className="font-semibold text-resmi underline underline-offset-4"
          >
            Lihat registri lengkapnya
          </Link>
          .
        </p>
      )}

      <p className="mt-2 text-xs text-tinta-lembut">
        Latar peta dari OpenStreetMap. Titik lokasi dicatat pengurus dan bisa
        meleset beberapa meter — untuk arah jalan yang pasti, pakai tautan Google
        Maps di lembar bidangnya.
      </p>
    </Halaman>
  );
}
