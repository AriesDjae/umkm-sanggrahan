import type { Metadata } from "next";
import Link from "next/link";
import Halaman from "@/components/Halaman";
import Image from "next/image";
import { notFound } from "next/navigation";
import BarisBidang from "@/components/BarisBidang";
import KodeBidang from "@/components/KodeBidang";
import TombolWa from "@/components/TombolWa";
import TandaBuka from "@/components/TandaBuka";
import { IkonPin } from "@/components/Ikon";
import { cariKategori, KATEGORI_CADANGAN } from "@/lib/kategori";
import { semuaUmkm, umkmBySlug } from "@/lib/umkm";
import {
  formatRupiah,
  fotoUtama,
  pesanPesanProduk,
  pesanTanyaUmkm,
  ringkas,
} from "@/lib/format";
import { teksJam } from "@/lib/jam";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return semuaUmkm().map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/umkm/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const u = umkmBySlug(slug);
  if (!u) return { title: "Bidang tidak ditemukan" };

  const judul = `${u.nama} — ${u.kategori} Sanggrahan`;
  const deskripsi = ringkas(
    `${u.deskripsi} Di ${u.alamat}, ${site.kelurahan}, ${site.kemantren}. Pesan lewat WhatsApp.`,
    160,
  );
  const gambar = fotoUtama(u);

  return {
    // absolute: tanpa imbuhan nama situs, supaya judul tidak terpotong Google.
    title: { absolute: judul },
    description: deskripsi,
    alternates: { canonical: `/umkm/${u.slug}` },
    openGraph: {
      type: "article",
      title: judul,
      description: deskripsi,
      url: `${site.url}/umkm/${u.slug}`,
      images: gambar ? [{ url: gambar, alt: u.nama }] : undefined,
    },
  };
}

