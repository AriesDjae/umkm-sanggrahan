import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

/**
 * Barlow: grotesk rendah kontras yang lahir dari huruf rambu jalan dan
 * papan infrastruktur umum. Modern, netral, dan punya DNA lembaga —
 * persis yang dibutuhkan sebuah registri.
 */
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const KONTRAK = `
  ARAH DESAIN — REGISTRI BIDANG

  THESIS: Direktori ini adalah registri resmi. Tiap usaha satu bidang
  terdaftar: bernomor, berbatas, bertanda periksa. Kategori berhenti jadi enam
  warna berisik dan jadi kode huruf beserta arsirannya. Menolak kisi kartu
  berfoto, dan menolak dinding warna penuh yang digantikannya.

  OWN-WORLD: Lembar putih dingin, garis 1.5px yang tegas bukan garis rambut,
  kop bergaris ganda. Satu biru resmi, satu merah stempel yang muncul jarang
  sekali. Enam arsiran membedakan kategori tanpa warna. Huruf Barlow, nama
  usaha diset sampai skala poster sebagai antarmukanya sendiri.

  STORY: Warga Umbulharjo memindai lembar, melihat siapa yang bertanda buka
  hari ini, lalu menekan sekali untuk sampai di WhatsApp pemiliknya.

  FIRST VIEWPORT: Kop registri sepenuh lebar dengan nomor lembar dan hitungan
  bidang; kunci kategori menempel di kiri dan tidak ikut tergulir; di kanan
  baris-baris bidang bernomor dengan nama besar dan tanda keadaan berbentuk
  petak.

  FORM: Registri Bidang, kandidat 4 dari daftar arah rol ulang, seed f35d03c7.

  FINISH: unreviewed and undocumented is unfinished; this build ends with the
  finish review, the verdict, DESIGN.md, and every shipping raster carrying
  its provenance
`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nama} — UMKM & Jasa Semaki, Umbulharjo`,
    template: `%s | ${site.nama}`,
  },
  description: site.deskripsi,
  keywords: [
    "Usaha Warga Sanggrahan",
    "UMKM Sanggrahan",
    "UMKM Semaki",
    "UMKM Umbulharjo",
    "usaha warga Yogyakarta",
    "kuliner Umbulharjo",
    "jasa Semaki Yogyakarta",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: site.url,
    siteName: site.nama,
    title: `${site.nama} — UMKM & Jasa Semaki, Umbulharjo`,
    description: site.deskripsi,
  },
  twitter: {
    card: "summary_large_image",
    title: site.nama,
    description: site.deskripsi,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${barlow.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <div hidden dangerouslySetInnerHTML={{ __html: `<!--${KONTRAK}-->` }} />
        <a
          href="#isi"
          className="sr-only font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[2px] focus:bg-[var(--color-resmi)] focus:px-4 focus:py-4 focus:text-[var(--color-putih)]"
        >
          Lompat ke isi
        </a>
        <Header />
        <main id="isi" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
