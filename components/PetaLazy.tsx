"use client";

import dynamic from "next/dynamic";
import type { Umkm } from "@/lib/types";

/**
 * Leaflet membaca `window` begitu modulnya dimuat, jadi peta hanya boleh
 * dimuat di peramban. Pembungkus ini yang menahannya supaya halaman tetap
 * bisa dibangun statis.
 */
const Peta = dynamic(() => import("./PetaUmkm"), {
  ssr: false,
  loading: () => (
    <div className="lembar grid h-[62vh] min-h-[26rem] place-items-center">
      <p className="label-registri">Memuat peta…</p>
    </div>
  ),
});

/** Sama, tapi setinggi peta ringkas — supaya beranda tidak melonjak saat peta masuk. */
const PetaRingkas = dynamic(() => import("./PetaUmkm"), {
  ssr: false,
  loading: () => (
    <div className="lembar grid h-[25rem] place-items-center sm:h-[30rem]">
      <p className="label-registri">Memuat peta…</p>
    </div>
  ),
});

export default function PetaLazy({
  daftar,
  ringkas = false,
}: {
  daftar: Umkm[];
  ringkas?: boolean;
}) {
  return ringkas ? (
    <PetaRingkas daftar={daftar} ringkas />
  ) : (
    <Peta daftar={daftar} />
  );
}
