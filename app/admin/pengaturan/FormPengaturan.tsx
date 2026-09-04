"use client";

import { useActionState } from "react";

import {
  AreaTeks,
  Berkas,
  Centang,
  PesanGalat,
  PesanSukses,
  Teks,
  TombolSimpan,
} from "@/components/admin/Formulir";
import { pembacaNilai } from "@/lib/formulir";
import type { PengaturanSitus } from "@/lib/pengaturan";
import { site } from "@/lib/site";

import { simpanPengaturan, type Hasil } from "./aksi";

function Bagian({
  judul,
  keterangan,
  children,
}: {
  judul: string;
  keterangan?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="lembar px-6 py-6">
      <legend className="label-registri px-2">{judul}</legend>
      {keterangan && (
        <p className="mb-6 max-w-[62ch] text-sm leading-relaxed text-tinta-lembut">
          {keterangan}
        </p>
      )}
      <div className="space-y-6">{children}</div>
    </fieldset>
  );
}

export default function FormPengaturan({ awal }: { awal: PengaturanSitus }) {
  const [status, aksi] = useActionState<Hasil, FormData>(simpanPengaturan, {});
  const v = pembacaNilai(status.nilai);

  return (
    <form action={aksi} className="space-y-6">
      <PesanGalat pesan={status.galat} />
      <PesanSukses pesan={status.sukses} />

      <Bagian judul="Identitas situs">
        <Teks label="Nama situs" nama="nama" wajib nilaiAwal={v("nama", awal.nama)} />
        <AreaTeks
          label="Keterangan singkat"
          nama="deskripsi"
          baris={3}
          nilaiAwal={v("deskripsi", awal.deskripsi)}
          keterangan="Dipakai sebagai ringkasan di hasil pencarian Google. Jaga di bawah 160 huruf supaya tidak terpotong."
        />

        <Berkas
          label="Logo kelurahan"
          nama="berkasLogo"
          pratinjau={awal.logo || null}
          keterangan="Dikosongkan berarti logo yang sekarang tetap dipakai. Tanpa logo, kop memakai lencana SGR."
        />
        {awal.logo && (
          <Centang
            label="Hapus logo yang sekarang"
            nama="hapusLogo"
            keterangan="Kop kembali memakai lencana SGR."
          />
        )}
      </Bagian>

      <Bagian judul="Wilayah">
        <div className="grid gap-6 sm:grid-cols-2">
          <Teks label="Kampung" nama="kampung" nilaiAwal={v("kampung", awal.kampung)} />
          <Teks label="Kelurahan" nama="kelurahan" nilaiAwal={v("kelurahan", awal.kelurahan)} />
          <Teks label="Kemantren" nama="kemantren" nilaiAwal={v("kemantren", awal.kemantren)} />
          <Teks label="Kota" nama="kota" nilaiAwal={v("kota", awal.kota)} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Teks
            label="Titik tengah peta — lintang"
            nama="pusatLat"
            wajib
            nilaiAwal={v("pusatLat", awal.pusatLat)}
          />
          <Teks
            label="Titik tengah peta — bujur"
            nama="pusatLng"
            wajib
            nilaiAwal={v("pusatLng", awal.pusatLng)}
          />
        </div>
      </Bagian>

      <Bagian
        judul="Kontak pengurus"
        keterangan="Dipakai di halaman pendaftaran dan di kaki setiap halaman. Nomor kosong berarti tombol “Hubungi pengurus” tidak ditampilkan sama sekali, bukan ditampilkan tapi buntu."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Teks
            label="Nama kontak"
            nama="kontakNama"
            nilaiAwal={v("kontakNama", awal.kontakNama)}
          />
          <Teks
            label="Nomor WhatsApp"
            nama="kontakWhatsapp"
            nilaiAwal={v("kontakWhatsapp", awal.kontakWhatsapp)}
            placeholder="0812xxxxxxx"
          />
          <Teks label="Instagram" nama="instagram" nilaiAwal={v("instagram", awal.instagram)} />
          <Teks label="Facebook" nama="facebook" nilaiAwal={v("facebook", awal.facebook)} />
        </div>
      </Bagian>

      <Bagian
        judul="Tautan ke Profil RW Sanggrahan"
        keterangan={`Registri usaha ini dan situs ${site.profilRw.nama} melayani warga yang sama, jadi kop dan kaki halaman saling menautkan. Ubah alamatnya di sini kalau situs itu pindah domain.`}
      >
        <Teks
          label="Alamat situs Profil RW"
          nama="tautanProfilRw"
          nilaiAwal={v("tautanProfilRw", awal.tautanProfilRw)}
          placeholder={site.profilRw.url}
          keterangan="Harus alamat lengkap, diawali https://."
        />
      </Bagian>

      <TombolSimpan label="Simpan pengaturan" />
    </form>
  );
}
