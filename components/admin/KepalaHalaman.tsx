import Link from "next/link";

/** Kop halaman panel: nama lembar di kiri, satu tindakan utama di kanan. */
export default function KepalaHalaman({
  label,
  judul,
  keterangan,
  aksi,
}: {
  label: string;
  judul: string;
  keterangan?: string;
  aksi?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-double border-garis-tegas pb-6">
      <div>
        <p className="label-registri">{label}</p>
        <h1 className="judul-registri mt-2 text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] text-tinta">
          {judul}
        </h1>
        {keterangan && (
          <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-tinta-lembut">
            {keterangan}
          </p>
        )}
      </div>

      {aksi && (
        <Link
          href={aksi.href}
          className="rounded-[2px] border-[1.5px] px-6 py-4 text-sm font-semibold"
          style={{
            backgroundColor: "var(--color-resmi)",
            borderColor: "var(--color-resmi-tua)",
            color: "var(--color-putih)",
          }}
        >
          {aksi.label}
        </Link>
      )}
    </div>
  );
}
