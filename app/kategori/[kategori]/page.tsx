import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BarisBidang from "@/components/BarisBidang";
import KodeBidang from "@/components/KodeBidang";
import { KATEGORI, cariKategori } from "@/lib/kategori";
import { umkmByKategori } from "@/lib/umkm";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return KATEGORI.map((k) => ({ kategori: k.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/kategori/[kategori]">): Promise<Metadata> {
  const { kategori } = await params;
  const kat = cariKategori(kategori);
  if (!kat) return { title: "Kategori tidak ditemukan" };

  return {
    title: `${kat.nama} di Sanggrahan`,
    description: `${kat.deskripsi} Warga ${site.wilayahSingkat}, RW 1 dan RW 3.`,
    alternates: { canonical: `/kategori/${kat.slug}` },
    openGraph: {
      title: `${kat.nama} di Sanggrahan | ${site.nama}`,
      description: kat.deskripsi,
      url: `${site.url}/kategori/${kat.slug}`,
    },
  };
}

export default async function HalamanKategori({
  params,
}: PageProps<"/kategori/[kategori]">) {
  const { kategori } = await params;
  const kat = cariKategori(kategori);
  if (!kat) notFound();

  const daftar = umkmByKategori(kat.slug);
  const lainnya = KATEGORI.filter((k) => k.slug !== kat.slug);

  return (
    <div className="mx-auto max-w-[80rem] px-4 py-8">
      <nav aria-label="Jejak halaman" className="text-sm text-tinta-lembut">
        <Link href="/" className="underline-offset-4 hover:underline">
          Registri
        </Link>
        <span className="mx-2" aria-hidden>
          ›
        </span>
        <Link href="/umkm" className="underline-offset-4 hover:underline">
          Semua bidang
        </Link>
        <span className="mx-2" aria-hidden>
          ›
        </span>
        <span className="font-semibold text-tinta">{kat.nama}</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 border-b-[3px] border-double border-garis-tegas pb-7">
        <KodeBidang kategori={kat} ukuran="besar" />
        <div className="min-w-0 flex-1">
          <h1 className="judul-registri text-[clamp(1.9rem,1.4rem+2.4vw,3rem)] text-tinta">
            {kat.nama}
          </h1>
          <p
            className="mt-2 text-base leading-relaxed text-tinta-lembut"
            style={{ maxWidth: "58ch" }}
          >
            {kat.deskripsi}
          </p>
        </div>
        <p className="angka shrink-0 text-sm font-semibold text-tinta">
          {daftar.length} bidang
        </p>
      </div>

      {daftar.length > 0 ? (
        <section className="mt-8">
          <h2 className="sr-only">Daftar bidang kategori {kat.nama}</h2>
          <div className="lembar">
            <ul className="[&>li:last-child]:border-b-0">
              {daftar.map((u, i) => (
                <BarisBidang key={u.slug} umkm={u} urutan={i} />
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <div className="lembar mt-8 px-6 py-20 text-center">
          <p className="judul-registri text-xl text-tinta">
            Belum ada bidang di kategori ini
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-tinta-lembut">
            Punya usaha {kat.nama.toLowerCase()} di RW 1 atau RW 3?{" "}
            <Link
              href="/daftar"
              className="font-semibold text-resmi underline underline-offset-4"
            >
              Daftarkan bidang Anda
            </Link>
            , gratis.
          </p>
        </div>
      )}

      <section className="mt-14 border-t-[1.5px] border-garis pt-7">
        <h2 className="label-registri">Kategori lainnya</h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {lainnya.map((k) => (
            <li key={k.slug}>
              <Link
                href={`/kategori/${k.slug}`}
                className="flex items-center gap-2.5 text-sm font-medium text-tinta hover:text-resmi hover:underline hover:underline-offset-4"
              >
                <KodeBidang kategori={k} />
                {k.nama}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
