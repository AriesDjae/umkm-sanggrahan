import Link from "next/link";
import BarisBidang from "@/components/BarisBidang";
import PetaLazy from "@/components/PetaLazy";
import KodeBidang from "@/components/KodeBidang";
import { IkonPanah, IkonPin } from "@/components/Ikon";
import { KATEGORI } from "@/lib/kategori";
import { jumlahPerKategori, semuaUmkm } from "@/lib/umkm";
import { site } from "@/lib/site";
import { tautanWa } from "@/lib/format";

export default function Beranda() {
  const semua = semuaUmkm();
  const cuplikan = semua.slice(0, 6);
  const hitung = jumlahPerKategori();
  const berkoordinat = semua.filter((u) => u.koordinat).length;
  const kategoriTerisi = KATEGORI.filter((k) => hitung[k.nama]).length;

  return (
    <>
      {/* ---- Kop registri ---- */}
      <section className="mx-auto max-w-[80rem] px-4 pt-10 pb-8">
        <h1 className="judul-registri max-w-[18ch] text-[clamp(2.4rem,1.6rem+3.6vw,4.2rem)] text-tinta">
          Registri usaha warga Sanggrahan
        </h1>

        <p
          className="mt-5 text-base leading-relaxed text-tinta-lembut sm:text-lg"
          style={{ maxWidth: "62ch" }}
        >
          Pendataan resmi usaha milik tetangga Anda di RW 1 dan RW 3,{" "}
          {site.kelurahan}, {site.kemantren}. Tiap bidang diperiksa pengurus
          sebelum dicatat. Lihat siapa yang bertanda buka hari ini, lalu hubungi
          pemiliknya langsung.
        </p>

        {/* Blok keterangan lembar — data dokumen, bukan pajangan angka */}
        <dl className="mt-9 grid max-w-3xl grid-cols-2 border-[1.5px] border-garis sm:grid-cols-4">
          {[
            { label: "Bidang terdaftar", nilai: String(semua.length) },
            {
              label: "Kategori terisi",
              nilai: `${kategoriTerisi} dari ${KATEGORI.length}`,
            },
            { label: "Bertitik lokasi", nilai: `${berkoordinat} bidang` },
            { label: "Wilayah", nilai: "RW 1 & RW 3" },
          ].map((b) => (
            <div
              key={b.label}
              className="border-r-[1.5px] border-b-[1.5px] border-garis px-3.5 py-3 last:border-r-0 sm:border-b-0"
            >
              <dt className="label-registri">{b.label}</dt>
              <dd className="angka mt-1 text-base font-semibold text-tinta">
                {b.nilai}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/umkm"
            className="inline-flex items-center gap-2.5 rounded-[2px] border-[1.5px] px-5 py-3 text-base font-semibold"
            style={{
              backgroundColor: "var(--color-resmi)",
              borderColor: "var(--color-resmi-tua)",
              color: "var(--color-putih)",
            }}
          >
            Buka registri lengkap
            <IkonPanah className="h-4 w-4" />
          </Link>
          <Link
            href="/peta"
            className="inline-flex items-center gap-2.5 rounded-[2px] border-[1.5px] border-garis-tegas px-5 py-3 text-base font-semibold text-tinta"
          >
            <IkonPin className="h-4 w-4" />
            Peta bidang
          </Link>
        </div>
      </section>

      {/* ---- Profil singkat & letak bidang ---- */}
      <section className="mx-auto max-w-[80rem] px-4 pb-14">
        <div className="grid items-start gap-6 lg:grid-cols-[23rem_1fr]">
          {/* Blok identitas wilayah, dibaca seperti kepala berkas resmi. */}
          <div className="lembar">
            <div className="kop px-3 py-3 sm:px-4">
              <h2 className="label-registri">Profil singkat</h2>
            </div>

            <div className="px-3 py-4 sm:px-4">
              <p className="text-sm leading-relaxed text-tinta-lembut">
                {site.kampung} berada di Kelurahan {site.kelurahan}, Kemantren{" "}
                {site.kemantren}, {site.kota}. Registri ini mencatat usaha milik
                warganya di RW 1 dan RW 3 — warung, jasa, kerajinan, dan hasil
                kebun yang selama ini hanya dikenal di lingkungan sendiri.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-tinta-lembut">
                Dikelola swadaya oleh pengurus RW. Tiap bidang diperiksa lebih
                dulu sebelum dicatat, dan pendataan masih berjalan dari RT ke
                RT.
              </p>

              <dl className="mt-5 border-t-[1.5px] border-garis">
                {[
                  { label: "Kampung", nilai: "Sanggrahan" },
                  { label: "Kelurahan", nilai: site.kelurahan },
                  { label: "Kemantren", nilai: site.kemantren },
                  { label: "Kota", nilai: site.kota.replace(/^Kota /, "") },
                  { label: "Cakupan", nilai: "RW 1 dan RW 3" },
                  { label: "Pengelola", nilai: "Pengurus RW, swadaya" },
                  { label: "Biaya", nilai: "Tidak ada" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex items-baseline justify-between gap-4 border-b-[1.5px] border-garis py-2"
                  >
                    <dt className="label-registri">{b.label}</dt>
                    <dd className="text-sm font-semibold text-tinta">
                      {b.nilai}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/tentang"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-resmi underline underline-offset-4"
              >
                Tentang registri ini
                <IkonPanah className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Peta ringkas: peta yang sama dengan halaman /peta, tanpa daftar samping. */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-2">
              <div>
                <h2 className="judul-registri text-2xl text-tinta">
                  Letak bidang
                </h2>
                <p className="mt-2 text-sm text-tinta-lembut">
                  {berkoordinat} bidang sudah bertitik lokasi. Tekan patoknya
                  untuk melihat keterangan singkat.
                </p>
              </div>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2 text-sm font-semibold text-resmi underline underline-offset-4"
              >
                Buka peta lengkap
                <IkonPanah className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4">
              <PetaLazy daftar={semua} ringkas />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Cuplikan lembar registri ---- */}
      <section className="mx-auto max-w-[80rem] px-4 pb-16">
        <div className="lembar">
          <div className="kop flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 py-3 sm:px-4">
            <h2 className="label-registri">Petikan lembar registri</h2>
            <p className="angka text-sm text-tinta-lembut">
              menampilkan {cuplikan.length} dari {semua.length} bidang
            </p>
          </div>

          {cuplikan.length > 0 ? (
            <ul className="[&>li:last-child]:border-b-0">
              {cuplikan.map((u, i) => (
                <BarisBidang key={u.slug} umkm={u} urutan={i} />
              ))}
            </ul>
          ) : (
            <p className="px-4 py-14 text-center text-sm text-tinta-lembut">
              Belum ada bidang yang tercatat. Pendataan sedang berjalan dari RT
              ke RT.
            </p>
          )}
        </div>

        {semua.length > cuplikan.length && (
          <div className="mt-6">
            <Link
              href="/umkm"
              className="inline-flex items-center gap-2 text-base font-semibold text-resmi underline underline-offset-4"
            >
              Lihat seluruh {semua.length} bidang
              <IkonPanah className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ---- Indeks kategori ---- */}
      <section
        className="border-y-[1.5px] border-garis py-14"
        style={{ backgroundColor: "var(--color-putih)" }}
      >
        <div className="mx-auto max-w-[80rem] px-4">
          <h2 className="judul-registri text-2xl text-tinta">
            Indeks kategori
          </h2>
          <p className="mt-2 text-sm text-tinta-lembut">
            Kategori dibedakan oleh kode huruf dan arsirannya, bukan oleh warna.
          </p>

          <ul className="mt-7 border-t-[1.5px] border-garis">
            {KATEGORI.map((k) => {
              const n = hitung[k.nama] ?? 0;
              return (
                <li key={k.slug} className="border-b-[1.5px] border-garis">
                  <Link
                    href={`/kategori/${k.slug}`}
                    className="group flex flex-wrap items-center gap-x-5 gap-y-2 px-2 py-4 transition-colors hover:bg-[var(--color-resmi-muda)]"
                  >
                    <KodeBidang kategori={k} ukuran="besar" />
                    <span className="min-w-0 flex-1">
                      <span className="judul-registri block text-lg text-tinta group-hover:text-resmi">
                        {k.nama}
                      </span>
                      <span className="mt-0.5 block text-sm text-tinta-lembut">
                        {k.deskripsi}
                      </span>
                    </span>
                    <span className="angka shrink-0 text-sm font-semibold text-tinta">
                      {n} bidang
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---- Pendaftaran bidang baru ---- */}
      <section className="mx-auto max-w-[80rem] px-4 py-16">
        <div className="lembar p-6 sm:p-9">
          <span className="stempel inline-block px-3 py-1.5 text-xs font-bold">
            GRATIS
          </span>
          <h2 className="judul-registri mt-5 text-[clamp(1.6rem,1.2rem+1.8vw,2.4rem)] text-tinta">
            Punya usaha di RW 1 atau RW 3?
          </h2>
          <p
            className="mt-4 text-base leading-relaxed text-tinta-lembut"
            style={{ maxWidth: "56ch" }}
          >
            Bidang usaha Anda dicatat di sini tanpa biaya. Tidak ada iuran,
            tidak ada potongan penjualan, dan tidak ada perantara. Cukup kirim
            data dan foto ke pengurus.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={tautanWa(
                site.kontakPengurus.whatsapp,
                `Halo, saya warga ${site.kampung} dan ingin mendaftarkan usaha saya ke registri ${site.nama}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[2px] border-[1.5px] px-5 py-3 text-base font-semibold"
              style={{
                backgroundColor: "var(--color-resmi)",
                borderColor: "var(--color-resmi-tua)",
                color: "var(--color-putih)",
              }}
            >
              Hubungi pengurus
            </a>
            <Link
              href="/daftar"
              className="rounded-[2px] border-[1.5px] border-garis-tegas px-5 py-3 text-base font-semibold text-tinta"
            >
              Baca syaratnya
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
