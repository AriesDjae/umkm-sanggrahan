"use client";

import { useMemo, useState } from "react";
import BarisBidang from "./BarisBidang";
import KodeBidang from "./KodeBidang";
import { IkonCari, IkonSilang } from "./Ikon";
import type { Umkm } from "@/lib/types";
import { KATEGORI } from "@/lib/kategori";
import { statusBuka } from "@/lib/jam";
import { useJamKini } from "@/lib/gunakanJam";

export default function PencarianUmkm({ daftar }: { daftar: Umkm[] }) {
  const [kata, setKata] = useState("");
  const [kategori, setKategori] = useState("semua");
  const [rw, setRw] = useState("semua");
  const [hanyaBuka, setHanyaBuka] = useState(false);

  // Jam sekarang hanya ada di peramban; halaman ini dibangun statis.
  const kini = useJamKini();
  // Dibungkus useMemo supaya objek Date-nya tidak baru tiap render,
  // yang akan membatalkan seluruh perhitungan di bawahnya.
  const acuan = useMemo(() => (kini === null ? undefined : new Date(kini)), [kini]);

  const rwTersedia = useMemo(
    () => [...new Set(daftar.map((u) => u.rw))].sort((a, b) => a - b),
    [daftar],
  );

  const kategoriTersedia = useMemo(() => {
    const dipakai = new Set(daftar.map((u) => u.kategori));
    return KATEGORI.filter((k) => dipakai.has(k.nama));
  }, [daftar]);

  const jumlahBuka = useMemo(() => {
    if (!acuan) return null;
    return daftar.filter((u) => statusBuka(u.jam, acuan).keadaan === "buka").length;
  }, [daftar, acuan]);

  const hasil = useMemo(() => {
    const q = kata.trim().toLowerCase();
    return daftar.filter((u) => {
      if (kategori !== "semua" && u.kategori !== kategori) return false;
      if (rw !== "semua" && String(u.rw) !== rw) return false;
      if (hanyaBuka && statusBuka(u.jam, acuan).keadaan !== "buka") return false;
      if (!q) return true;
      const teks = [
        u.nomor ?? "",
        u.nama,
        u.pemilik,
        u.kategori,
        u.deskripsi,
        u.alamat,
        ...u.produk.map((p) => p.nama),
      ]
        .join(" ")
        .toLowerCase();
      return teks.includes(q);
    });
  }, [daftar, kata, kategori, rw, hanyaBuka, acuan]);

  const adaFilter = kata !== "" || kategori !== "semua" || rw !== "semua" || hanyaBuka;

  const keteranganSaring = [
    hanyaBuka ? "sedang buka" : null,
    kategori !== "semua" ? kategori.toLowerCase() : null,
    rw !== "semua" ? `RW ${rw}` : null,
    kata.trim() ? `kata “${kata.trim()}”` : null,
  ].filter(Boolean);

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
      {/* ---- Kunci keterangan: menempel, tidak pernah ikut tergulir ---- */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="label-registri">Kunci kategori</h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 lg:flex-col lg:gap-1">
          {kategoriTersedia.map((k) => {
            const aktif = kategori === k.nama;
            return (
              <li key={k.slug}>
                <button
                  type="button"
                  onClick={() => setKategori(aktif ? "semua" : k.nama)}
                  aria-pressed={aktif}
                  className="flex w-full items-center gap-2.5 rounded-[2px] px-2 py-1.5 text-left text-sm transition-colors"
                  style={{
                    backgroundColor: aktif ? "var(--color-resmi-muda)" : "transparent",
                    color: aktif ? "var(--color-resmi)" : "var(--color-tinta)",
                    fontWeight: aktif ? 600 : 400,
                  }}
                >
                  <KodeBidang kategori={k} />
                  {k.nama}
                </button>
              </li>
            );
          })}
        </ul>

        {rwTersedia.length > 1 && (
          <>
            <h2 className="label-registri mt-7">Wilayah</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {rwTersedia.map((r) => {
                const aktif = rw === String(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRw(aktif ? "semua" : String(r))}
                    aria-pressed={aktif}
                    className="rounded-[2px] border-[1.5px] px-3 py-1.5 text-sm font-semibold"
                    style={{
                      borderColor: aktif
                        ? "var(--color-resmi)"
                        : "var(--color-garis-tegas)",
                      backgroundColor: aktif ? "var(--color-resmi)" : "transparent",
                      color: aktif ? "var(--color-putih)" : "var(--color-tinta)",
                    }}
                  >
                    RW {r}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </aside>

      {/* ---- Lembar registri ---- */}
      <div className="lembar">
        <div className="kop px-3 py-4 sm:px-4">
          <label htmlFor="cari" className="sr-only">
            Cari bidang usaha
          </label>
          <div className="relative">
            <IkonCari className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-tinta-lembut" />
            <input
              id="cari"
              type="search"
              value={kata}
              onChange={(e) => setKata(e.target.value)}
              placeholder="Cari nama usaha, produk, atau nomor bidang…"
              className="w-full rounded-[2px] border-[1.5px] border-garis-tegas bg-lembar py-3 pr-3 pl-11 text-base text-tinta placeholder:text-tinta-lembut"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setHanyaBuka((v) => !v)}
              aria-pressed={hanyaBuka}
              className="inline-flex items-center gap-2 rounded-[2px] border-[1.5px] px-3 py-2 text-sm font-semibold"
              style={{
                borderColor: hanyaBuka ? "var(--color-buka)" : "var(--color-garis-tegas)",
                backgroundColor: hanyaBuka ? "var(--color-buka)" : "transparent",
                color: hanyaBuka ? "var(--color-putih)" : "var(--color-tinta)",
              }}
            >
              Hanya yang buka sekarang
              {jumlahBuka !== null && (
                <span className="angka opacity-80">({jumlahBuka})</span>
              )}
            </button>

            {adaFilter && (
              <button
                type="button"
                onClick={() => {
                  setKata("");
                  setKategori("semua");
                  setRw("semua");
                  setHanyaBuka(false);
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-tinta-lembut underline underline-offset-4"
              >
                <IkonSilang className="h-4 w-4" />
                Atur ulang
              </button>
            )}
          </div>
        </div>

        {/* Pita keadaan: satu kendali merambat ke seluruh lembar */}
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-[1.5px] border-garis px-3 py-2.5 sm:px-4"
          style={{
            backgroundColor: adaFilter ? "var(--color-resmi-muda)" : "var(--color-lembar)",
          }}
        >
          <p
            className="label-registri"
            style={{ color: adaFilter ? "var(--color-resmi)" : undefined }}
          >
            {adaFilter
              ? `Registri disaring — ${keteranganSaring.join(", ")}`
              : "Seluruh registri"}
          </p>
          <p className="angka text-sm text-tinta">
            <strong className="font-semibold">{hasil.length}</strong> dari {daftar.length}{" "}
            bidang
          </p>
        </div>

        {hasil.length > 0 ? (
          <>
            <h2 className="sr-only">Daftar bidang usaha</h2>
            <ul className="[&>li:last-child]:border-b-0">
              {hasil.map((u, i) => (
                <BarisBidang key={u.slug} umkm={u} urutan={i} />
              ))}
            </ul>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="judul-registri text-xl text-tinta">
              Tidak ada bidang yang cocok
            </p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-tinta-lembut">
              {hanyaBuka
                ? "Tidak ada usaha yang sedang buka dengan saringan ini. Coba matikan “Hanya yang buka sekarang”."
                : "Coba kata kunci lain, atau atur ulang penyaringnya."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
