/**
 * Pembantu formulir server action.
 *
 * React 19 mengosongkan formulir tak terkendali setiap kali sebuah action
 * selesai dijalankan. Bila action menolak masukan, isian yang sudah diketik
 * pengurus ikut hilang. Karena itu setiap action mengembalikan kembali nilai
 * yang dikirim melalui `nilai`, lalu formulir memakainya sebagai nilai awal.
 */

export type HasilAksi = {
  galat?: string;
  sukses?: string;
  /** Nilai teks yang dikirim pengguna, untuk mengisi ulang formulir saat gagal. */
  nilai?: Record<string, string>;
  /**
   * Bidang yang boleh dikirim berkali-kali dengan nama sama — sederet kotak
   * centang, misalnya. `nilai` hanya menyimpan yang terakhir, jadi tanpa ini
   * pilihan hari akan hilang setiap kali sebuah action menolak masukan.
   */
  banyak?: Record<string, string[]>;
};

/** Mengambil seluruh bidang teks dari FormData (berkas diabaikan). */
export function nilaiForm(formData: FormData): Record<string, string> {
  const hasil: Record<string, string> = {};
  for (const [kunci, nilai] of formData.entries()) {
    if (typeof nilai === "string") hasil[kunci] = nilai;
  }
  return hasil;
}

/** Mengambil seluruh nilai sebuah bidang yang dikirim berkali-kali. */
export function banyakNilai(formData: FormData, ...nama: string[]): Record<string, string[]> {
  const hasil: Record<string, string[]> = {};
  for (const n of nama) {
    hasil[n] = formData.getAll(n).filter((v): v is string => typeof v === "string");
  }
  return hasil;
}

/**
 * Pembaca nilai awal untuk komponen formulir: memakai nilai kiriman terakhir
 * bila ada, selain itu memakai nilai bawaan dari basis data.
 */
export function pembacaNilai(nilai: Record<string, string> | undefined) {
  return (nama: string, bawaan?: string | number | null) => {
    const dikirim = nilai?.[nama];
    return dikirim !== undefined ? dikirim : (bawaan ?? undefined);
  };
}

/** Pembaca daftar angka untuk sederet kotak centang. */
export function pembacaBanyakAngka(banyak: Record<string, string[]> | undefined) {
  return (nama: string, bawaan: number[]) => {
    const dikirim = banyak?.[nama];
    if (!dikirim) return bawaan;
    return dikirim.map(Number).filter(Number.isInteger);
  };
}

/** Versi untuk kotak centang: "on" bila dicentang. */
export function pembacaCentang(nilai: Record<string, string> | undefined) {
  return (nama: string, bawaan: boolean) => (nilai ? nilai[nama] === "on" : bawaan);
}

/** Teks polos dari FormData, sudah dirapikan tepinya. */
export function teks(formData: FormData, nama: string): string {
  return String(formData.get(nama) ?? "").trim();
}

/** Angka dari FormData; null bila kosong atau bukan angka. */
export function angka(formData: FormData, nama: string): number | null {
  const mentah = teks(formData, nama).replace(/[^\d.-]/g, "");
  if (!mentah) return null;
  const n = Number(mentah);
  return Number.isFinite(n) ? n : null;
}
