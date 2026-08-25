"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import KodeBidang from "./KodeBidang";
import TandaBuka from "./TandaBuka";
import { IkonPanah, IkonPin } from "./Ikon";
import type { Umkm } from "@/lib/types";
import { cariKategori, KATEGORI, KATEGORI_CADANGAN } from "@/lib/kategori";
import { rentangHarga } from "@/lib/format";
import { statusBuka } from "@/lib/jam";
import { useJamKini } from "@/lib/gunakanJam";
import { site } from "@/lib/site";

type Titik = Umkm & { koordinat: NonNullable<Umkm["koordinat"]> };

/** Jarak garis lurus dua titik bumi, dalam kilometer. */
function jarakKm(a: L.LatLngLiteral, b: L.LatLngLiteral): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const rataLat = (((a.lat + b.lat) / 2) * Math.PI) / 180;
  const x = dLng * Math.cos(rataLat);
  return R * Math.sqrt(dLat * dLat + x * x);
}

function tulisJarak(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

/**
 * Isi penanda dan gelembung peta dirakit sebagai untaian HTML — itu yang
 * diminta Leaflet. Data UMKM ditulis pengurus, bukan pengunjung, tapi tetap
 * dijinakkan supaya tanda kutip atau kurung sudut pada nama usaha tidak
 * merusak susunannya.
 */
function aman(teks: string): string {
  return teks
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Gelembung keterangan bidang, hanya dipakai pada peta ringkas di beranda.
 * Pada peta penuh keterangan itu sudah dipikul daftar di sebelah kanan, jadi
 * gelembungnya justru menutupi peta.
 */
function isiGelembung(u: Titik): string {
  const kat = cariKategori(u.kategori) ?? KATEGORI_CADANGAN;
  return `
    <span class="gelembung-nomor">${aman(u.nomor ?? "")} · ${aman(kat.nama)}</span>
    <span class="gelembung-nama">${aman(u.nama)}</span>
    <span class="gelembung-baris">${aman(u.alamat)}</span>
    <span class="gelembung-baris">${aman(rentangHarga(u))}</span>
    <a class="gelembung-tautan" href="/umkm/${encodeURIComponent(u.slug)}">Buka lembar bidang</a>`;
}

/**
 * Penanda peta digambar sebagai patok bidang: kotak kode kategori dan nomor
 * bidangnya. Tidak ada warna yang menanggung arti — kodenya yang menanggung.
 */
function buatPenanda(u: Titik, terpilih: boolean): L.DivIcon {
  const kat = cariKategori(u.kategori) ?? KATEGORI_CADANGAN;
  const garis = terpilih ? "var(--color-resmi)" : "var(--color-tinta)";
  const latar = terpilih ? "var(--color-resmi)" : "var(--color-putih)";
  const tinta = terpilih ? "var(--color-putih)" : "var(--color-tinta)";

  return L.divIcon({
    className: "penanda-bidang",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="
          display:flex;align-items:stretch;
          border:1.5px solid ${garis};
          background:${latar};color:${tinta};
          font-family:var(--font-registri);
          box-shadow:0 1px 3px rgba(20,23,28,.3);
        ">
          <span style="
            display:grid;place-items:center;
            width:20px;height:20px;
            font-weight:700;font-size:11px;
            border-right:1.5px solid ${garis};
          ">${kat.kode}</span>
          <span style="
            padding:0 6px;line-height:20px;white-space:nowrap;
            font-size:11px;font-weight:600;
            font-variant-numeric:tabular-nums;letter-spacing:.05em;
          ">${u.nomor ?? ""}</span>
        </div>
        <div style="width:1.5px;height:10px;background:${garis};"></div>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 32],
  });
}

export default function PetaUmkm({
  daftar,
  ringkas = false,
}: {
  daftar: Umkm[];
  /** Peta pendek tanpa daftar samping, untuk disisipkan di beranda. */
  ringkas?: boolean;
}) {
  const wadah = useRef<HTMLDivElement>(null);
  const peta = useRef<L.Map | null>(null);
  const penanda = useRef<Map<string, L.Marker>>(new Map());
  const penandaSaya = useRef<L.Marker | null>(null);

  const [terpilih, setTerpilih] = useState<string | null>(null);
  const [posisiSaya, setPosisiSaya] = useState<L.LatLngLiteral | null>(null);
  const [statusLokasi, setStatusLokasi] = useState<
    "diam" | "mencari" | "ditolak" | "gagal"
  >("diam");
  const [kategori, setKategori] = useState("semua");
  const [hanyaBuka, setHanyaBuka] = useState(false);

  const kini = useJamKini();
  const acuan = useMemo(
    () => (kini === null ? undefined : new Date(kini)),
    [kini],
  );

  const titik = useMemo(
    () => daftar.filter((u): u is Titik => Boolean(u.koordinat)),
    [daftar],
  );

  const kategoriTersedia = useMemo(() => {
    const dipakai = new Set(titik.map((u) => u.kategori));
    return KATEGORI.filter((k) => dipakai.has(k.nama));
  }, [titik]);

  const tersaring = useMemo(() => {
    return titik.filter((u) => {
      if (kategori !== "semua" && u.kategori !== kategori) return false;
      if (hanyaBuka && statusBuka(u.jam, acuan).keadaan !== "buka")
        return false;
      return true;
    });
  }, [titik, kategori, hanyaBuka, acuan]);

  const berurut = useMemo(() => {
    if (!posisiSaya) return tersaring;
    return [...tersaring].sort(
      (a, b) =>
        jarakKm(posisiSaya, a.koordinat) - jarakKm(posisiSaya, b.koordinat),
    );
  }, [tersaring, posisiSaya]);

  /* ---- Pasang peta sekali ---- */
  useEffect(() => {
    if (!wadah.current || peta.current) return;

    const m = L.map(wadah.current, {
      center: [site.pusatPeta.lat, site.pusatPeta.lng],
      zoom: 16,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; kontributor <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);

    peta.current = m;

    const daftarPenanda = penanda.current;
    return () => {
      m.remove();
      peta.current = null;
      daftarPenanda.clear();
    };
  }, []);

  /* ---- Gambar ulang penanda saat saringan berubah ---- */
  useEffect(() => {
    const m = peta.current;
    if (!m) return;

    for (const p of penanda.current.values()) p.remove();
    penanda.current.clear();

    for (const u of tersaring) {
      const p = L.marker([u.koordinat.lat, u.koordinat.lng], {
        icon: buatPenanda(u, u.slug === terpilih),
        title: `${u.nomor} — ${u.nama}`,
        alt: u.nama,
        riseOnHover: true,
      }).addTo(m);

      if (ringkas) {
        // Tanpa daftar samping, klik penanda harus menjelaskan dirinya sendiri.
        // Penandanya sengaja tidak ikut ditandai terpilih: menandainya menyusun
        // ulang seluruh penanda, dan gelembung yang baru dibuka ikut terbuang
        // bersama penanda lamanya.
        p.bindPopup(isiGelembung(u), { closeButton: false, offset: [0, -30] });
      } else {
        p.on("click", () => setTerpilih(u.slug));
      }

      penanda.current.set(u.slug, p);
    }

    if (tersaring.length > 0 && !terpilih) {
      const batas = L.latLngBounds(
        tersaring.map(
          (u) => [u.koordinat.lat, u.koordinat.lng] as [number, number],
        ),
      );
      m.fitBounds(batas, { padding: [60, 60], maxZoom: 17 });
    }
  }, [tersaring, terpilih, ringkas]);

  /* ---- Titik lokasi pengunjung ---- */
  useEffect(() => {
    const m = peta.current;
    if (!m || !posisiSaya) return;

    penandaSaya.current?.remove();
    penandaSaya.current = L.marker([posisiSaya.lat, posisiSaya.lng], {
      icon: L.divIcon({
        className: "penanda-saya",
        html: `<div style="
          width:18px;height:18px;border-radius:50%;
          background:var(--color-resmi);
          border:3px solid #fff;
          box-shadow:0 0 0 2px var(--color-resmi), 0 1px 3px rgba(20,23,28,.3);
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
      title: "Posisi Anda",
    }).addTo(m);
  }, [posisiSaya]);

  const pilih = useCallback((slug: string) => {
    setTerpilih(slug);
    const u = penanda.current.get(slug);
    const m = peta.current;
    if (u && m) {
      m.setView(u.getLatLng(), Math.max(m.getZoom(), 17), { animate: true });
    }
  }, []);

  const cariSaya = useCallback(() => {
    if (!navigator.geolocation) {
      setStatusLokasi("gagal");
      return;
    }
    setStatusLokasi("mencari");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosisiSaya({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatusLokasi("diam");
      },
      (e) =>
        setStatusLokasi(e.code === e.PERMISSION_DENIED ? "ditolak" : "gagal"),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, []);

  return (
    <div className={ringkas ? "" : "grid gap-6 lg:grid-cols-[1fr_24rem]"}>
      {/* ---- Peta ---- */}
      <div className="lembar overflow-hidden">
        <div className="kop flex flex-wrap items-center gap-2 px-3 py-3">
          <button
            type="button"
            onClick={() => setHanyaBuka((v) => !v)}
            aria-pressed={hanyaBuka}
            className="rounded-[2px] border-[1.5px] px-3 py-1.5 text-sm font-semibold"
            style={{
              borderColor: hanyaBuka
                ? "var(--color-buka)"
                : "var(--color-garis-tegas)",
              backgroundColor: hanyaBuka ? "var(--color-buka)" : "transparent",
              color: hanyaBuka ? "var(--color-putih)" : "var(--color-tinta)",
            }}
          >
            Buka sekarang
          </button>

          {kategoriTersedia.map((k) => {
            const aktif = kategori === k.nama;
            return (
              <button
                key={k.slug}
                type="button"
                onClick={() => setKategori(aktif ? "semua" : k.nama)}
                aria-pressed={aktif}
                aria-label={`Saring kategori ${k.nama}`}
                className="grid h-8 w-8 place-items-center rounded-[2px] border-[1.5px] text-sm font-bold"
                style={{
                  borderColor: aktif
                    ? "var(--color-resmi)"
                    : "var(--color-garis-tegas)",
                  backgroundColor: aktif ? "var(--color-resmi)" : "transparent",
                  color: aktif ? "var(--color-putih)" : "var(--color-tinta)",
                }}
              >
                {k.kode}
              </button>
            );
          })}

          <button
            type="button"
            onClick={cariSaya}
            className="ml-auto inline-flex items-center gap-1.5 rounded-[2px] border-[1.5px] px-3 py-1.5 text-sm font-semibold"
            style={{
              borderColor: "var(--color-resmi)",
              color: "var(--color-resmi)",
            }}
          >
            <IkonPin className="h-4 w-4" />
            {statusLokasi === "mencari" ? "Mencari…" : "Terdekat dari saya"}
          </button>
        </div>

        {(statusLokasi === "ditolak" || statusLokasi === "gagal") && (
          <p className="border-b-[1.5px] border-garis px-3 py-2 text-xs font-semibold text-stempel">
            {statusLokasi === "ditolak"
              ? "Izin lokasi ditolak. Nyalakan izin lokasi di peramban kalau ingin urutan berdasarkan jarak."
              : "Lokasi tidak bisa dibaca. Peta tetap bisa dipakai seperti biasa."}
          </p>
        )}

        <div
          ref={wadah}
          className={
            ringkas
              ? "h-[22rem] w-full sm:h-[27rem]"
              : "h-[62vh] min-h-[26rem] w-full"
          }
          role="application"
          aria-label="Peta letak bidang usaha Sanggrahan"
        />
      </div>

      {/* ---- Daftar bidang ---- */}
      {!ringkas && (
        <div>
          <p className="label-registri">
            {berurut.length} bidang di peta
            {posisiSaya ? " · diurutkan dari yang terdekat" : ""}
          </p>

          <ul className="mt-3 max-h-[62vh] overflow-y-auto border-t-[1.5px] border-garis">
            {berurut.map((u) => {
              const kat = cariKategori(u.kategori) ?? KATEGORI_CADANGAN;
              const aktif = u.slug === terpilih;
              return (
                <li key={u.slug} className="border-b-[1.5px] border-garis">
                  <div
                    className="px-2 py-3 transition-colors"
                    style={{
                      backgroundColor: aktif
                        ? "var(--color-resmi-muda)"
                        : "transparent",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => pilih(u.slug)}
                      aria-pressed={aktif}
                      className="w-full text-left"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="nomor-bidang text-xs text-tinta-lembut">
                          {u.nomor}
                        </span>
                        {posisiSaya && (
                          <span className="angka ml-auto text-xs font-semibold text-tinta">
                            {tulisJarak(jarakKm(posisiSaya, u.koordinat))}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 flex items-center gap-2.5">
                        <KodeBidang kategori={kat} />
                        <span className="judul-registri truncate text-base text-tinta">
                          {u.nama}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs text-tinta-lembut">
                        {u.alamat} · {rentangHarga(u)}
                      </span>
                    </button>

                    <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <TandaBuka jam={u.jam} />
                      <Link
                        href={`/umkm/${u.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-resmi underline underline-offset-4"
                      >
                        Buka lembar
                        <IkonPanah className="h-3 w-3" />
                      </Link>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          {berurut.length === 0 && (
            <p className="border-b-[1.5px] border-garis px-4 py-10 text-center text-sm text-tinta-lembut">
              Tidak ada bidang yang cocok dengan saringan ini.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
