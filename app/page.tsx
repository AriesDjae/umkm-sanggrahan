import Link from "next/link";
import BarisBidang from "@/components/BarisBidang";
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
              Belum ada bidang yang tercatat. Pendataan sedang berjalan dari RT ke
              RT.
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
          <h2 className="judul-registri text-2xl text-tinta">Indeks kategori</h2>
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
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
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

          <Link
            href="/peta"
            className="lembar group flex flex-col p-6 transition-colors hover:bg-[var(--color-resmi-muda)] sm:p-8"
          >
            <span className="block">
              <IkonPin className="h-8 w-8 text-resmi" />
              <span className="judul-registri mt-4 block text-xl text-tinta">
                Peta bidang
              </span>
              <span className="mt-3 block text-sm leading-relaxed text-tinta-lembut">
                Letak {berkoordinat} bidang di peta Sanggrahan. Urutkan dari yang
                paling dekat dengan posisi Anda sekarang.
              </span>
            </span>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-resmi">
              Buka peta
              <IkonPanah className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
