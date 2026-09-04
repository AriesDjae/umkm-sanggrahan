import Link from "next/link";

import KepalaHalaman from "@/components/admin/KepalaHalaman";
import { db } from "@/lib/db";
import { PERAN } from "@/lib/konstanta";
import { wajibMasuk } from "@/lib/otorisasi";

export const metadata = { title: "Dasbor" };

/**
 * Dasbor dibuat sebagai daftar pekerjaan, bukan pajangan angka.
 *
 * Angka jumlah bidang tidak menolong siapa pun; yang menolong adalah tahu
 * bidang mana yang datanya belum lengkap, karena itulah yang membuat sebuah
 * lembar tampil kosong di situs publik.
 */
export default async function Dasbor({ searchParams }: PageProps<"/admin">) {
  const [pengguna, sp] = await Promise.all([wajibMasuk(), searchParams]);

  const [total, aktif, tanpaWa, tanpaJam, tanpaTitik, tanpaProduk, tanpaFoto] =
    await Promise.all([
      db.umkm.count(),
      db.umkm.count({ where: { aktif: true } }),
      db.umkm.count({ where: { aktif: true, whatsapp: "" } }),
      db.umkm.count({ where: { aktif: true, hari: { isEmpty: true }, jamBuka: "" } }),
      db.umkm.count({ where: { aktif: true, lat: null } }),
      db.umkm.count({ where: { aktif: true, produk: { none: {} } } }),
      db.umkm.count({ where: { aktif: true, foto: "" } }),
    ]);

  const pekerjaan = [
    {
      jumlah: tanpaWa,
      judul: "belum punya nomor WhatsApp",
      arti: "Lembarnya tampil tanpa tombol pesan — pengunjung sampai di sana lalu buntu.",
    },
    {
      jumlah: tanpaJam,
      judul: "belum punya jam buka",
      arti: "Tidak bisa ikut saringan “hanya yang buka sekarang”.",
    },
    {
      jumlah: tanpaProduk,
      judul: "belum punya daftar produk",
      arti: "Tertulis “Belum ada daftar harga” di seluruh registri.",
    },
    {
      jumlah: tanpaTitik,
      judul: "belum punya titik koordinat",
      arti: "Tidak muncul di peta bidang.",
    },
    {
      jumlah: tanpaFoto,
      judul: "belum punya foto usaha",
      arti: "Masih tampil setara, tapi kalah menarik saat dibagikan.",
    },
  ].filter((p) => p.jumlah > 0);

  return (
    <>
      <KepalaHalaman
        label="Dasbor"
        judul={`Selamat datang, ${pengguna.nama}`}
        keterangan={`Registri memuat ${total} bidang, ${aktif} di antaranya tampil di situs publik.`}
        aksi={{ href: "/admin/umkm/baru", label: "Catat bidang baru" }}
      />

      {sp.galat === "akses" && (
        <p
          role="alert"
          className="mb-8 border-[1.5px] border-[var(--color-stempel)] bg-[var(--color-putih)] px-4 py-4 text-sm font-semibold text-[var(--color-stempel)]"
        >
          Halaman itu hanya untuk administrator. Peran Anda saat ini tidak
          memilikinya.
        </p>
      )}

      <section className="lembar">
        <div className="kop flex items-baseline justify-between gap-4 px-6 py-4">
          <p className="label-registri">Yang masih perlu didata</p>
          <Link
            href="/admin/umkm"
            className="text-sm font-semibold text-resmi underline-offset-4 hover:underline"
          >
            Buka daftar bidang
          </Link>
        </div>

        {pekerjaan.length === 0 ? (
          <p className="px-6 py-8 text-sm text-tinta-lembut">
            Seluruh bidang yang tampil sudah punya nomor WhatsApp, jam buka,
            produk, titik peta, dan foto. Registri ini lengkap.
          </p>
        ) : (
          <ul>
            {pekerjaan.map((p) => (
              <li
                key={p.judul}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b-[1.5px] border-garis px-6 py-4 last:border-b-0"
              >
                <span className="angka judul-registri w-10 shrink-0 text-2xl text-tinta">
                  {p.jumlah}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-tinta">
                    bidang {p.judul}
                  </span>
                  <span className="mt-2 block text-sm text-tinta-lembut">{p.arti}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Pintasan
          href="/admin/umkm"
          label="Bidang usaha"
          teks="Catat, ubah, sembunyikan, atau hapus bidang beserta daftar produknya."
        />
        <Pintasan
          href="/admin/kategori"
          label="Kategori"
          teks="Kode huruf dan arsiran pembeda kategori di seluruh registri."
        />
        {pengguna.peran === PERAN.ADMIN && (
          <>
            <Pintasan
              href="/admin/pengguna"
              label="Akun pengurus"
              teks="Siapa saja yang boleh masuk ke panel ini."
            />
            <Pintasan
              href="/admin/pengaturan"
              label="Pengaturan situs"
              teks="Nama, wilayah, kontak pengurus, titik tengah peta, dan tautan ke Profil RW."
            />
          </>
        )}
      </section>
    </>
  );
}

function Pintasan({
  href,
  label,
  teks,
}: {
  href: string;
  label: string;
  teks: string;
}) {
  return (
    <Link
      href={href}
      className="lembar block px-6 py-6 transition-colors hover:bg-[var(--color-resmi-muda)]"
    >
      <p className="judul-registri text-lg text-tinta">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-tinta-lembut">{teks}</p>
    </Link>
  );
}
