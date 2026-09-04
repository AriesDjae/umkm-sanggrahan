import Link from "next/link";
import { notFound } from "next/navigation";

import KepalaHalaman from "@/components/admin/KepalaHalaman";
import TombolHapus from "@/components/admin/TombolHapus";
import { formatRupiah } from "@/lib/format";
import { PERAN_PENGELOLA } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";
import { semuaKategori, umkmById } from "@/lib/umkm";

import { hapusProduk, hapusUmkm } from "../aksi";
import FormUmkm from "../FormUmkm";
import FormNomor from "./FormNomor";
import FormProduk from "./FormProduk";

export async function generateMetadata({ params }: PageProps<"/admin/umkm/[id]">) {
  const { id } = await params;
  const u = await umkmById(Number(id));
  return { title: u ? `Sunting ${u.nama}` : "Bidang tidak ditemukan" };
}

export default async function SuntingUmkm({
  params,
  searchParams,
}: PageProps<"/admin/umkm/[id]">) {
  await wajibPeran(PERAN_PENGELOLA);

  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [u, kategori] = await Promise.all([umkmById(Number(id)), semuaKategori()]);
  if (!u) notFound();

  return (
    <>
      <KepalaHalaman
        label={`Bidang ${u.nomor}`}
        judul={u.nama}
        keterangan={
          u.aktif
            ? `Tampil di situs publik pada /umkm/${u.slug}.`
            : "Bidang ini sedang disembunyikan dari situs publik."
        }
        aksi={u.aktif ? { href: `/umkm/${u.slug}`, label: "Lihat lembarnya" } : undefined}
      />

      {sp.baru === "1" && (
        <p className="mb-8 border-[1.5px] border-resmi bg-[var(--color-resmi-muda)] px-4 py-4 text-sm font-semibold text-[var(--color-resmi-tua)]">
          Bidang tercatat dengan nomor {u.nomor}. Daftar produknya bisa diisi di
          bagian bawah halaman ini.
        </p>
      )}

      <FormUmkm awal={u} kategori={kategori} />

      {/* ---- Daftar produk ---- */}
      <section className="mt-10">
        <h2 className="judul-registri text-xl text-tinta">Daftar produk</h2>
        <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-tinta-lembut">
          Harga di sini yang membentuk rentang harga pada baris registri. Produk
          tanpa harga tertulis “Hubungi penjual”; bidang tanpa produk sama sekali
          tertulis “Belum ada daftar harga”.
        </p>

        {u.produk.length > 0 && (
          <ul className="mt-6 space-y-4">
            {u.produk.map((p) => (
              <li key={p.id} className="lembar px-6 py-6">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4 border-b-[1.5px] border-garis pb-4">
                  <span className="judul-registri text-base text-tinta">{p.nama}</span>
                  <span className="flex items-center gap-4">
                    <span className="angka text-sm text-tinta-lembut">
                      {formatRupiah(p.harga)}
                      {p.satuan ? ` / ${p.satuan}` : ""}
                    </span>
                    <TombolHapus
                      aksi={hapusProduk}
                      id={p.id}
                      nama={p.nama}
                      kecil
                      peringatan={`Hapus produk "${p.nama}" dari ${u.nama}?`}
                    />
                  </span>
                </div>
                <FormProduk umkmId={u.id} awal={p} />
              </li>
            ))}
          </ul>
        )}

        <div className="lembar mt-6 px-6 py-6">
          <p className="label-registri mb-4">Tambah produk</p>
          <FormProduk umkmId={u.id} urutanBawaan={u.produk.length} />
        </div>
      </section>

      {/* ---- Tindakan yang tidak bisa dibatalkan ---- */}
      <section className="mt-10">
        <h2 className="judul-registri text-xl text-tinta">Nomor dan penghapusan</h2>

        <div className="lembar mt-4 px-6 py-6">
          <FormNomor id={u.id} nomor={u.nomor} />
        </div>

        <div className="mt-4 border-[1.5px] border-[var(--color-stempel)] bg-[var(--color-putih)] px-6 py-6">
          <p className="judul-registri text-base text-[var(--color-stempel)]">
            Hapus bidang ini
          </p>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-tinta-lembut">
            Bidang beserta seluruh produknya hilang permanen, dan nomornya tidak
            akan dipakai ulang. Kalau tujuannya hanya menurunkan bidang dari
            situs publik, matikan saja “Tampilkan di situs publik” di atas —
            datanya tetap tersimpan dan bisa dipasang lagi kapan saja.
          </p>
          <div className="mt-6">
            <TombolHapus
              aksi={hapusUmkm}
              id={u.id}
              nama={u.nama}
              label="Hapus bidang permanen"
              peringatan={`Hapus "${u.nama}" (${u.nomor}) beserta ${u.produk.length} produknya? Tindakan ini tidak bisa dibatalkan.`}
            />
          </div>
        </div>

        <p className="mt-6 text-sm">
          <Link
            href="/admin/umkm"
            className="text-tinta-lembut underline-offset-4 hover:text-resmi hover:underline"
          >
            Kembali ke daftar bidang
          </Link>
        </p>
      </section>
    </>
  );
}
