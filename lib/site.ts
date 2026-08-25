/**
 * Pengaturan umum situs.
 * Ubah nilai di sini kalau ada perubahan nama, kontak, atau alamat web.
 */
export const site = {
  nama: "Usaha Warga Sanggrahan",

  kampung: "Kampung Sanggrahan",
  kelurahan: "Semaki",
  kemantren: "Umbulharjo",
  kota: "Kota Yogyakarta",
  /** Alamat wilayah lengkap, dipakai di metadata dan data terstruktur. */
  wilayah: "Kampung Sanggrahan, Kelurahan Semaki, Kemantren Umbulharjo, Kota Yogyakarta",
  wilayahSingkat: "Sanggrahan, Semaki, Umbulharjo",

  /** Logo resmi kelurahan. Isi dengan path di public/ begitu berkasnya ada,
   * misalnya "/img/logo-kelurahan.png". Dibiarkan kosong = tidak ditampilkan. */
  logo: "",

  rw: [1, 3],

  // Dijaga di bawah 160 huruf supaya tidak terpotong di hasil pencarian Google.
  deskripsi:
    "Direktori UMKM warga Sanggrahan, Semaki, Umbulharjo, Yogyakarta. Cari yang sedang buka, lihat harganya, lalu pesan langsung lewat WhatsApp.",

  // Ganti setelah web online (dipakai untuk sitemap & pratinjau saat dishare).
  url: "https://umkm-sanggrahan.vercel.app",

  // Kontak pengurus, dipakai di halaman /daftar dan footer.
  kontakPengurus: {
    nama: "Pengurus Usaha Warga Sanggrahan",
    whatsapp: "6281234567890", // TODO: ganti dengan nomor asli pengurus
  },

  /** Titik tengah peta kampung. Perkiraan, ganti kalau sudah ada titik pasti. */
  pusatPeta: { lat: -7.8009, lng: 110.3806 },

  sosmed: {
    instagram: "", // contoh: "https://instagram.com/umkmsanggrahan"
    facebook: "",
  },
} as const;
