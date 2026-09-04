/**
 * Nilai bawaan situs.
 *
 * Sejak ada panel pengurus, sebagian besar nilai di sini bisa diubah dari
 * /admin/pengaturan dan tersimpan di basis data — lihat lib/pengaturan.ts.
 * Berkas ini tetap dipakai untuk dua hal: sebagai bawaan saat pengaturannya
 * belum pernah disimpan, dan sebagai sumber nilai bagi komponen client, yang
 * tidak bisa menyentuh basis data.
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

  /** Titik tengah peta kampung, di antara sebaran bidang RW 1 dan RW 3. */
  pusatPeta: { lat: -7.7935, lng: 110.3858 },

  sosmed: {
    instagram: "", // contoh: "https://instagram.com/umkmsanggrahan"
    facebook: "",
  },

  /**
   * Situs Profil RW Sanggrahan — kependudukan, kegiatan, dan laporan kas RW.
   * Registri usaha ini berdiri sendiri, tetapi keduanya melayani warga yang
   * sama, jadi kop dan kaki halaman saling menautkan.
   * Alamatnya bisa diubah dari /admin/pengaturan.
   */
  profilRw: {
    nama: "Profil RW Sanggrahan",
    ringkas: "Profil RW",
    keterangan: "Kependudukan, kegiatan, dan laporan kas RW",
    url: "https://profil-rw-sanggrahan.vercel.app",
  },
} as const;
