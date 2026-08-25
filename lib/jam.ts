import type { JamBuka, Umkm } from "./types";

export const NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
export const HARI_SINGKAT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export type StatusBuka =
  | { keadaan: "buka"; sampai: string; segeraTutup: boolean }
  | { keadaan: "tutup"; alasan: "jam" | "hari"; berikutnya: string | null }
  | { keadaan: "tidak-diketahui" };

function keMenit(jam: string): number | null {
  const m = jam.match(/^(\d{1,2})[:.](\d{2})$/);
  if (!m) return null;
  const jamKe = Number(m[1]);
  const menit = Number(m[2]);
  if (jamKe > 23 || menit > 59) return null;
  return jamKe * 60 + menit;
}

/** Waktu sekarang di Yogyakarta (WIB), berapa pun zona waktu perangkat pengunjung. */
export function sekarangWib(acuan: Date = new Date()): { hari: number; menit: number } {
  const bagian = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(acuan);

  const ambil = (jenis: string) => bagian.find((b) => b.type === jenis)?.value ?? "";
  const petaHari: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    hari: petaHari[ambil("weekday")] ?? 0,
    menit: Number(ambil("hour")) * 60 + Number(ambil("minute")),
  };
}

/**
 * Apakah usaha ini sedang buka?
 * Jam yang melewati tengah malam (misal 17.00–01.00) ikut dihitung benar.
 */
export function statusBuka(jam: JamBuka | undefined, acuan?: Date): StatusBuka {
  if (!jam || !Array.isArray(jam.hari) || jam.hari.length === 0) {
    return { keadaan: "tidak-diketahui" };
  }

  const buka = keMenit(jam.buka);
  const tutup = keMenit(jam.tutup);
  if (buka === null || tutup === null) return { keadaan: "tidak-diketahui" };

  const kini = sekarangWib(acuan);
  const lewatTengahMalam = tutup <= buka;

  const bukaHariIni = jam.hari.includes(kini.hari);
  const bukaKemarin = jam.hari.includes((kini.hari + 6) % 7);

  // Sesi yang dimulai kemarin dan belum berakhir.
  if (lewatTengahMalam && bukaKemarin && kini.menit < tutup) {
    return {
      keadaan: "buka",
      sampai: jam.tutup,
      segeraTutup: tutup - kini.menit <= 60,
    };
  }

  if (bukaHariIni && kini.menit >= buka) {
    const batas = lewatTengahMalam ? 24 * 60 : tutup;
    if (kini.menit < batas) {
      const sisa = batas - kini.menit;
      return {
        keadaan: "buka",
        sampai: jam.tutup,
        segeraTutup: !lewatTengahMalam && sisa <= 60,
      };
    }
  }

  if (bukaHariIni && kini.menit < buka) {
    return { keadaan: "tutup", alasan: "jam", berikutnya: `hari ini ${jam.buka}` };
  }

  // Cari hari buka berikutnya.
  for (let maju = 1; maju <= 7; maju++) {
    const hari = (kini.hari + maju) % 7;
    if (jam.hari.includes(hari)) {
      const label = maju === 1 ? "besok" : NAMA_HARI[hari];
      return { keadaan: "tutup", alasan: "hari", berikutnya: `${label} ${jam.buka}` };
    }
  }

  return { keadaan: "tutup", alasan: "hari", berikutnya: null };
}

/** Ringkasan hari buka: "Senin–Sabtu", "Setiap hari", atau daftar singkat. */
export function ringkasHari(hari: number[]): string {
  if (hari.length === 7) return "Setiap hari";

  const urut = [...new Set(hari)].sort((a, b) => a - b);

  // Deteksi rentang berurutan yang dimulai Senin (pola paling umum di kampung).
  const berurutan = urut.every((h, i) => i === 0 || h === urut[i - 1] + 1);
  if (berurutan && urut.length > 2) {
    return `${NAMA_HARI[urut[0]]}–${NAMA_HARI[urut[urut.length - 1]]}`;
  }

  return urut.map((h) => HARI_SINGKAT[h]).join(", ");
}

/** Satu baris jam buka yang siap dibaca, dari data terstruktur atau teks bebas. */
export function teksJam(u: Umkm): string | null {
  if (u.jam) return `${ringkasHari(u.jam.hari)}, ${u.jam.buka}–${u.jam.tutup}`;
  return u.jamBuka ?? null;
}
