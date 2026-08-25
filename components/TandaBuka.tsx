"use client";

import type { JamBuka } from "@/lib/types";
import { statusBuka } from "@/lib/jam";
import { useJamKini } from "@/lib/gunakanJam";

/**
 * Tanda keadaan buka/tutup.
 *
 * Bentuk petaknya yang menanggung arti, bukan warnanya: petak terisi berarti
 * buka, petak bersilang berarti tutup, petak separuh berarti sebentar lagi
 * tutup. Warna hanya menguatkan. Ini yang membuat keadaan tetap terbaca oleh
 * pengunjung yang sulit membedakan warna dan di layar yang kena matahari.
 *
 * Jam sekarang hanya diketahui di peramban — lihat lib/gunakanJam.ts.
 */

function Petak({ bentuk, besar }: { bentuk: "isi" | "separuh" | "silang"; besar: boolean }) {
  const s = besar ? 16 : 12;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 12 12"
      className="shrink-0"
      aria-hidden="true"
      fill="none"
    >
      <rect
        x="0.9"
        y="0.9"
        width="10.2"
        height="10.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {bentuk === "isi" && <rect x="2.6" y="2.6" width="6.8" height="6.8" fill="currentColor" />}
      {bentuk === "separuh" && <rect x="2.6" y="2.6" width="6.8" height="3.4" fill="currentColor" />}
      {bentuk === "silang" && (
        <path d="M2.4 2.4 L9.6 9.6 M9.6 2.4 L2.4 9.6" stroke="currentColor" strokeWidth="1.8" />
      )}
    </svg>
  );
}

export default function TandaBuka({
  jam,
  ukuran = "biasa",
}: {
  jam?: JamBuka;
  ukuran?: "biasa" | "besar";
}) {
  const kini = useJamKini();
  if (!jam || kini === null) return null;

  const status = statusBuka(jam, new Date(kini));
  if (status.keadaan === "tidak-diketahui") return null;

  const besar = ukuran === "besar";
  const buka = status.keadaan === "buka";
  const segera = buka && status.segeraTutup;

  const bentuk = segera ? "separuh" : buka ? "isi" : "silang";
  const label = segera ? "SEGERA TUTUP" : buka ? "BUKA" : "TUTUP";
  const keterangan = buka
    ? `s.d. ${status.sampai}`
    : status.berikutnya
      ? `buka ${status.berikutnya}`
      : "jadwal belum tentu";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 ${besar ? "text-sm" : "text-xs"}`}
      style={{ color: buka ? "var(--color-buka)" : "var(--color-tutup)" }}
    >
      <Petak bentuk={bentuk} besar={besar} />
      <span
        className="font-semibold"
        style={{ letterSpacing: "0.1em" }}
      >
        {label}
      </span>
      <span className="angka border-l-[1.5px] border-current/30 pl-2 font-normal">
        {keterangan}
      </span>
    </span>
  );
}
