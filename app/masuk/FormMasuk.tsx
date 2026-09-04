"use client";

import { useActionState } from "react";

import { PesanGalat, Teks, TombolSimpan } from "@/components/admin/Formulir";
import { pembacaNilai } from "@/lib/formulir";

import { masuk, type Hasil } from "./aksi";

export default function FormMasuk({ lanjut }: { lanjut: string }) {
  const [status, aksi] = useActionState<Hasil, FormData>(masuk, {});
  const v = pembacaNilai(status.nilai);

  return (
    <form action={aksi} className="space-y-6">
      <input type="hidden" name="lanjut" value={lanjut} />
      <PesanGalat pesan={status.galat} />

      <Teks
        label="Email"
        nama="email"
        tipe="email"
        wajib
        autoComplete="username"
        nilaiAwal={v("email")}
      />
      <Teks
        label="Sandi"
        nama="sandi"
        tipe="password"
        wajib
        autoComplete="current-password"
      />

      <TombolSimpan label="Masuk" labelProses="Memeriksa…" />
    </form>
  );
}
