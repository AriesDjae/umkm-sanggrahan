import type { Metadata } from "next";
import Link from "next/link";
import PetaLazy from "@/components/PetaLazy";
import Halaman from "@/components/Halaman";
import { semuaUmkm } from "@/lib/umkm";
import { pengaturan } from "@/lib/pengaturan";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Peta Bidang",
  description: `Peta letak bidang usaha warga ${site.wilayahSingkat}, Yogyakarta. Cari yang paling dekat dari tempat Anda dan lihat yang sedang buka.`,
  alternates: { canonical: "/peta" },
};

export default async function HalamanPeta() {
  const [daftar, p] = await Promise.all([semuaUmkm(), pengaturan()]);
  const berkoordinat = daftar.filter((u) => u.koordinat).length;
  const belum = daftar.length - berkoordinat;
  const perkiraan = daftar.filter(
    (u) => u.koordinat && u.sumberTitik === "perkiraan-banner",
  ).length;

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
        <PetaLazy daftar={daftar} pusat={{ lat: p.pusatLat, lng: p.pusatLng }} />
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

      {perkiraan > 0 && (
        <p className="mt-6 border-[1.5px] border-garis-tegas bg-lembar-alt px-4 py-4 text-sm text-tinta">
          <span className="label-registri block">Ketelitian titik</span>
          <span className="mt-2 block" style={{ maxWidth: "68ch" }}>
            {perkiraan} dari {berkoordinat} titik masih <strong>perkiraan</strong>,
            ditarik dari pin di banner peta kampung RW 1 dan RW 3 lalu dicocokkan ke
            jalan asli OpenStreetMap — bukan hasil ukur di tempat. Pencocokannya
            sendiri sudah teliti di bawah 10 meter, tapi seberapa cermat pin itu
            ditaruh di bannernya tidak bisa diketahui dari foto. Anggap titiknya
            menunjuk bangunan yang benar di gang yang benar, bukan alamat pintu.
          </span>
        </p>
      )}

      <p className="mt-2 text-xs text-tinta-lembut">
        Latar peta dari OpenStreetMap. Untuk arah jalan yang pasti, pakai tautan
        Google Maps di lembar bidangnya.
      </p>
    </Halaman>
  );
}
