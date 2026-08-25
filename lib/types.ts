export type Produk = {
  nama: string;
  harga: number | null;
  satuan?: string;
  foto?: string;
  keterangan?: string;
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

export type Umkm = {
  slug: string;
  /** Nomor bidang di registri, misalnya "SGR-01-003". Diisi otomatis kalau kosong. */
  nomor?: string;
  nama: string;
  pemilik: string;
  rw: number;
  rt?: string;
  kategori: string;
  deskripsi: string;
  alamat: string;
  maps?: string;
  koordinat?: Koordinat;
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
