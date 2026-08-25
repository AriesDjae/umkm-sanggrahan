/** Fungsi bantu tampilan — aman dipakai di komponen client maupun server. */
import type { Produk, Umkm } from "./types";
import { site } from "./site";

export function formatRupiah(harga: number | null | undefined): string {
  if (harga === null || harga === undefined) return "Hubungi penjual";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(harga);
}

/** Rentang harga sebuah UMKM, untuk ditampilkan di kartu daftar. */
export function rentangHarga(u: Umkm): string {
  const harga = u.produk
    .map((p) => p.harga)
    .filter((h): h is number => typeof h === "number");
  if (harga.length === 0) return "Hubungi penjual";
  const min = Math.min(...harga);
  const max = Math.max(...harga);
  return min === max ? formatRupiah(min) : `${formatRupiah(min)} – ${formatRupiah(max)}`;
}

/** Bikin tautan WhatsApp lengkap dengan pesan yang sudah terisi. */
export function tautanWa(nomor: string, pesan: string): string {
  const bersih = nomor.replace(/\D/g, "");
  return `https://wa.me/${bersih}?text=${encodeURIComponent(pesan)}`;
}

export function pesanTanyaUmkm(u: Umkm): string {
  return `Halo ${u.pemilik}, saya menemukan ${u.nama} di web ${site.nama}. Saya ingin bertanya soal produknya.`;
}

export function pesanPesanProduk(u: Umkm, produk: Produk): string {
  return `Halo ${u.pemilik}, saya menemukan ${u.nama} di web ${site.nama}. Saya ingin memesan "${produk.nama}". Apakah masih tersedia?`;
}

export function fotoUtama(u: Umkm): string | undefined {
  return u.foto || u.produk.find((p) => p.foto)?.foto || undefined;
}

/** Potong teks panjang untuk kartu ringkas. */
export function ringkas(teks: string, batas = 120): string {
  if (teks.length <= batas) return teks;
  return teks.slice(0, teks.lastIndexOf(" ", batas)).trimEnd() + "…";
}
