"use client";

import { useSyncExternalStore } from "react";

/**
 * Jam sekarang, tapi hanya di peramban.
 *
 * Halaman ini dibangun statis, jadi saat dirender di server waktunya belum
 * diketahui — dan menebak "buka" lalu meralatnya sedetik kemudian adalah
 * kesalahan yang terlihat oleh pengunjung. Kaitan ini mengembalikan `null`
 * di server dan waktu sungguhan begitu terpasang di peramban.
 *
 * Dipakai lewat useSyncExternalStore supaya tidak perlu memanggil setState
 * di dalam effect, yang memicu render beruntun.
 */

const pendengar = new Set<() => void>();
let cap = 0;
let pengatur: ReturnType<typeof setInterval> | null = null;

function beriTahu() {
  cap = Date.now();
  for (const p of pendengar) p();
}

function berlangganan(panggilBalik: () => void) {
  pendengar.add(panggilBalik);

  if (!pengatur) {
    cap = Date.now();
    // Semenit sekali sudah cukup; ini bukan jam dinding.
    pengatur = setInterval(beriTahu, 60_000);
  }

  return () => {
    pendengar.delete(panggilBalik);
    if (pendengar.size === 0 && pengatur) {
      clearInterval(pengatur);
      pengatur = null;
    }
  };
}

const bacaDiPeramban = () => cap || (cap = Date.now());
const bacaDiServer = () => null;

/**
 * Kembalikan waktu sekarang sebagai angka yang berubah tiap menit,
 * atau `null` selama halaman belum terpasang di peramban.
 */
export function useJamKini(): number | null {
  return useSyncExternalStore(berlangganan, bacaDiPeramban, bacaDiServer);
}
