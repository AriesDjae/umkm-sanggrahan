import type { Metadata } from "next";

import Sidebar, { type ItemMenu } from "@/components/admin/Sidebar";
import { db } from "@/lib/db";
import { LABEL_PERAN, PERAN } from "@/lib/konstanta";
import { wajibMasuk } from "@/lib/otorisasi";

import { keluar } from "../masuk/aksi";

export const metadata: Metadata = {
  title: { default: "Panel Pengurus", template: "%s · Panel Pengurus" },
  robots: { index: false, follow: false },
};

export default async function LayoutAdmin({ children }: LayoutProps<"/admin">) {
  const pengguna = await wajibMasuk("/admin");

  const [bidang, kategori, akun] = await Promise.all([
    db.umkm.count(),
    db.kategori.count(),
    db.user.count(),
  ]);

  const menu: ItemMenu[] = [
    { href: "/admin", label: "Dasbor" },
    { href: "/admin/umkm", label: "Bidang usaha", jumlah: bidang },
    { href: "/admin/kategori", label: "Kategori", jumlah: kategori },
  ];

  // Akun dan pengaturan situs hanya untuk administrator: keduanya bisa
  // mengunci orang lain keluar atau mengubah identitas situs.
  if (pengguna.peran === PERAN.ADMIN) {
    menu.push({ href: "/admin/pengguna", label: "Akun pengurus", jumlah: akun });
    menu.push({ href: "/admin/pengaturan", label: "Pengaturan situs" });
  }

  return (
    <div
      className="flex min-h-dvh flex-col lg:flex-row"
      style={{ backgroundColor: "var(--color-lembar)" }}
    >
      <Sidebar
        menu={menu}
        nama={pengguna.nama}
        peran={LABEL_PERAN[pengguna.peran]}
        tautanSitus="/"
        keluar={
          <form action={keluar}>
            <button
              type="submit"
              className="text-sm font-semibold text-[var(--color-stempel)] underline-offset-4 hover:underline"
            >
              Keluar
            </button>
          </form>
        }
      />

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
