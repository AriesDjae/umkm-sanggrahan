import type { ReactNode } from "react";

/**
 * Wadah halaman.
 *
 * Satu-satunya tempat lebar dan padding tegak halaman ditetapkan. Sebelumnya
 * tiap halaman menetapkannya sendiri — 80rem, 4xl, 3xl, xl, dengan py-8, py-10,
 * dan py-24 — sehingga tepi kirinya berpindah-pindah saat pengunjung berpindah
 * halaman, dan tidak ada satu pun yang sejajar dengan kop maupun kaki halaman.
 *
 * Dulu ada saklar `prosa` yang membungkus seluruh isi halaman dalam kotak 68ch.
 * Niatnya mempersempit ukuran baris, tetapi yang dipersempit justru wadahnya:
 * isinya jadi merapat ke kiri dan separuh kanan layar lebar tinggal kosong.
 * Sekarang ukuran baris dipegang `.ukuran-baca` pada teksnya sendiri, dan wadah
 * ini selalu selebar kop halaman.
 */
export default function Halaman({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[80rem] px-4 py-10">{children}</div>;
}
