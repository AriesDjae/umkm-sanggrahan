import type { ReactNode } from "react";

/**
 * Wadah halaman.
 *
 * Satu-satunya tempat lebar dan padding tegak halaman ditetapkan. Sebelumnya
 * tiap halaman menetapkannya sendiri — 80rem, 4xl, 3xl, xl, dengan py-8, py-10,
 * dan py-24 — sehingga tepi kirinya berpindah-pindah saat pengunjung berpindah
 * halaman, dan tidak ada satu pun yang sejajar dengan kop maupun kaki halaman.
 *
 * Sekarang tepi luarnya selalu sama dan selalu sejajar dengan kop. Halaman yang
 * isinya bacaan panjang memakai `prosa`: yang dipersempit ukuran barisnya, bukan
 * wadahnya, jadi tepinya tetap di garis yang sama seperti halaman lain.
 */
export default function Halaman({
  children,
  prosa = false,
}: {
  children: ReactNode;
  /** Batasi lebar baris ke ukuran yang nyaman dibaca (68 huruf). */
  prosa?: boolean;
}) {
  return (
    <div className="mx-auto max-w-[80rem] px-4 py-10">
      {prosa ? <div style={{ maxWidth: "68ch" }}>{children}</div> : children}
    </div>
  );
}
