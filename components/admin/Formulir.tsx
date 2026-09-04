"use client";

import { useFormStatus } from "react-dom";

/**
 * Bidang isian panel pengurus.
 *
 * Bentuknya mengikuti registri: kotak bergaris 1.5px, sudut hampir siku, label
 * kapital kecil. Panel ini memang bukan halaman pengunjung, tetapi orang yang
 * memakainya adalah orang yang sama — tidak ada gunanya ia terasa seperti
 * aplikasi lain.
 */
const KELAS_INPUT =
  "w-full rounded-[2px] border-[1.5px] border-garis-tegas bg-[var(--color-putih)] px-4 py-4 text-sm text-tinta outline-none transition placeholder:text-tinta-lembut/70 focus:border-resmi focus:ring-2 focus:ring-[var(--color-resmi-muda)] disabled:bg-[var(--color-lembar)] disabled:text-tinta-lembut";

export function Bidang({
  label,
  nama,
  keterangan,
  wajib,
  anak,
}: {
  label: string;
  nama: string;
  keterangan?: string;
  wajib?: boolean;
  anak: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={nama} className="label-registri mb-2 block">
        {label}
        {wajib && (
          <span className="ml-2 text-[var(--color-stempel)]" aria-hidden>
            *
          </span>
        )}
      </label>
      {anak}
      {keterangan && <p className="mt-2 text-xs text-tinta-lembut">{keterangan}</p>}
    </div>
  );
}

export function Teks({
  label,
  nama,
  keterangan,
  wajib,
  tipe = "text",
  nilaiAwal,
  placeholder,
  ...sisa
}: {
  label: string;
  nama: string;
  keterangan?: string;
  wajib?: boolean;
  tipe?: string;
  nilaiAwal?: string | number | null;
  placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Bidang
      label={label}
      nama={nama}
      keterangan={keterangan}
      wajib={wajib}
      anak={
        <input
          id={nama}
          name={nama}
          type={tipe}
          required={wajib}
          defaultValue={nilaiAwal ?? undefined}
          placeholder={placeholder}
          className={KELAS_INPUT}
          {...sisa}
        />
      }
    />
  );
}

export function AreaTeks({
  label,
  nama,
  keterangan,
  wajib,
  nilaiAwal,
  baris = 5,
  placeholder,
}: {
  label: string;
  nama: string;
  keterangan?: string;
  wajib?: boolean;
  nilaiAwal?: string | number | null;
  baris?: number;
  placeholder?: string;
}) {
  return (
    <Bidang
      label={label}
      nama={nama}
      keterangan={keterangan}
      wajib={wajib}
      anak={
        <textarea
          id={nama}
          name={nama}
          rows={baris}
          required={wajib}
          defaultValue={nilaiAwal ?? undefined}
          placeholder={placeholder}
          className={`${KELAS_INPUT} leading-relaxed`}
        />
      }
    />
  );
}

export function Pilihan({
  label,
  nama,
  opsi,
  keterangan,
  wajib,
  nilaiAwal,
  kosong,
  disabled,
}: {
  label: string;
  nama: string;
  opsi: readonly { nilai: string | number; label: string }[];
  keterangan?: string;
  wajib?: boolean;
  nilaiAwal?: string | number | null;
  kosong?: string;
  disabled?: boolean;
}) {
  return (
    <Bidang
      label={label}
      nama={nama}
      keterangan={keterangan}
      wajib={wajib}
      anak={
        // key memaksa <select> mengambil defaultValue yang baru setelah
        // sebuah action selesai; tanpa itu React mempertahankan pilihan lama.
        <select
          key={String(nilaiAwal ?? "")}
          id={nama}
          name={nama}
          required={wajib}
          disabled={disabled}
          defaultValue={nilaiAwal ?? ""}
          className={KELAS_INPUT}
        >
          {kosong && <option value="">{kosong}</option>}
          {opsi.map((o) => (
            <option key={o.nilai} value={o.nilai}>
              {o.label}
            </option>
          ))}
        </select>
      }
    />
  );
}