export default async function HalamanDetail({ params }: PageProps<"/umkm/[slug]">) {
  const { slug } = await params;
  const u = umkmBySlug(slug);
  if (!u) notFound();

  const kat = cariKategori(u.kategori) ?? KATEGORI_CADANGAN;
  const serupa = semuaUmkm()
    .filter((x) => x.kategori === u.kategori && x.slug !== u.slug)
    .slice(0, 3);

  const foto = fotoUtama(u);
  const jam = teksJam(u);

  const marketplace = Object.entries(u.marketplace ?? {}).filter(([, v]) => v) as [
    string,
    string,
  ][];

  const namaToko: Record<string, string> = {
    shopee: "Shopee",
    tokopedia: "Tokopedia",
    tiktok: "TikTok Shop",
    gofood: "GoFood",
    grabfood: "GrabFood",
    lainnya: "Toko online lainnya",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: u.nama,
    description: u.deskripsi,
    url: `${site.url}/umkm/${u.slug}`,
    ...(u.whatsapp ? { telephone: `+${u.whatsapp.replace(/\D/g, "")}` } : {}),
    identifier: u.nomor,
    address: {
      "@type": "PostalAddress",
      streetAddress: u.alamat,
      addressLocality: site.kemantren,
      addressRegion: "Daerah Istimewa Yogyakarta",
      addressCountry: "ID",
    },
    ...(u.koordinat
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: u.koordinat.lat,
            longitude: u.koordinat.lng,
          },
        }
      : {}),
    ...(u.pemilik ? { founder: u.pemilik } : {}),
    ...(foto ? { image: `${site.url}${foto}` } : {}),
    ...(jam ? { openingHours: jam } : {}),
    makesOffer: u.produk.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: p.nama },
      ...(typeof p.harga === "number" ? { price: p.harga, priceCurrency: "IDR" } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Halaman>
        <nav aria-label="Jejak halaman" className="text-sm text-tinta-lembut">
          <Link href="/" className="underline-offset-4 hover:underline">
            Registri
          </Link>
          <span className="mx-2" aria-hidden>
            ›
          </span>
          <Link
            href={`/kategori/${kat.slug}`}
            className="underline-offset-4 hover:underline"
          >
            {kat.nama}
          </Link>
        </nav>

        {/* ---- Lembar bidang ---- */}
        <article className="lembar mt-6">
          {/* Kop lembar */}
          <header className="kop flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-4 sm:px-8">
            <span className="flex items-center gap-4">
              <span className="label-registri">Nomor bidang</span>
              <span className="nomor-bidang text-base text-tinta sm:text-lg">
                {u.nomor}
              </span>
            </span>
            <KodeBidang kategori={kat} tampilkanNama />
          </header>

          <div className="px-4 py-8 sm:px-8 sm:py-10">
            <h1 className="judul-registri text-[clamp(2.2rem,1.5rem+3.4vw,3.8rem)] text-tinta">
              {u.nama}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              <TandaBuka jam={u.jam} ukuran="besar" />
              <span className="stempel px-4 py-2 text-[11px] font-bold">
                DIPERIKSA PENGURUS
              </span>
            </div>

            <p
              className="mt-8 text-base leading-relaxed whitespace-pre-line text-tinta"
              style={{ maxWidth: "68ch" }}
            >
              {u.deskripsi}
            </p>

            {foto && (
              <div className="relative mt-8 aspect-16/9 max-w-3xl overflow-hidden border-[1.5px] border-garis-tegas">
                <Image
                  src={foto}
                  alt={`Foto ${u.nama}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 94vw, 48rem"
                  className="object-cover"
                />
              </div>
            )}

            {/* ---- Keterangan bidang ---- */}
            <dl className="mt-10 grid gap-x-10 gap-y-0 border-t-[1.5px] border-garis sm:grid-cols-2">
              <Baris label="Pemilik">
                {u.pemilik || <span className="text-tinta-lembut">Belum dicatat</span>}
              </Baris>
              <Baris label="Alamat">
                <span className="block">{u.alamat}</span>
                <span className="mt-2 block text-tinta-lembut">
                  {site.kelurahan}, {site.kemantren}, {site.kota}
                </span>
              </Baris>
              <Baris label="Wilayah">
                RW {u.rw}
                {u.rt ? ` / RT ${u.rt}` : ""}
              </Baris>
              {jam && (
                <Baris label="Jam buka">
                  <span className="angka">{jam}</span>
                </Baris>
              )}
              {marketplace.length > 0 && (
                <Baris label="Toko online">
                  <span className="flex flex-wrap gap-x-4 gap-y-2">
                    {marketplace.map(([kunci, url]) => (
                      <a
                        key={kunci}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-resmi underline underline-offset-4"
                      >
                        {namaToko[kunci] ?? kunci}
                      </a>
                    ))}
                  </span>
                </Baris>
              )}
              {(u.sosmed?.instagram || u.sosmed?.facebook) && (
                <Baris label="Media sosial">
                  <span className="flex flex-wrap gap-x-4 gap-y-2">
                    {u.sosmed?.instagram && (
                      <a
                        href={u.sosmed.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-resmi underline underline-offset-4"
                      >
                        Instagram
                      </a>
                    )}
                    {u.sosmed?.facebook && (
                      <a
                        href={u.sosmed.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-resmi underline underline-offset-4"
                      >
                        Facebook
                      </a>
                    )}
                  </span>
                </Baris>
              )}
              <Baris label="Titik lokasi">
                <span className="flex flex-wrap gap-x-4 gap-y-2">
                  {u.koordinat ? (
                    <Link
                      href="/peta"
                      className="inline-flex items-center gap-2 font-semibold text-resmi underline underline-offset-4"
                    >
                      <IkonPin className="h-4 w-4" />
                      Lihat di peta bidang
                    </Link>
                  ) : (
                    <span className="text-tinta-lembut">Belum dicatat</span>
                  )}
                  {u.sumberTitik === "perkiraan-banner" && (
                    <span className="block w-full text-tinta-lembut">
                      Titik ini ditarik dari pin di banner peta kampung, bukan
                      hasil ukur di tempat — melesetnya bisa puluhan meter.
                      Pakai alamat dan nomor bidangnya untuk memastikan.
                    </span>
                  )}
                  {u.maps && (
                    <a
                      href={u.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-resmi underline underline-offset-4"
                    >
                      Google Maps
                    </a>
                  )}
                </span>
              </Baris>
            </dl>

            {/* ---- Daftar harga ---- */}
            <section className="mt-12">
              <h2 className="label-registri">
                Daftar produk dan layanan ({u.produk.length})
              </h2>

              {u.produk.length === 0 ? (
                <p className="mt-4 border-y-[1.5px] border-garis py-6 text-sm text-tinta-lembut">
                  Daftar produk dan harganya belum dicatat pengurus. Bidang ini
                  baru terdaftar dari papan peta kampung.
                </p>
              ) : (
              <table className="mt-4 w-full border-collapse text-left">
                <thead>
                  <tr className="border-y-[1.5px] border-garis-tegas">
                    <th scope="col" className="label-registri py-2 pr-4">
                      Produk
                    </th>
                    <th scope="col" className="label-registri py-2 pr-4 text-right">
                      Harga
                    </th>
                    <th scope="col" className="label-registri py-2">
                      <span className="sr-only">Pesan</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {u.produk.map((p, i) => (
                    <tr key={`${p.nama}-${i}`} className="border-b-[1.5px] border-garis">
                      <td className="py-4 pr-4 align-top">
                        <span className="flex items-start gap-4">
                          {p.foto && (
                            <span className="relative block h-12 w-12 shrink-0 overflow-hidden border-[1.5px] border-garis-tegas">
                              <Image
                                src={p.foto}
                                alt={p.nama}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </span>
                          )}
                          <span>
                            <span className="block font-semibold text-tinta">
                              {p.nama}
                            </span>
                            {p.keterangan && (
                              <span className="mt-2 block text-sm text-tinta-lembut">
                                {p.keterangan}
                              </span>
                            )}
                          </span>
                        </span>
                      </td>
                      <td className="angka py-4 pr-4 text-right align-top font-semibold text-tinta">
                        {formatRupiah(p.harga)}
                        {p.satuan && typeof p.harga === "number" && (
                          <span className="block text-xs font-normal text-tinta-lembut">
                            per {p.satuan}
                          </span>
                        )}
                      </td>
                      <td className="py-4 align-top text-right">
                        {u.whatsapp && (
                          <TombolWa
                            nomor={u.whatsapp}
                            pesan={pesanPesanProduk(u, p)}
                            ukuran="kecil"
                          >
                            Pesan
                          </TombolWa>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </section>

            {/* ---- Hubungi ---- */}
            <section className="mt-12 border-t-[3px] border-double border-garis-tegas pt-8">
              <h2 className="judul-registri text-xl text-tinta">Hubungi pemilik</h2>
              {u.whatsapp ? (
                <>
                  <p
                    className="mt-2 text-sm leading-relaxed text-tinta-lembut"
                    style={{ maxWidth: "60ch" }}
                  >
                    Langsung ke pemilik usaha, tanpa perantara dan tanpa biaya
                    tambahan. Jual beli terjadi antara Anda dan pemilik; pengurus{" "}
                    {site.nama} hanya mencatat dan mempromosikan.
                  </p>
                  <TombolWa
                    nomor={u.whatsapp}
                    pesan={pesanTanyaUmkm(u)}
                    className="mt-6"
                  />
                </>
              ) : (
                <p
                  className="mt-2 text-sm leading-relaxed text-tinta-lembut"
                  style={{ maxWidth: "60ch" }}
                >
                  Nomor WhatsApp bidang ini belum dicatat pengurus, jadi belum
                  bisa dihubungi lewat situs.{" "}
                  <Link
                    href="/daftar"
                    className="font-semibold text-resmi underline underline-offset-4"
                  >
                    Pemilik usaha bisa melengkapinya di sini
                  </Link>
                  .
                </p>
              )}
            </section>
          </div>
        </article>

        {serupa.length > 0 && (
          <section className="mt-14">
            <h2 className="judul-registri text-xl text-tinta">
              Bidang lain di kategori {kat.nama}
            </h2>
            <div className="lembar mt-6">
              <ul className="[&>li:last-child]:border-b-0">
                {serupa.map((x, i) => (
                  <BarisBidang key={x.slug} umkm={x} urutan={i} />
                ))}
              </ul>
            </div>
          </section>
        )}
      </Halaman>
    </>
  );
}

function Baris({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b-[1.5px] border-garis py-4">
      <dt className="label-registri">{label}</dt>
      <dd className="mt-2 text-base text-tinta">{children}</dd>
    </div>
  );
}
