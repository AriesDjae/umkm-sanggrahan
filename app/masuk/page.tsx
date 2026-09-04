import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { penggunaSaatIni } from "@/lib/sesi";
import { pengaturan } from "@/lib/pengaturan";

import FormMasuk from "./FormMasuk";

export const metadata: Metadata = {
  title: "Masuk Panel Pengurus",
  robots: { index: false, follow: false },
};

export default async function HalamanMasuk({ searchParams }: PageProps<"/masuk">) {
  const [pengguna, p, sp] = await Promise.all([
    penggunaSaatIni(),
    pengaturan(),
    searchParams,
  ]);
  if (pengguna) redirect("/admin");

  const mentah = sp.lanjut;
  const lanjut = typeof mentah === "string" ? mentah : "";

  return (
    <main
      className="flex min-h-dvh items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--color-lembar)" }}
    >
      <div className="w-full max-w-md">
        <div className="lembar">
          <div className="kop px-6 py-6">
            <p className="label-registri">Panel pengurus</p>
          </div>

          <div className="px-6 py-8">
            <h1 className="judul-registri text-2xl text-tinta">{p.nama}</h1>
            <p className="mt-4 text-sm leading-relaxed text-tinta-lembut">
              Halaman ini untuk pengurus RW yang mengelola isi registri. Warga
              yang ingin mendaftarkan usahanya tidak perlu akun — cukup{" "}
              <Link href="/daftar" className="text-resmi underline underline-offset-4">
                hubungi pengurus
              </Link>
              .
            </p>

            <div className="mt-8">
              <FormMasuk lanjut={lanjut} />
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-tinta-lembut underline-offset-4 hover:text-resmi hover:underline"
        >
          Kembali ke registri
        </Link>
      </div>
    </main>
  );
}
