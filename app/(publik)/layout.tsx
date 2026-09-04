import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pengaturan } from "@/lib/pengaturan";

/**
 * Kerangka halaman publik: kop, isi, kaki.
 *
 * Panel pengurus di /admin dan halaman masuk berdiri di luar grup ini, karena
 * keduanya memakai kerangka sendiri — pengurus yang sedang menyunting tidak
 * butuh menu pengunjung, dan pengunjung tidak butuh menu pengurus.
 */
export default async function LayoutPublik({ children }: LayoutProps<"/">) {
  const p = await pengaturan();

  return (
    <>
      <a
        href="#isi"
        className="sr-only font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[2px] focus:bg-[var(--color-resmi)] focus:px-4 focus:py-4 focus:text-[var(--color-putih)]"
      >
        Lompat ke isi
      </a>
      <Header
        nama={p.nama}
        logo={p.logo}
        kelurahan={p.kelurahan}
        kemantren={p.kemantren}
        tautanProfilRw={p.tautanProfilRw}
      />
      <main id="isi" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
