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

export default function PetaLazy({ daftar }: { daftar: Umkm[] }) {
  return <Peta daftar={daftar} />;
}
