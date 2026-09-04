"use client";

import { useActionState } from "react";

import {
  AreaTeks,
  Berkas,
  Centang,
  PesanGalat,
  PesanSukses,
  PilihHari,
  Pilihan,
  Teks,
  TombolSimpan,
} from "@/components/admin/Formulir";
import { pembacaBanyakAngka, pembacaCentang, pembacaNilai } from "@/lib/formulir";
import { NAMA_HARI, SUMBER_TITIK } from "@/lib/konstanta";
import type { Kategori, Umkm } from "@/lib/types";

import { simpanUmkm, type Hasil } from "./aksi";

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

export default function FormUmkm({
  awal,
  kategori,
}: {
  awal?: Umkm | null;
  kategori: Kategori[];
}) {
  const [status, aksi] = useActionState<Hasil, FormData>(simpanUmkm, {});
  const v = pembacaNilai(status.nilai);
  const c = pembacaCentang(status.nilai);
  const b = pembacaBanyakAngka(status.banyak);

  const hariAwal = b("hari", awal?.jam?.hari ?? []);

  return (
    <form action={aksi} className="space-y-6">
      {awal && <input type="hidden" name="id" value={awal.id} />}

      <PesanGalat pesan={status.galat} />
      <PesanSukses pesan={status.sukses} />

      <Bagian judul="Identitas bidang">
        <Teks label="Nama usaha" nama="nama" wajib nilaiAwal={v("nama", awal?.nama)} />
        <Teks
          label="Nama pemilik"
          nama="pemilik"
          nilaiAwal={v("pemilik", awal?.pemilik)}
          keterangan="Dipakai pada sapaan pesan WhatsApp yang terkirim dari lembar bidang."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <Pilihan
            label="RW"
            nama="rw"
            wajib
            nilaiAwal={v("rw", awal?.rw ?? 1)}
            opsi={[
              { nilai: 1, label: "RW 1" },
              { nilai: 3, label: "RW 3" },
            ]}
          />
          <Teks label="RT" nama="rt" nilaiAwal={v("rt", awal?.rt)} placeholder="01" />
          <Pilihan
            label="Kategori"
            nama="kategoriId"
            wajib
            kosong="Pilih kategori"
            nilaiAwal={v("kategoriId", awal?.kat.id)}
            opsi={kategori.map((k) => ({ nilai: k.id, label: `${k.kode} · ${k.nama}` }))}
          />
        </div>

        <AreaTeks
          label="Keterangan usaha"
          nama="deskripsi"
          baris={4}
          nilaiAwal={v("deskripsi", awal?.deskripsi)}
          keterangan="Dua sampai tiga kalimat: apa yang dijual, apa keistimewaannya, sejak kapan berdiri."
        />

        {!awal && (
          <Teks
            label="Nomor bidang"
            nama="nomor"
            nilaiAwal={v("nomor")}
            placeholder="Dikosongkan = dibuatkan otomatis"
            keterangan="Bentuknya SGR-01-003. Setelah tersimpan, nomor hanya bisa diubah dari halaman suntingnya."
          />
        )}

        <Teks
          label="Potongan alamat halaman (slug)"
          nama="slug"
          nilaiAwal={v("slug", awal?.slug)}
          placeholder="Dikosongkan = diambil dari nama usaha"
          keterangan={
            awal
              ? `Alamat lembar sekarang: /umkm/${awal.slug}. Mengubahnya membuat tautan lama tidak berlaku.`
              : "Menentukan alamat lembarnya, misalnya /umkm/warung-bu-nur."
          }
        />
      </Bagian>

      <Bagian judul="Kontak dan toko daring">
        <Teks
          label="Nomor WhatsApp"
          nama="whatsapp"
          nilaiAwal={v("whatsapp", awal?.whatsapp)}
          placeholder="0812xxxxxxx"
          keterangan="Boleh ditulis 0812…, +62 812…, atau 62812… — nanti dirapikan sendiri. Kosong berarti lembarnya tampil tanpa tombol pesan."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Teks label="Instagram" nama="instagram" nilaiAwal={v("instagram", awal?.sosmed?.instagram)} />
          <Teks label="Facebook" nama="facebook" nilaiAwal={v("facebook", awal?.sosmed?.facebook)} />
          <Teks label="Shopee" nama="shopee" nilaiAwal={v("shopee", awal?.marketplace?.shopee)} />
          <Teks label="Tokopedia" nama="tokopedia" nilaiAwal={v("tokopedia", awal?.marketplace?.tokopedia)} />
          <Teks label="TikTok Shop" nama="tiktok" nilaiAwal={v("tiktok", awal?.marketplace?.tiktok)} />
          <Teks label="GoFood" nama="gofood" nilaiAwal={v("gofood", awal?.marketplace?.gofood)} />
          <Teks label="GrabFood" nama="grabfood" nilaiAwal={v("grabfood", awal?.marketplace?.grabfood)} />
          <Teks label="Toko daring lainnya" nama="lainnya" nilaiAwal={v("lainnya", awal?.marketplace?.lainnya)} />
        </div>
      </Bagian>

      <Bagian
        judul="Letak"
        keterangan="Bidang tanpa titik koordinat tetap tercatat di registri, tapi tidak muncul di peta."
      >
        <Teks label="Alamat" nama="alamat" nilaiAwal={v("alamat", awal?.alamat)} />
        <Teks
          label="Tautan Google Maps"
          nama="maps"
          nilaiAwal={v("maps", awal?.maps)}
          placeholder="https://maps.app.goo.gl/…"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Teks
            label="Lintang (lat)"
            nama="lat"
            nilaiAwal={v("lat", awal?.koordinat?.lat)}
            placeholder="-7.7947"
          />
          <Teks
            label="Bujur (lng)"
            nama="lng"
            nilaiAwal={v("lng", awal?.koordinat?.lng)}
            placeholder="110.3855"
          />
        </div>

        <Pilihan
          label="Asal titik"
          nama="sumberTitik"
          nilaiAwal={v("sumberTitik", awal?.sumberTitik ?? "gps")}
          opsi={SUMBER_TITIK.map((s) => ({ nilai: s.nilai, label: s.label }))}
          keterangan="Titik dari banner kampung meleset puluhan meter. Situs mengatakannya apa adanya, jadi jangan tandai sebagai GPS kalau memang bukan."
        />
      </Bagian>

      <Bagian
        judul="Jam buka"
        keterangan="Isi lengkap agar bidang ini ikut saringan “hanya yang buka sekarang”. Jam yang melewati tengah malam (misal 17:00–01:00) ikut dihitung benar."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Teks
            label="Jam mulai"
            nama="jamMulai"
            nilaiAwal={v("jamMulai", awal?.jam?.buka)}
            placeholder="08:00"
          />
          <Teks
            label="Jam tutup"
            nama="jamSelesai"
            nilaiAwal={v("jamSelesai", awal?.jam?.tutup)}
            placeholder="17:00"
          />
        </div>

        <PilihHari nama="hari" nilaiAwal={hariAwal} namaHari={NAMA_HARI} />

        <Teks
          label="Keterangan jam bebas"
          nama="jamBuka"
          nilaiAwal={v("jamBuka", awal?.jamBuka)}
          placeholder="Contoh: Buka setelah subuh sampai dagangan habis"
          keterangan="Dipakai kalau jamnya tidak bisa dipatok, dan hanya tampil bila jam terstruktur di atas dikosongkan."
        />
      </Bagian>

      <Bagian judul="Foto dan tampilan">
        <Berkas
          label="Foto usaha"
          nama="berkasFoto"
          pratinjau={awal?.foto}
          keterangan="JPG, PNG, WEBP, atau AVIF, maksimal 4 MB. Dikosongkan berarti foto yang sekarang tetap dipakai."
        />

        <Centang
          label="Tampilkan di situs publik"
          nama="aktif"
          nilaiAwal={c("aktif", awal?.aktif ?? true)}
          keterangan="Dimatikan berarti bidang ini hilang dari registri, peta, dan hasil pencarian — tapi datanya tetap tersimpan."
        />
        <Centang
          label="Jadikan bidang unggulan"
          nama="unggulan"
          nilaiAwal={c("unggulan", awal?.unggulan ?? false)}
          keterangan="Bidang unggulan didahulukan pada cuplikan di beranda."
        />
      </Bagian>

      <TombolSimpan label={awal ? "Simpan perubahan" : "Catat bidang"} />
    </form>
  );
}
