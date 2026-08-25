import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { semuaUmkm } from "@/lib/umkm";

export const metadata: Metadata = {
  title: "Tentang Registri",
  description: `Tentang ${site.nama}: registri usaha warga RW 1 dan RW 3 ${site.wilayahSingkat}, dikelola swadaya oleh pengurus RW.`,
  alternates: { canonical: "/tentang" },
};

export default function HalamanTentang() {
  const jumlah = semuaUmkm().length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="judul-registri text-[clamp(2rem,1.5rem+2.2vw,3rem)] text-tinta">
        Tentang registri ini
      </h1>

      <div className="mt-10 flex flex-col gap-11" style={{ maxWidth: "68ch" }}>
        <section>
          <h2 className="judul-registri text-xl text-tinta">Kenapa registri ini ada</h2>
          <p className="mt-3 leading-relaxed text-tinta-lembut">
            Banyak warga {site.kampung} punya usaha yang produknya bagus, tapi
            hanya dikenal di lingkungan sendiri. Ketika ada orang mencari
            “keripik singkong Umbulharjo” atau “jasa jahit dekat sini” di
            internet, usaha warga tidak muncul di mana pun.
          </p>
          <p className="mt-4 leading-relaxed text-tinta-lembut">
            Registri ini menutup jarak itu. Setiap usaha punya lembar bidangnya
            sendiri — bernomor, bisa ditemukan mesin pencari, tautannya bisa
            disebar ke grup WhatsApp, dan letaknya bisa dilihat di{" "}
            <Link
              href="/peta"
              className="font-semibold text-resmi underline underline-offset-4"
            >
              peta bidang
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="judul-registri text-xl text-tinta">Cakupan</h2>
          <p className="mt-3 leading-relaxed text-tinta-lembut">
            Registri ini mencatat usaha milik warga{" "}
            <strong className="font-semibold text-tinta">RW 1</strong> dan{" "}
            <strong className="font-semibold text-tinta">RW 3</strong>,{" "}
            {site.kampung}, Kelurahan {site.kelurahan}, Kemantren{" "}
            {site.kemantren}, {site.kota}. Saat ini ada{" "}
            <strong className="font-semibold text-tinta">{jumlah} bidang</strong>{" "}
            yang tercatat, dan pendataan masih berjalan dari RT ke RT.
          </p>
          <p className="mt-4 leading-relaxed text-tinta-lembut">
            Cakupannya sempit dengan sengaja. Satu kampung, dua RW, dan setiap
            bidang diperiksa dulu oleh pengurus sebelum dicatat — sesuatu yang
            tidak bisa dilakukan direktori sebesar kota.
          </p>
        </section>

        <section>
          <h2 className="judul-registri text-xl text-tinta">Cara kerjanya</h2>
          <ol className="mt-4 border-t-[1.5px] border-garis">
            {[
              "Pengurus mendata usaha warga, memeriksanya, lalu mencatatnya sebagai satu bidang bernomor.",
              "Pengunjung memindai lembar registri, melihat siapa yang bertanda buka, cek produk dan harganya.",
              "Pengunjung menekan tombol WhatsApp dan sampai langsung di pemilik usaha.",
              "Jual beli, pembayaran, dan pengiriman diurus sepenuhnya antara pembeli dan pemilik usaha.",
            ].map((t, i) => (
              <li
                key={t}
                className="flex gap-4 border-b-[1.5px] border-garis py-4 leading-relaxed text-tinta-lembut"
              >
                <span className="nomor-bidang shrink-0 text-tinta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </section>

        <section className="lembar p-6">
          <h2 className="judul-registri text-xl text-tinta">
            Batasan yang perlu diketahui
          </h2>
          <p className="mt-3 leading-relaxed text-tinta-lembut">
            Registri ini adalah pencatatan dan promosi, bukan toko online dan
            bukan perantara jual beli. Pengurus {site.nama} tidak memungut biaya,
            tidak menerima pembayaran, dan tidak bertanggung jawab atas transaksi
            antara pembeli dan pemilik usaha. Harga yang tercantum bisa berubah
            sewaktu-waktu — pastikan mengonfirmasi langsung ke penjual.
          </p>
        </section>

        <section>
          <h2 className="judul-registri text-xl text-tinta">Data pribadi</h2>
          <p className="mt-3 leading-relaxed text-tinta-lembut">
            Data yang ditampilkan di sini dikirimkan sendiri oleh pemilik usaha
            dengan persetujuan untuk ditayangkan terbuka. Pemilik usaha bisa
            meminta perubahan atau penghapusan datanya kapan saja dengan
            menghubungi pengurus.
          </p>
        </section>

        <section className="lembar p-6">
          <h2 className="judul-registri text-xl text-tinta">Ingin ikut tercatat?</h2>
          <p className="mt-3 leading-relaxed text-tinta-lembut">
            Pendaftaran terbuka untuk seluruh warga RW 1 dan RW 3, tanpa biaya
            apa pun.
          </p>
          <Link
            href="/daftar"
            className="mt-6 inline-flex rounded-[2px] border-[1.5px] px-5 py-3 font-semibold"
            style={{
              backgroundColor: "var(--color-resmi)",
              borderColor: "var(--color-resmi-tua)",
              color: "var(--color-putih)",
            }}
          >
            Lihat cara mendaftar
          </Link>
        </section>
      </div>
    </div>
  );
}
