"use client";

import { useActionState, useRef } from "react";

import {
  Centang,
  PesanGalat,
  PesanSukses,
  Pilihan,
  Teks,
  TombolSimpan,
} from "@/components/admin/Formulir";
import { pembacaCentang, pembacaNilai } from "@/lib/formulir";
import { LABEL_PERAN, PERAN, type Peran } from "@/lib/konstanta";

import { simpanPengguna, type Hasil } from "./aksi";

export type AkunAwal = {
  id: number;
  nama: string;
  email: string;
  peran: Peran;
  telepon: string | null;
  aktif: boolean;
};

const OPSI_PERAN = Object.values(PERAN).map((p) => ({
  nilai: p,
  label: LABEL_PERAN[p],
}));

export default function FormPengguna({
  awal,
  diriSendiri = false,
}: {
  awal?: AkunAwal;
  diriSendiri?: boolean;
}) {
  const [status, aksi] = useActionState<Hasil, FormData>(simpanPengguna, {});
  const v = pembacaNilai(status.nilai);
  const c = pembacaCentang(status.nilai);
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (fd) => {
        await aksi(fd);
        if (!awal) ref.current?.reset();
      }}
      className="space-y-4"
    >
      {awal && <input type="hidden" name="id" value={awal.id} />}

      <PesanGalat pesan={status.galat} />
      <PesanSukses pesan={status.sukses} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Teks label="Nama" nama="nama" wajib nilaiAwal={v("nama", awal?.nama)} />
        <Teks
          label="Email"
          nama="email"
          tipe="email"
          wajib
          autoComplete="off"
          nilaiAwal={v("email", awal?.email)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Pilihan
          label="Peran"
          nama="peran"
          wajib
          nilaiAwal={v("peran", awal?.peran ?? PERAN.PENGURUS)}
          opsi={OPSI_PERAN}
          keterangan="Pengurus RW mengelola isi registri. Administrator juga mengelola akun dan pengaturan situs."
        />
        <Teks label="Telepon" nama="telepon" nilaiAwal={v("telepon", awal?.telepon)} />
      </div>

      <Teks
        label={awal ? "Sandi baru" : "Sandi"}
        nama="sandi"
        tipe="password"
        wajib={!awal}
        autoComplete="new-password"
        keterangan={
          awal
            ? "Dikosongkan berarti sandi lamanya tetap berlaku."
            : "Minimal 8 karakter. Sampaikan ke pemilik akun lewat jalur pribadi, dan minta ia menggantinya."
        }
      />

      <Centang
        label="Akun aktif"
        nama="aktif"
        nilaiAwal={c("aktif", awal?.aktif ?? true)}
        keterangan="Dimatikan berarti orang ini tidak bisa masuk, tanpa perlu menghapus akunnya."
      />

      {diriSendiri && (
        <p className="text-xs text-tinta-lembut">
          Ini akun Anda sendiri. Perannya tidak bisa diturunkan dan akunnya tidak
          bisa dinonaktifkan dari sini.
        </p>
      )}

      <TombolSimpan
        label={awal ? "Simpan akun" : "Tambah akun"}
        gaya={awal ? "netral" : "utama"}
      />
    </form>
  );
}
