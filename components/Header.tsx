"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IkonGaris, IkonPanah, IkonSilang } from "./Ikon";
import { site } from "@/lib/site";

const menu = [
  { href: "/", label: "Registri" },
  { href: "/umkm", label: "Semua Bidang" },
  { href: "/peta", label: "Peta" },
  { href: "/tentang", label: "Tentang" },
  { href: "/daftar", label: "Daftar Baru" },
];

export default function Header({
  nama,
  logo,
  kelurahan,
  kemantren,
  tautanProfilRw,
}: {
  nama: string;
  logo: string;
  kelurahan: string;
  kemantren: string;
  tautanProfilRw: string;
}) {
  const [buka, setBuka] = useState(false);
  const path = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b-[1.5px] border-garis"
      style={{ backgroundColor: "var(--color-putih)" }}
    >
      <div className="mx-auto flex max-w-[80rem] items-center gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-4" onClick={() => setBuka(false)}>
          {logo ? (
            <Image
              src={logo}
              alt="Logo kelurahan"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          ) : (
            <span
              aria-hidden
              className="grid h-10 w-10 shrink-0 place-items-center border-[1.5px] text-sm font-bold"
              style={{
                borderColor: "var(--color-resmi)",
                color: "var(--color-resmi)",
              }}
            >
              SGR
            </span>
          )}
          <span className="leading-tight">
            <span className="judul-registri block text-lg text-tinta sm:text-xl">
              {nama}
            </span>
            <span className="label-registri mt-2 block">
              {kelurahan} · {kemantren} · RW 1 &amp; 3
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-2 lg:flex">
          {menu.map((m) => {
            const aktif = m.href === "/" ? path === "/" : path.startsWith(m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                aria-current={aktif ? "page" : undefined}
                className="rounded-[2px] px-4 py-2 text-sm font-semibold transition-colors"
                style={
                  aktif
                    ? {
                        backgroundColor: "var(--color-resmi)",
                        color: "var(--color-putih)",
                      }
                    : { color: "var(--color-tinta-lembut)" }
                }
              >
                {m.label}
              </Link>
            );
          })}

          {/*
            Tautan keluar ke situs warga yang satunya. Dipisahkan garis dan
            diberi panah keluar supaya jelas ini meninggalkan registri, bukan
            berpindah halaman di dalamnya.
          */}
          <a
            href={tautanProfilRw}
            className="ml-2 inline-flex items-center gap-2 border-l-[1.5px] border-garis py-2 pl-4 text-sm font-semibold text-tinta-lembut transition-colors hover:text-resmi"
          >
            {site.profilRw.ringkas}
            <IkonPanah aria-hidden className="h-4 w-4" />
            <span className="sr-only">(situs terpisah)</span>
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setBuka((v) => !v)}
          className="ml-auto grid h-12 w-12 place-items-center rounded-[2px] border-[1.5px] border-garis-tegas text-tinta lg:hidden"
          aria-label={buka ? "Tutup menu" : "Buka menu"}
          aria-expanded={buka}
        >
          {buka ? <IkonSilang className="h-6 w-6" /> : <IkonGaris className="h-6 w-6" />}
        </button>
      </div>

      {buka && (
        <nav
          className="border-t-[1.5px] border-garis lg:hidden"
          style={{ backgroundColor: "var(--color-lembar)" }}
        >
          <div className="mx-auto flex max-w-[80rem] flex-col px-4 py-2">
            {menu.map((m) => {
              const aktif = m.href === "/" ? path === "/" : path.startsWith(m.href);
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={() => setBuka(false)}
                  aria-current={aktif ? "page" : undefined}
                  className="border-b-[1.5px] border-garis px-2 py-4 text-base font-semibold last:border-b-0"
                  style={{
                    color: aktif ? "var(--color-resmi)" : "var(--color-tinta)",
                  }}
                >
                  {m.label}
                </Link>
              );
            })}

            <a
              href={tautanProfilRw}
              onClick={() => setBuka(false)}
              className="mt-2 flex items-center gap-2 border-t-[1.5px] border-garis-tegas px-2 py-4 text-base font-semibold text-tinta-lembut"
            >
              {site.profilRw.nama}
              <IkonPanah aria-hidden className="h-4 w-4" />
              <span className="sr-only">(situs terpisah)</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
