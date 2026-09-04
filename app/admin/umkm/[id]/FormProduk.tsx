"use client";

import { useActionState, useRef } from "react";

import {
  Berkas,
  PesanGalat,
  PesanSukses,
  Teks,
  TombolSimpan,
} from "@/components/admin/Formulir";
import { pembacaNilai } from "@/lib/formulir";
import type { Produk } from "@/lib/types";

import { simpanProduk, type Hasil } from "../aksi";

/**
 * Satu formulir dipakai dua keperluan: menambah produk baru (di bawah daftar)
 * dan menyunting produk yang sudah ada (di dalam barisnya). Yang membedakan
 * hanya ada-tidaknya `awal`.
 */
export default function FormProduk({
  umkmId,
  awal,
  urutanBawaan = 0,
}: {
  umkmId: number;
  awal?: Produk;
  urutanBawaan?: number;
}) {
  const [status, aksi] = useActionState<Hasil, FormData>(simpanProduk, {});
  const v = pembacaNilai(status.nilai);
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (fd) => {
        await aksi(fd);
        // Formulir "tambah produk" dikosongkan setelah berhasil, supaya
        // pengurus bisa langsung mengetik produk berikutnya.
        if (!awal) ref.current?.reset();
      }}
      className="space-y-4"
    >
      <input type="hidden" name="umkmId" value={umkmId} />
      {awal && <input type="hidden" name="id" value={awal.id} />}

      <PesanGalat pesan={status.galat} />
      <PesanSukses pesan={status.sukses} />

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
        <Teks label="Nama produk" nama="nama" wajib nilaiAwal={v("nama", awal?.nama)} />
        <Teks
          label="Harga"
          nama="harga"
          nilaiAwal={v("harga", awal?.harga)}
          placeholder="15000"
          keterangan="Kosong = “Hubungi penjual”."
        />
        <Teks
          label="Satuan"
          nama="satuan"
          nilaiAwal={v("satuan", awal?.satuan)}
          placeholder="porsi, pcs, kg"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <Teks
          label="Keterangan"
          nama="keterangan"
          nilaiAwal={v("keterangan", awal?.keterangan)}
        />
        <Teks
          label="Urutan tampil"
          nama="urutan"
          tipe="number"
          nilaiAwal={v("urutan", awal ? awal.urutan : urutanBawaan)}
          keterangan="Angka kecil tampil lebih dulu."
        />
      </div>

      <Berkas label="Foto produk" nama="berkasFoto" pratinjau={awal?.foto} />

      <TombolSimpan
        label={awal ? "Simpan produk" : "Tambah produk"}
        gaya={awal ? "netral" : "utama"}
      />
    </form>
  );
}
