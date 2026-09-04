import Link from "next/link";
import KodeBidang from "./KodeBidang";
import { IkonPanah } from "./Ikon";
import { site } from "@/lib/site";
import { pengaturan } from "@/lib/pengaturan";
import { semuaKategori } from "@/lib/umkm";
import { tautanWa } from "@/lib/format";

export default async function Footer() {
  const [p, kategori] = await Promise.all([pengaturan(), semuaKategori()]);
  const ajakan = `Halo, saya warga ${p.kampung} dan ingin mendaftarkan usaha saya ke registri ${p.nama}.`;

  return (
    <footer
      className="mt-24 border-t-[3px] border-double border-garis-tegas"
      style={{ backgroundColor: "var(--color-putih)" }}
    >
      <div className="mx-auto grid max-w-[80rem] gap-12 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="judul-registri text-xl text-tinta">{p.nama}</p>
          <p
            className="mt-4 text-sm leading-relaxed text-tinta-lembut"
            style={{ maxWidth: "44ch" }}
          >
            Pendataan usaha warga {p.wilayah}, RW 1 dan RW 3. Dikelola swadaya
            oleh pengurus RW. Tidak ada biaya, tidak ada potongan penjualan, dan
            tidak ada perantara.
          </p>

          {/*
            Registri ini hanya mencatat usaha. Urusan warga yang lain —
            kependudukan, kegiatan, laporan kas — ada di situs Profil RW, dan
            warga yang tersesat ke sini mencari itu berhak diantar ke sana
            alih-alih dibiarkan menutup tab.
          */}
          <a
            href={p.tautanProfilRw}
            className="mt-8 inline-flex max-w-full items-start gap-4 border-[1.5px] border-garis-tegas px-4 py-4 transition-colors hover:bg-[var(--color-resmi-muda)]"
          >
            <span className="min-w-0">
              <span className="label-registri block">Situs warga lainnya</span>
              <span className="judul-registri mt-2 block text-base text-tinta">
                {site.profilRw.nama}
              </span>
              <span className="mt-2 block text-sm text-tinta-lembut">
                {site.profilRw.keterangan}
              </span>
            </span>
            <IkonPanah
              aria-hidden
              className="mt-2 h-4 w-4 shrink-0 text-resmi"
            />
          </a>
        </div>

        <nav aria-labelledby="kaki-kategori">
          <h2 id="kaki-kategori" className="label-registri">
            Kunci kategori
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {kategori.map((k) => (
              <li key={k.slug}>
                <Link
                  href={`/kategori/${k.slug}`}
                  className="flex items-center gap-2 py-2 text-sm text-tinta hover:text-resmi hover:underline hover:underline-offset-4"
                >
                  <KodeBidang kategori={k} />
                  {k.nama}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="label-registri">Pendaftaran bidang baru</h2>
          <p className="mt-4 text-sm leading-relaxed text-tinta-lembut">
            Warga RW 1 dan RW 3 boleh mendaftar, gratis. Kirim data dan foto ke
            pengurus, sisanya kami yang urus.
          </p>
          {p.kontakWhatsapp && (
            <a
              href={tautanWa(p.kontakWhatsapp, ajakan)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-[2px] border-[1.5px] px-4 py-2 text-sm font-semibold"
              style={{
                borderColor: "var(--color-resmi)",
                color: "var(--color-resmi)",
              }}
            >
              Hubungi pengurus
            </a>
          )}

          <Link
            href="/admin"
            className="mt-8 block text-xs text-tinta-lembut underline-offset-4 hover:text-resmi hover:underline"
          >
            Panel pengurus
          </Link>
        </div>
      </div>

      <div className="border-t-[1.5px] border-garis py-6 text-center text-xs text-tinta-lembut">
        {p.nama} · {p.wilayah}. Dibuat untuk warga, gratis untuk warga.
      </div>
    </footer>
  );
}
