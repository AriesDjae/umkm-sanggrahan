"use client";

import { useActionState } from "react";

import { PesanGalat, PesanSukses, Teks, TombolSimpan } from "@/components/admin/Formulir";
import { pembacaNilai } from "@/lib/formulir";

import { ubahNomor, type Hasil } from "../aksi";

/**
 * Nomor bidang dipisahkan dari formulir utama dengan sengaja.
 *
 * Nomor adalah identitas bidang di registri — dicetak, dicatat pengurus, dan
 * disebut warga. Menaruhnya di antara puluhan isian lain membuatnya bisa
 * tergeser tanpa disadari saat seseorang hanya bermaksud memperbaiki alamat.
 */
export default function FormNomor({ id, nomor }: { id: number; nomor: string }) {
  const [status, aksi] = useActionState<Hasil, FormData>(ubahNomor, {});
  const v = pembacaNilai(status.nilai);

  return (
    <form action={aksi} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <PesanGalat pesan={status.galat} />
      <PesanSukses pesan={status.sukses} />

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1">
          <Teks label="Nomor bidang" nama="nomor" nilaiAwal={v("nomor", nomor)} />
        </div>
        <TombolSimpan label="Ubah nomor" gaya="netral" />
      </div>
    </form>
  );
}
