import type { ReactNode } from "react";
import Halaman from "./Halaman";

export type Bagian = {
  /** Dipakai sebagai jangkar tautan dan sebagai butir di indeks isi. */
  id: string;
  judul: string;
  isi: ReactNode;
  /**
   * Bidang lembar-alt, untuk bagian yang perlu dibaca lebih dulu — peringatan
   * dan batasan. Pembedanya bidang, bukan warna dan bukan bingkai kedua.
   */
  bidangAlt?: boolean;
};

/**
 * Kerangka halaman bacaan panjang — /tentang dan /daftar.
 *
 * Sebelumnya kedua halaman itu menyusun dirinya sendiri, dan hasilnya tiap
 * bagian mendapat perlakuan yang berbeda-beda: sebagian polos, sebagian jadi
 * daftar bergaris, sebagian dibungkus lembar. Bingkainya muncul dan hilang
 * tanpa aturan sepanjang halaman, dan tepi kanannya tidak pernah jatuh di
 * garis yang sama karena tiap blok menetapkan lebarnya sendiri.
 *
 * Di sini bentuknya ditetapkan satu kali: tiap bagian adalah satu lembar
 * berkop, semuanya bertepi sama, dan seluruh teksnya tunduk pada satu ukuran
 * baris lewat `.ukuran-baca`. Halaman yang isinya panjang mendapat indeks
 * menempel di kiri — susunan dua kolom yang sama dengan halaman registri.
 */
export default function HalamanBacaan({
  judul,
  tanda,
  lede,
  bagian,
}: {
  judul: string;
  /** Stempel dokumen, disandingkan dengan judul — bukan label kecil di atasnya. */
  tanda?: string;
  lede: ReactNode;
  bagian: Bagian[];
}) {
  return (
    <Halaman>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-4">
        <h1 className="judul-registri text-[clamp(2rem,1.5rem+2.2vw,3rem)] text-tinta">
          {judul}
        </h1>
        {tanda && (
          <span className="stempel px-4 py-2 text-xs font-bold">{tanda}</span>
        )}
      </div>

      <div className="ukuran-baca mt-6 text-base leading-relaxed text-tinta-lembut">
        {lede}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[15rem_1fr] lg:items-start">
        {/* Indeks isi. Menempel di lg supaya bacaan panjang selalu punya petanya. */}
        <nav aria-label="Isi halaman" className="lembar lg:sticky lg:top-8">
          <div className="kop px-4 py-4">
            <p className="label-registri">Isi halaman</p>
          </div>
          <ul>
            {bagian.map((b) => (
              <li
                key={b.id}
                className="border-b-[1.5px] border-garis last:border-b-0"
              >
                <a
                  href={`#${b.id}`}
                  className="block px-4 py-4 text-sm font-semibold text-tinta transition-colors hover:bg-[var(--color-resmi-muda)] hover:text-resmi"
                >
                  {b.judul}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-6">
          {bagian.map((b) => (
            <section
              key={b.id}
              id={b.id}
              className="lembar scroll-mt-8"
              style={
                b.bidangAlt
                  ? { backgroundColor: "var(--color-lembar-alt)" }
                  : undefined
              }
            >
              <div className="kop px-4 py-4 sm:px-8">
                <h2 className="judul-registri text-lg text-tinta">{b.judul}</h2>
              </div>
              <div className="px-4 py-8 sm:px-8">{b.isi}</div>
            </section>
          ))}
        </div>
      </div>
    </Halaman>
  );
}
