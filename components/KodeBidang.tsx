import type { Kategori } from "@/lib/kategori";

/**
 * Penanda kategori di registri ini: satu huruf kode di dalam kotak,
 * dan petak arsirannya. Tidak ada warna yang menanggung arti kategori —
 * kode dan arsiran yang menanggungnya, sehingga tetap terbaca oleh
 * pengunjung yang sulit membedakan warna dan di layar yang silau.
 */
export default function KodeBidang({
  kategori,
  ukuran = "biasa",
  tampilkanNama = false,
}: {
  kategori: Kategori;
  ukuran?: "biasa" | "besar";
  tampilkanNama?: boolean;
}) {
  const besar = ukuran === "besar";

  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      <span
        aria-hidden
        className={`grid shrink-0 place-items-center border-[1.5px] border-tinta font-bold ${
          besar ? "h-9 w-9 text-lg" : "h-6 w-6 text-xs"
        }`}
      >
        {kategori.kode}
      </span>
      <span
        aria-hidden
        className={`arsir ${kategori.arsir} shrink-0 border-[1.5px] border-garis-tegas ${
          besar ? "h-9 w-6" : "h-6 w-4"
        }`}
      />
      <span className={tampilkanNama ? "label-registri" : "sr-only"}>
        {tampilkanNama ? kategori.nama : `Kategori ${kategori.nama}`}
      </span>
    </span>
  );
}
