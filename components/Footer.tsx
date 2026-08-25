import Link from "next/link";
import KodeBidang from "./KodeBidang";
import { site } from "@/lib/site";
import { KATEGORI } from "@/lib/kategori";
import { tautanWa } from "@/lib/format";

export default function Footer() {
  const ajakan = `Halo, saya warga ${site.kampung} dan ingin mendaftarkan usaha saya ke registri ${site.nama}.`;

  return (
    <footer
      className="mt-24 border-t-[3px] border-double border-garis-tegas"
      style={{ backgroundColor: "var(--color-putih)" }}
    >
      <div className="mx-auto grid max-w-[80rem] gap-12 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="judul-registri text-xl text-tinta">{site.nama}</p>
          <p
            className="mt-4 text-sm leading-relaxed text-tinta-lembut"
            style={{ maxWidth: "44ch" }}
          >
            Pendataan usaha warga {site.wilayah}, RW 1 dan RW 3. Dikelola swadaya
            oleh pengurus RW. Tidak ada biaya, tidak ada potongan penjualan, dan
            tidak ada perantara.
          </p>
        </div>

        <nav aria-labelledby="kaki-kategori">
          <h2 id="kaki-kategori" className="label-registri">
            Kunci kategori
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {KATEGORI.map((k) => (
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
          <a
            href={tautanWa(site.kontakPengurus.whatsapp, ajakan)}
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
        </div>
      </div>

      <div className="border-t-[1.5px] border-garis py-6 text-center text-xs text-tinta-lembut">
        {site.nama} · {site.wilayah}. Dibuat untuk warga, gratis untuk warga.
      </div>
    </footer>
  );
}