export function Berkas({
  label,
  nama,
  keterangan,
  terima = "image/jpeg,image/png,image/webp,image/avif",
  pratinjau,
}: {
  label: string;
  nama: string;
  keterangan?: string;
  terima?: string;
  pratinjau?: string | null;
}) {
  return (
    <Bidang
      label={label}
      nama={nama}
      keterangan={keterangan}
      anak={
        <div className="flex items-center gap-4">
          {pratinjau && (
            /* eslint-disable-next-line @next/next/no-img-element --
               pratinjau bisa berupa URL Vercel Blob yang belum terdaftar di
               next.config, dan ini hanya thumbnail di panel pengurus. */
            <img
              src={pratinjau}
              alt=""
              className="h-16 w-24 shrink-0 border-[1.5px] border-garis-tegas object-cover"
            />
          )}
          <input
            id={nama}
            name={nama}
            type="file"
            accept={terima}
            className="w-full text-sm text-tinta-lembut file:mr-4 file:rounded-[2px] file:border-[1.5px] file:border-garis-tegas file:bg-[var(--color-lembar)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-tinta"
          />
        </div>
      }
    />
  );
}

export function Centang({
  label,
  nama,
  keterangan,
  nilaiAwal,
}: {
  label: string;
  nama: string;
  keterangan?: string;
  nilaiAwal?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 border-[1.5px] border-garis-tegas bg-[var(--color-putih)] p-4">
      <span className="flex h-6 shrink-0 items-center">
        <input
          key={String(nilaiAwal)}
          id={nama}
          name={nama}
          type="checkbox"
          defaultChecked={nilaiAwal}
          className="h-4 w-4 accent-[var(--color-resmi)]"
        />
      </span>
      <span>
        <span className="block text-sm font-semibold text-tinta">{label}</span>
        {keterangan && (
          <span className="mt-2 block text-xs text-tinta-lembut">{keterangan}</span>
        )}
      </span>
    </label>
  );
}

/** Sederet kotak centang hari, 0 = Minggu … 6 = Sabtu. */
export function PilihHari({
  nama,
  nilaiAwal,
  namaHari,
}: {
  nama: string;
  nilaiAwal: number[];
  namaHari: string[];
}) {
  return (
    <fieldset>
      <legend className="label-registri mb-2">Hari buka</legend>
      <div className="flex flex-wrap gap-2">
        {namaHari.map((h, i) => (
          <label
            key={h}
            className="flex cursor-pointer items-center gap-2 border-[1.5px] border-garis-tegas bg-[var(--color-putih)] px-4 py-2 text-sm text-tinta"
          >
            <input
              key={`${h}-${nilaiAwal.includes(i)}`}
              type="checkbox"
              name={nama}
              value={i}
              defaultChecked={nilaiAwal.includes(i)}
              className="h-4 w-4 accent-[var(--color-resmi)]"
            />
            {h}
          </label>
        ))}
      </div>
      <p className="mt-2 text-xs text-tinta-lembut">
        Kosongkan semuanya kalau jam buka belum didata. Tanda “buka sekarang”
        hanya muncul kalau hari, jam mulai, dan jam tutup terisi lengkap.
      </p>
    </fieldset>
  );
}

export function TombolSimpan({
  label = "Simpan",
  labelProses = "Menyimpan…",
  gaya = "utama",
}: {
  label?: string;
  labelProses?: string;
  gaya?: "utama" | "bahaya" | "netral";
}) {
  const { pending } = useFormStatus();
  const kelas = {
    utama:
      "border-[var(--color-resmi-tua)] bg-[var(--color-resmi)] text-[var(--color-putih)]",
    bahaya:
      "border-[var(--color-stempel)] bg-[var(--color-stempel)] text-[var(--color-putih)]",
    netral: "border-garis-tegas bg-[var(--color-putih)] text-tinta",
  }[gaya];

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-[2px] border-[1.5px] px-6 py-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${kelas}`}
    >
      {pending ? labelProses : label}
    </button>
  );
}

export function PesanGalat({ pesan }: { pesan?: string | null }) {
  if (!pesan) return null;
  return (
    <p
      role="alert"
      className="border-[1.5px] border-[var(--color-stempel)] bg-[var(--color-putih)] px-4 py-4 text-sm font-semibold text-[var(--color-stempel)]"
    >
      {pesan}
    </p>
  );
}

export function PesanSukses({ pesan }: { pesan?: string | null }) {
  if (!pesan) return null;
  return (
    <p className="border-[1.5px] border-resmi bg-[var(--color-resmi-muda)] px-4 py-4 text-sm font-semibold text-[var(--color-resmi-tua)]">
      {pesan}
    </p>
  );
}
