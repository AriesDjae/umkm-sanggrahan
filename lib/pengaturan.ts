import "server-only";

import { cache } from "react";

import { db } from "./db";
import { site } from "./site";

/**
 * Pengaturan situs tersimpan sebagai satu baris (id = 1) dan diubah dari
 * /admin/pengaturan. Nilai di lib/site.ts tetap ada sebagai bawaan: dipakai
 * saat barisnya belum pernah dibuat, dan sebagai teks tetap di komponen client
 * yang tidak bisa menyentuh basis data.
 */
export type PengaturanSitus = {
  nama: string;
  deskripsi: string;
  kampung: string;
  kelurahan: string;
  kemantren: string;
  kota: string;
  logo: string;
  kontakNama: string;
  kontakWhatsapp: string;
  instagram: string;
  facebook: string;
  pusatLat: number;
  pusatLng: number;
  tautanProfilRw: string;
  /** Turunan, supaya halaman tidak merangkainya sendiri-sendiri. */
  wilayah: string;
  wilayahSingkat: string;
};

const BAWAAN: Omit<PengaturanSitus, "wilayah" | "wilayahSingkat"> = {
  nama: site.nama,
  deskripsi: site.deskripsi,
  kampung: site.kampung,
  kelurahan: site.kelurahan,
  kemantren: site.kemantren,
  kota: site.kota,
  logo: site.logo,
  kontakNama: site.kontakPengurus.nama,
  kontakWhatsapp: site.kontakPengurus.whatsapp,
  instagram: site.sosmed.instagram,
  facebook: site.sosmed.facebook,
  pusatLat: site.pusatPeta.lat,
  pusatLng: site.pusatPeta.lng,
  tautanProfilRw: site.profilRw.url,
};

function lengkapi(p: Omit<PengaturanSitus, "wilayah" | "wilayahSingkat">): PengaturanSitus {
  return {
    ...p,
    wilayah: `${p.kampung}, Kelurahan ${p.kelurahan}, Kemantren ${p.kemantren}, ${p.kota}`,
    wilayahSingkat: `${p.kampung.replace(/^Kampung\s+/i, "")}, ${p.kelurahan}, ${p.kemantren}`,
  };
}

/**
 * Dibungkus `cache` supaya satu render halaman hanya sekali menanyakannya ke
 * basis data, walaupun kop, kaki, dan isi halaman sama-sama membutuhkannya.
 *
 * Kegagalan basis data sengaja tidak dilemparkan: kop dan kaki halaman muncul
 * di setiap halaman, dan situs yang tampil dengan nama bawaan jauh lebih baik
 * daripada situs yang tidak tampil sama sekali.
 */
export const pengaturan = cache(async (): Promise<PengaturanSitus> => {
  try {
    const baris = await db.pengaturan.findUnique({ where: { id: 1 } });
    if (!baris) return lengkapi(BAWAAN);
    return lengkapi({
      nama: baris.nama || BAWAAN.nama,
      deskripsi: baris.deskripsi || BAWAAN.deskripsi,
      kampung: baris.kampung || BAWAAN.kampung,
      kelurahan: baris.kelurahan || BAWAAN.kelurahan,
      kemantren: baris.kemantren || BAWAAN.kemantren,
      kota: baris.kota || BAWAAN.kota,
      logo: baris.logo,
      kontakNama: baris.kontakNama || BAWAAN.kontakNama,
      kontakWhatsapp: baris.kontakWhatsapp,
      instagram: baris.instagram,
      facebook: baris.facebook,
      pusatLat: baris.pusatLat,
      pusatLng: baris.pusatLng,
      tautanProfilRw: baris.tautanProfilRw || BAWAAN.tautanProfilRw,
    });
  } catch {
    return lengkapi(BAWAAN);
  }
});
