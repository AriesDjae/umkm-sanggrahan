import type { Metadata } from "next";
import { site } from "@/lib/site";
import { tautanWa } from "@/lib/format";
import { KATEGORI } from "@/lib/kategori";

export const metadata: Metadata = {
  title: "Daftarkan Bidang Usaha",
  description: `Cara mendaftarkan usaha warga RW 1 dan RW 3 ${site.wilayahSingkat} ke registri ${site.nama}. Gratis, tanpa biaya dan tanpa potongan penjualan.`,
  alternates: { canonical: "/daftar" },
};

const langkah = [
  {
    judul: "Siapkan data usaha",
    isi: "Nama usaha, nama pemilik, RT/RW, alamat, jam buka, nomor WhatsApp aktif, serta daftar produk beserta harganya.",
  },
  {
    judul: "Foto produk pakai HP",
    isi: "Ambil siang hari dekat jendela, latar polos, produk memenuhi bingkai. Minimal satu foto usaha dan satu foto tiap produk.",
  },
  {
    judul: "Kirim ke pengurus",
    isi: "Kirim semua data dan foto lewat WhatsApp. Pengurus memeriksa dulu sebelum bidang Anda dicatat.",
  },
  {
    judul: "Bidang Anda tercatat",
    isi: "Dalam beberapa hari usaha Anda punya nomor bidang dan lembarnya sendiri. Tautannya bisa Anda sebar ke pelanggan dan grup WhatsApp.",
  },
];

const syarat = [
  "Usaha berlokasi atau dijalankan oleh warga RW 1 atau RW 3 Kampung Sanggrahan.",
  "Punya nomor WhatsApp aktif yang bersedia ditampilkan untuk dihubungi pembeli.",
  "Produk atau jasa yang ditawarkan legal dan tidak melanggar norma yang berlaku di kampung.",
  "Bersedia data usaha — nama, alamat, nomor WhatsApp, foto produk — ditampilkan terbuka di internet.",
  "Bersedia menjawab pesan calon pembeli. Nomor yang tidak pernah dibalas akan kami tinjau ulang.",
];

export default function HalamanDaftar() {
  const waPengurus = tautanWa(
    site.kontakPengurus.whatsapp,
    `Halo, saya warga ${site.kampung} dan ingin mendaftarkan usaha saya ke registri ${site.nama}.`,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <span className="stempel inline-block px-4 py-2 text-xs font-bold">GRATIS</span>
      <h1 className="judul-registri mt-6 text-[clamp(2rem,1.5rem+2.2vw,3rem)] text-tinta">
        Daftarkan bidang usaha Anda
      </h1>
      <p
        className="mt-4 text-base leading-relaxed text-tinta-lembut"
        style={{ maxWidth: "64ch" }}
      >
        Semua warga RW 1 dan RW 3 yang punya usaha boleh ikut tercatat. Tidak ada
        biaya pendaftaran, tidak ada iuran bulanan, dan tidak ada potongan dari
        setiap penjualan Anda.
      </p>

      {/* Langkah */}
      <section className="mt-12">
        <h2 className="judul-registri text-2xl text-tinta">Empat langkah</h2>
        <ol className="mt-6 border-t-[1.5px] border-garis">
          {langkah.map((l, i) => (
            <li key={l.judul} className="flex gap-6 border-b-[1.5px] border-garis py-6">
              <span className="nomor-bidang shrink-0 text-base text-resmi">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="judul-registri block text-lg text-tinta">
                  {l.judul}
                </span>
                <span
                  className="mt-2 block text-sm leading-relaxed text-tinta-lembut"
                  style={{ maxWidth: "62ch" }}
                >
                  {l.isi}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Data yang disiapkan */}
      <section className="lembar mt-12 p-6 sm:p-8">
        <h2 className="judul-registri text-2xl text-tinta">Yang perlu dikirim</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="label-registri">Wajib</h3>
            <ul className="mt-4 border-t-[1.5px] border-garis text-sm text-tinta">
              {[
                "Nama usaha",
                "Nama pemilik",
                "RT dan RW",
                "Kategori usaha",
                "Alamat usaha",
                "Nomor WhatsApp aktif",
                "Daftar produk dan harganya",
                "Foto usaha dan foto produk",
              ].map((x) => (
                <li key={x} className="border-b-[1.5px] border-garis py-2">
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="label-registri">Kalau ada</h3>
            <ul className="mt-4 border-t-[1.5px] border-garis text-sm text-tinta-lembut">
              {[
                "Jam buka",
                "Titik lokasi di peta",
                "Akun Shopee / Tokopedia / TikTok Shop",
                "Akun GoFood / GrabFood",
                "Instagram atau Facebook usaha",
                "Logo usaha",
              ].map((x) => (
                <li key={x} className="border-b-[1.5px] border-garis py-2">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-sm text-tinta-lembut">
          Kategori yang tersedia: {KATEGORI.map((k) => `${k.nama} (${k.kode})`).join(", ")}.
        </p>
      </section>

      {/* Syarat */}
      <section className="mt-12">
        <h2 className="judul-registri text-2xl text-tinta">Syarat ikut tercatat</h2>
        <ul className="mt-6 border-t-[1.5px] border-garis">
          {syarat.map((s) => (
            <li
              key={s}
              className="border-b-[1.5px] border-garis py-4 text-sm leading-relaxed text-tinta-lembut"
              style={{ maxWidth: "70ch" }}
            >
              {s}
            </li>
          ))}
        </ul>

        <div
          className="mt-8 border-l-[3px] p-6 text-sm leading-relaxed"
          style={{
            borderColor: "var(--color-stempel)",
            backgroundColor: "var(--color-lembar-alt)",
            maxWidth: "72ch",
          }}
        >
          <strong className="block font-semibold text-tinta">
            Perlu diperhatikan
          </strong>
          <p className="mt-2 text-tinta-lembut">
            Nomor WhatsApp dan alamat usaha Anda akan bisa dilihat siapa saja di
            internet, termasuk mesin pencari. Pastikan Anda memang bersedia
            sebelum mendaftar. Kapan saja Anda ingin data dihapus, cukup hubungi
            pengurus dan lembar bidang Anda diturunkan.
          </p>
        </div>
      </section>

      {/* Ajakan */}
      <section className="lembar mt-12 p-8 text-center sm:p-10">
        <h2 className="judul-registri text-2xl text-tinta">Siap mendaftar?</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-tinta-lembut">
          Kirim pesan ke pengurus lewat WhatsApp. Anda akan dipandu langkah demi
          langkah.
        </p>
        <a
          href={waPengurus}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-[2px] border-[1.5px] px-6 py-4 text-base font-semibold"
          style={{
            backgroundColor: "var(--color-resmi)",
            borderColor: "var(--color-resmi-tua)",
            color: "var(--color-putih)",
          }}
        >
          Chat pengurus sekarang
        </a>
        <p className="mt-4 text-sm text-tinta-lembut">{site.kontakPengurus.nama}</p>
      </section>
    </div>
  );
}
