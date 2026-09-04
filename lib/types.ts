export type Produk = {
  id: number;
  nama: string;
  harga: number | null;
  satuan?: string;
  foto?: string;
  keterangan?: string;
  /** Angka kecil tampil lebih dulu. */
  urutan: number;
};

/**
 * Jam buka dalam bentuk terstruktur, supaya situs bisa menjawab
 * "buka nggak sekarang" tanpa pengunjung harus membaca dulu.
 * hari: 0 = Minggu, 1 = Senin, … 6 = Sabtu.
 */
export type JamBuka = {
  buka: string;
  tutup: string;
  hari: number[];
};

export type Koordinat = {
  lat: number;
  lng: number;
};

/**
 * Kategori bidang usaha.
 *
 * Di registri ini kategori TIDAK dibedakan oleh warna, melainkan oleh kode
 * huruf dan arsirannya. `ikon` menunjuk komponen di components/Ikon.tsx dan
 * `arsir` menunjuk kelas di app/globals.css, jadi keduanya hanya boleh diisi
 * dari daftar di lib/konstanta.ts.
 */
export type Kategori = {
  id: number;
  slug: string;
  nama: string;
  /** Satu huruf kode bidang, dicetak di kolom kode. */
  kode: string;
  ikon: string;
  arsir: string;
  deskripsi: string;
  urutan: number;
};

export type Umkm = {
  id: number;
  slug: string;
  /** Nomor bidang di registri, misalnya "SGR-01-003". */
  nomor: string;
  nama: string;
  pemilik: string;
  rw: number;
  rt?: string;
  /** Nama kategori — dipakai untuk menyaring dan mencari. */
  kategori: string;
  /** Kategori lengkap, sudah diselesaikan di server supaya komponen client
   * tidak perlu memuat seluruh daftar kategori sendiri. */
  kat: Kategori;
  deskripsi: string;
  alamat: string;
  maps?: string;
  koordinat?: Koordinat;
  /**
   * Asal titik lokasi. "osm" dan "gps" adalah titik sebenarnya; "perkiraan-banner"
   * ditarik dari pin di banner peta kampung dan meleset puluhan meter, jadi
   * situs harus mengatakannya, bukan memajangnya seolah hasil ukur.
   */
  sumberTitik?: "gps" | "osm" | "perkiraan-banner";
  jam?: JamBuka;
  /** Keterangan jam bebas, dipakai kalau `jam` belum diisi. */
  jamBuka?: string;
  whatsapp: string;
  marketplace?: {
    shopee?: string;
    tokopedia?: string;
    tiktok?: string;
    gofood?: string;
    grabfood?: string;
    lainnya?: string;
  };
  sosmed?: { instagram?: string; facebook?: string };
  foto?: string;
  produk: Produk[];
  unggulan?: boolean;
  aktif?: boolean;
};
