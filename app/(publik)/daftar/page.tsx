import type { Metadata } from "next";
import HalamanBacaan from "@/components/HalamanBacaan";
import { site } from "@/lib/site";
import { tautanWa } from "@/lib/format";
import { pengaturan } from "@/lib/pengaturan";
import { semuaKategori } from "@/lib/umkm";

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

const wajib = [
  "Nama usaha",
  "Nama pemilik",
  "RT dan RW",
  "Kategori usaha",
  "Alamat usaha",
  "Nomor WhatsApp aktif",
  "Daftar produk dan harganya",
  "Foto usaha dan foto produk",
];

const kalauAda = [
  "Jam buka",
  "Titik lokasi di peta",
  "Akun Shopee / Tokopedia / TikTok Shop",
  "Akun GoFood / GrabFood",
  "Instagram atau Facebook usaha",
  "Logo usaha",
];

function Kolom({
  label,
  butir,
  redup = false,
}: {
  label: string;
  butir: string[];
  redup?: boolean;
}) {
  return (
    <div>
      <h3 className="label-registri">{label}</h3>
      <ul
        className={`mt-4 border-t-[1.5px] border-garis text-sm ${
          redup ? "text-tinta-lembut" : "text-tinta"
        }`}
      >
        {butir.map((x) => (
          <li key={x} className="border-b-[1.5px] border-garis py-2">
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function HalamanDaftar() {
  const [p, kategori] = await Promise.all([pengaturan(), semuaKategori()]);
  const waPengurus = tautanWa(
    p.kontakWhatsapp,
    `Halo, saya warga ${p.kampung} dan ingin mendaftarkan usaha saya ke registri ${p.nama}.`,
  );

  return (
    <HalamanBacaan
      judul="Daftarkan bidang usaha Anda"
      tanda="GRATIS"
      lede="Semua warga RW 1 dan RW 3 yang punya usaha boleh ikut tercatat. Tidak
        ada biaya pendaftaran, tidak ada iuran bulanan, dan tidak ada potongan
        dari setiap penjualan Anda."
      bagian={[
        {
          id: "langkah",
          judul: "Empat langkah",
          isi: (
            <ol className="ukuran-baca border-t-[1.5px] border-garis">
              {langkah.map((l, i) => (
                <li
                  key={l.judul}
                  className="flex gap-6 border-b-[1.5px] border-garis py-6"
                >
                  {/* Nomor di sini menanggung urutan, bukan hiasan: langkahnya memang berurutan. */}
                  <span className="nomor-bidang shrink-0 text-base text-resmi">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="judul-registri block text-lg text-tinta">
                      {l.judul}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-tinta-lembut">
                      {l.isi}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          ),
        },
        {
          id: "yang-dikirim",
          judul: "Yang perlu dikirim",
          isi: (
            <>
              <div className="ukuran-baca grid gap-8 sm:grid-cols-2">
                <Kolom label="Wajib" butir={wajib} />
                <Kolom label="Kalau ada" butir={kalauAda} redup />
              </div>
              <p className="ukuran-baca mt-8 text-sm text-tinta-lembut">
                Kategori yang tersedia:{" "}
                {kategori.map((k) => `${k.nama} (${k.kode})`).join(", ")}.
              </p>
            </>
          ),
        },
        {
          id: "syarat",
          judul: "Syarat ikut tercatat",
          isi: (
            <ul className="ukuran-baca border-t-[1.5px] border-garis">
              {syarat.map((s) => (
                <li
                  key={s}
                  className="border-b-[1.5px] border-garis py-4 text-sm leading-relaxed text-tinta-lembut"
                >
                  {s}
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "perhatian",
          judul: "Perlu diperhatikan",
          /*
            Dulu blok ini dibedakan oleh pita merah di tepi kirinya, lalu sempat
            jadi kotak bergaris di dalam lembar — kotak di dalam kotak. Sekarang
            lembarnya sendiri yang berbidang lembar-alt: satu bingkai saja, dan
            merah stempel tetap terjatah sekali per layar untuk tanda GRATIS.
          */
          bidangAlt: true,
          isi: (
            <p className="ukuran-baca leading-relaxed text-tinta">
              Nomor WhatsApp dan alamat usaha Anda akan bisa dilihat siapa saja
              di internet, termasuk mesin pencari. Pastikan Anda memang bersedia
              sebelum mendaftar. Kapan saja Anda ingin data dihapus, cukup
              hubungi pengurus dan lembar bidang Anda diturunkan.
            </p>
          ),
        },
        {
          id: "mulai",
          judul: "Siap mendaftar?",
          isi: (
            <>
              <p className="ukuran-baca leading-relaxed text-tinta-lembut">
                Kirim pesan ke pengurus lewat WhatsApp. Anda akan dipandu langkah
                demi langkah.
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
              <p className="mt-4 text-sm text-tinta-lembut">
                {p.kontakNama}
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
