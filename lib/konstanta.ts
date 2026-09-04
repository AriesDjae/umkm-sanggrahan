/** Nilai-nilai tetap yang dipakai di seluruh aplikasi. */

export const PERAN = {
  ADMIN: "ADMIN",
  PENGURUS: "PENGURUS",
} as const;

export type Peran = (typeof PERAN)[keyof typeof PERAN];

export const LABEL_PERAN: Record<Peran, string> = {
  ADMIN: "Administrator",
  PENGURUS: "Pengurus RW",
};

/** Peran yang boleh mengelola isi registri (bidang usaha, produk, kategori). */
export const PERAN_PENGELOLA: Peran[] = [PERAN.ADMIN, PERAN.PENGURUS];

/** Hanya administrator yang boleh mengelola akun dan pengaturan situs. */
export const PERAN_PENYELIA: Peran[] = [PERAN.ADMIN];

/**
 * Ikon kategori yang tersedia. Nilainya menunjuk komponen nyata di
 * components/Ikon.tsx, jadi tidak boleh diketik bebas dari formulir.
 */
export const IKON_KATEGORI = [
  { nilai: "mangkuk", label: "Mangkuk (kuliner)" },
  { nilai: "anyaman", label: "Anyaman (kerajinan)" },
  { nilai: "gunting", label: "Gunting (fashion & konveksi)" },
  { nilai: "daun", label: "Daun (pertanian & ternak)" },
  { nilai: "kunci", label: "Kunci pas (jasa)" },
  { nilai: "toko", label: "Toko (umum)" },
] as const;

/**
 * Enam arsiran pembeda kategori. Nilainya menunjuk kelas CSS nyata di
 * app/globals.css. Inilah yang menggantikan warna sebagai penanda kategori.
 */
export const ARSIR_KATEGORI = [
  { nilai: "arsir-miring-rapat", label: "Miring rapat" },
  { nilai: "arsir-silang", label: "Silang" },
  { nilai: "arsir-tegak", label: "Tegak" },
  { nilai: "arsir-titik", label: "Titik" },
  { nilai: "arsir-miring-renggang", label: "Miring renggang" },
  { nilai: "arsir-penuh", label: "Penuh" },
] as const;

export const NAMA_IKON = IKON_KATEGORI.map((i) => i.nilai) as readonly string[];
export const NAMA_ARSIR = ARSIR_KATEGORI.map((a) => a.nilai) as readonly string[];

/** Asal titik koordinat sebuah bidang. */
export const SUMBER_TITIK = [
  { nilai: "gps", label: "GPS — diukur di tempat" },
  { nilai: "osm", label: "OpenStreetMap — titik resmi peta" },
  { nilai: "perkiraan-banner", label: "Perkiraan dari banner kampung (meleset puluhan meter)" },
] as const;

export const NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/** RW yang tercakup registri ini. */
export const DAFTAR_RW = [1, 3];
