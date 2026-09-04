import Link from "next/link";
import Halaman from "@/components/Halaman";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pengaturan } from "@/lib/pengaturan";

/**
 * Halaman 404 global.
 *
 * Ia berada di luar grup (publik), jadi kop dan kakinya dipasang sendiri di
 * sini — alamat yang salah ketik tetap mendarat di situs yang utuh, bukan di
 * halaman telanjang tanpa jalan pulang.
 */
export default async function TidakDitemukan() {
  const p = await pengaturan();

  return (
    <>
      <Header
        nama={p.nama}
        logo={p.logo}
        kelurahan={p.kelurahan}
        kemantren={p.kemantren}
        tautanProfilRw={p.tautanProfilRw}
      />
      <main className="flex-1">
        <Halaman>
          {/*
            Satu lembar berkop, sama seperti seluruh blok lain di situs ini. Dulu
            "Galat 404" berdiri sebagai label kapital kecil di atas judulnya —
            bentuk yang justru dilarang DESIGN.md; di kop ia menamai lembarnya,
            yang memang tugas label.
          */}
          <div className="lembar">
            <div className="kop px-4 py-4 sm:px-8">
              <p className="label-registri">Galat 404</p>
            </div>

            <div className="px-4 py-8 sm:px-8">
              <h1 className="judul-registri text-3xl text-tinta">
                Bidang ini tidak ada di registri
              </h1>
              <p className="ukuran-baca mt-6 leading-relaxed text-tinta-lembut">
                Alamat yang Anda buka tidak tercatat, atau bidang itu sudah
                diturunkan atas permintaan pemiliknya.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/umkm"
                  className="rounded-[2px] border-[1.5px] px-6 py-4 font-semibold"
                  style={{
                    backgroundColor: "var(--color-resmi)",
                    borderColor: "var(--color-resmi-tua)",
                    color: "var(--color-putih)",
                  }}
                >
                  Buka registri lengkap
                </Link>
                <Link
                  href="/"
                  className="rounded-[2px] border-[1.5px] border-garis-tegas px-6 py-4 font-semibold text-tinta"
                >
                  Kembali ke depan
                </Link>
              </div>
            </div>
          </div>
        </Halaman>
      </main>
      <Footer />
    </>
  );
}
