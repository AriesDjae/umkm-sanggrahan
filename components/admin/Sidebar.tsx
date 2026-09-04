"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { IkonGaris, IkonPanah, IkonSilang } from "@/components/Ikon";

export type ItemMenu = {
  href: string;
  label: string;
  jumlah?: number;
};

export default function Sidebar({
  menu,
  nama,
  peran,
  tautanSitus,
  keluar,
}: {
  menu: ItemMenu[];
  nama: string;
  peran: string;
  tautanSitus: string;
  keluar: React.ReactNode;
}) {
  const path = usePathname();
  const [laci, setLaci] = useState({ buka: false, path });

  // Menutup laci navigasi begitu pengurus berpindah halaman.
  if (laci.path !== path) setLaci({ buka: false, path });
  const buka = laci.buka;

  const aktif = (href: string) =>
    href === "/admin" ? path === "/admin" : path.startsWith(href);

  const isi = (
    <div className="flex h-full flex-col">
      <div className="border-b-[3px] border-double border-garis-tegas px-6 py-6">
        <p className="label-registri">Panel pengurus</p>
        <p className="judul-registri mt-2 text-lg text-tinta">Registri usaha</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {menu.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            aria-current={aktif(m.href) ? "page" : undefined}
            className="flex items-center justify-between gap-4 rounded-[2px] px-4 py-4 text-sm font-semibold transition-colors"
            style={
              aktif(m.href)
                ? {
                    backgroundColor: "var(--color-resmi)",
                    color: "var(--color-putih)",
                  }
                : { color: "var(--color-tinta)" }
            }
          >
            {m.label}
            {m.jumlah !== undefined && (
              <span className="angka text-xs opacity-70">{m.jumlah}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="border-t-[1.5px] border-garis px-6 py-6">
        <p className="truncate text-sm font-semibold text-tinta">{nama}</p>
        <p className="label-registri mt-2">{peran}</p>

        <a
          href={tautanSitus}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tinta-lembut hover:text-resmi"
        >
          Lihat situs publik
          <IkonPanah aria-hidden className="h-4 w-4" />
        </a>

        <div className="mt-4">{keluar}</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Layar lebar: laci menetap di kiri. */}
      <aside
        className="hidden w-64 shrink-0 border-r-[1.5px] border-garis lg:block"
        style={{ backgroundColor: "var(--color-putih)" }}
      >
        <div className="sticky top-0 h-dvh">{isi}</div>
      </aside>

      {/* Layar sempit: pita atas dengan tombol laci. */}
      <div
        className="sticky top-0 z-40 flex items-center gap-4 border-b-[1.5px] border-garis px-4 py-4 lg:hidden"
        style={{ backgroundColor: "var(--color-putih)" }}
      >
        <button
          type="button"
          onClick={() => setLaci({ buka: !buka, path })}
          className="grid h-12 w-12 place-items-center rounded-[2px] border-[1.5px] border-garis-tegas text-tinta"
          aria-label={buka ? "Tutup menu" : "Buka menu"}
          aria-expanded={buka}
        >
          {buka ? <IkonSilang className="h-6 w-6" /> : <IkonGaris className="h-6 w-6" />}
        </button>
        <p className="judul-registri text-base text-tinta">Panel pengurus</p>
      </div>

      {buka && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setLaci({ buka: false, path })}
            className="absolute inset-0 bg-[rgba(20,23,28,0.5)]"
          />
          <div
            className="absolute inset-y-0 left-0 w-72 border-r-[1.5px] border-garis"
            style={{ backgroundColor: "var(--color-putih)" }}
          >
            {isi}
          </div>
        </div>
      )}
    </>
  );
}
