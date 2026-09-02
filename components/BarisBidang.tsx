import Link from "next/link";
import Image from "next/image";
import KodeBidang from "./KodeBidang";
import TandaBuka from "./TandaBuka";
import type { Umkm } from "@/lib/types";
import { fotoUtama, rentangHarga } from "@/lib/format";
import { cariKategori, KATEGORI_CADANGAN } from "@/lib/kategori";

/**
 * Satu UMKM sebagai satu baris bidang di lembar registri.
 *
 * Bukan kartu: tidak ada kotak bersudut membulat, tidak ada bayangan lembut,
 * tidak ada foto besar di atas. Nama usaha diset besar sebagai antarmukanya
 * sendiri — itulah sebabnya usaha yang belum berfoto tetap tampil setara
 * dengan yang sudah.
 */
export default function BarisBidang({
  umkm,
  urutan = 0,
}: {
  umkm: Umkm;
  urutan?: number;
}) {
  const kat = cariKategori(umkm.kategori) ?? KATEGORI_CADANGAN;
  const foto = fotoUtama(umkm);

  return (
    <li
      className="baris-bidang baris-masuk"
      style={{ animationDelay: `${Math.min(urutan, 12) * 45}ms` }}
    >
      <Link
        href={`/umkm/${umkm.slug}`}
        className="group grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 px-4 py-6 sm:grid-cols-[7.5rem_auto_1fr_auto] sm:items-baseline"
      >
        {/* Kolom nomor bidang */}
        <span className="nomor-bidang col-start-1 row-start-1 text-xs text-tinta-lembut sm:text-sm">
          {umkm.nomor}
        </span>

        {/* Kolom kode kategori */}
        <span className="col-start-2 row-start-1 sm:col-start-2 sm:self-start">
          <KodeBidang kategori={kat} />
        </span>

        {/* Kolom isi */}
        <span className="col-span-2 col-start-1 row-start-2 sm:col-span-1 sm:col-start-3 sm:row-start-1">
          <span className="judul-registri block text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] text-tinta group-hover:text-resmi">
            {umkm.nama}
          </span>

          <span className="mt-2 block text-sm text-tinta-lembut">
            {umkm.alamat} · RW {umkm.rw}
            {umkm.rt ? ` / RT ${umkm.rt}` : ""}
          </span>

          {umkm.produk.length > 0 && (
            <span className="mt-2 block text-sm text-tinta">
              {umkm.produk
                .slice(0, 3)
                .map((p) => p.nama)
                .join(" · ")}
            </span>
          )}

          <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="angka text-sm font-semibold text-tinta">
              {rentangHarga(umkm)}
            </span>
            <TandaBuka jam={umkm.jam} />
          </span>
        </span>

        {/* Petak foto, kecil dan tunduk pada hurufnya */}
        {foto && (
          <span className="col-start-2 row-start-3 sm:col-start-4 sm:row-start-1 sm:self-center">
            <span className="relative block h-16 w-24 overflow-hidden border-[1.5px] border-garis-tegas">
              <Image
                src={foto}
                alt={`Foto ${umkm.nama}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </span>
          </span>
        )}
      </Link>
    </li>
  );
}
