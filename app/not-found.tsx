import Link from "next/link";

export default function TidakDitemukan() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <div className="lembar p-8 sm:p-12">
        <p className="label-registri">Galat 404</p>
        <h1 className="judul-registri mt-4 text-3xl text-tinta">
          Bidang ini tidak ada di registri
        </h1>
        <p className="mt-4 leading-relaxed text-tinta-lembut">
          Alamat yang Anda buka tidak tercatat, atau bidang itu sudah diturunkan
          atas permintaan pemiliknya.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/umkm"
            className="rounded-[2px] border-[1.5px] px-6 py-4 font-semibold"
            style={{
              backgroundColor: "var(--color-resmi)",
              borderColor: "var(--color-resmi-tua)",
              color: "var(--color-putih)",
            }}
          >
            Buka registri lengkap
          </Link>
          <Link
            href="/"
            className="rounded-[2px] border-[1.5px] border-garis-tegas px-6 py-4 font-semibold text-tinta"
          >
            Kembali ke depan
          </Link>
        </div>
      </div>
    </div>
  );
}
