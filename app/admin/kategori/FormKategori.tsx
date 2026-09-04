"use client";

import { useActionState, useRef } from "react";

import {
  AreaTeks,
  PesanGalat,
  PesanSukses,
  Pilihan,
  Teks,
  TombolSimpan,
} from "@/components/admin/Formulir";
import { pembacaNilai } from "@/lib/formulir";
import { ARSIR_KATEGORI, IKON_KATEGORI } from "@/lib/konstanta";
import type { Kategori } from "@/lib/types";

import { simpanKategori, type Hasil } from "./aksi";

export default function FormKategori({
  awal,
  urutanBawaan = 0,
}: {
  awal?: Kategori;
  urutanBawaan?: number;
}) {
  const [status, aksi] = useActionState<Hasil, FormData>(simpanKategori, {});
  const v = pembacaNilai(status.nilai);
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

      <div className="grid gap-4 sm:grid-cols-[2fr_auto_1fr]">
        <Teks label="Nama kategori" nama="nama" wajib nilaiAwal={v("nama", awal?.nama)} />
        <Teks
          label="Kode"
          nama="kode"
          wajib
          maxLength={1}
          size={3}
          nilaiAwal={v("kode", awal?.kode)}
          placeholder="K"
          keterangan="Satu huruf."
        />
        <Teks
          label="Urutan tampil"
          nama="urutan"
          tipe="number"
          nilaiAwal={v("urutan", awal ? awal.urutan : urutanBawaan)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Pilihan
          label="Ikon"
          nama="ikon"
          wajib
          nilaiAwal={v("ikon", awal?.ikon ?? "toko")}
          opsi={IKON_KATEGORI.map((i) => ({ nilai: i.nilai, label: i.label }))}
        />
        <Pilihan
          label="Arsiran"
          nama="arsir"
          wajib
          nilaiAwal={v("arsir", awal?.arsir ?? "arsir-penuh")}
          opsi={ARSIR_KATEGORI.map((a) => ({ nilai: a.nilai, label: a.label }))}
          keterangan="Arsiran inilah yang membedakan kategori tanpa memakai warna."
        />
      </div>

      <AreaTeks
        label="Keterangan"
        nama="deskripsi"
        baris={2}
        nilaiAwal={v("deskripsi", awal?.deskripsi)}
      />

      <Teks
        label="Potongan alamat halaman (slug)"
        nama="slug"
        nilaiAwal={v("slug", awal?.slug)}
        placeholder="Dikosongkan = diambil dari nama kategori"
        keterangan={
          awal
            ? `Alamat sekarang: /kategori/${awal.slug}. Mengubahnya membuat tautan lama tidak berlaku.`
            : undefined
        }
      />

      <TombolSimpan
        label={awal ? "Simpan kategori" : "Tambah kategori"}
        gaya={awal ? "netral" : "utama"}
      />
    </form>
  );
}
