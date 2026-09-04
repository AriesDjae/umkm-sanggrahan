"use client";

import { useFormStatus } from "react-dom";

/**
 * Tombol hapus dengan satu konfirmasi.
 *
 * Konfirmasinya memakai `confirm()` bawaan peramban dengan sengaja: penghapusan
 * di panel ini jarang terjadi, dan dialog bawaan tidak bisa gagal muncul karena
 * JavaScript-nya belum selesai dimuat. Kalau JavaScript memang mati, `onSubmit`
 * tidak jalan dan formulirnya tetap terkirim — karena itu server action-nya
 * yang memeriksa hak akses, bukan tombol ini.
 */
function Tombol({ label, kecil }: { label: string; kecil?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        kecil
          ? "text-sm font-semibold text-[var(--color-stempel)] underline-offset-4 hover:underline disabled:opacity-60"
          : "rounded-[2px] border-[1.5px] border-[var(--color-stempel)] px-6 py-4 text-sm font-semibold text-[var(--color-stempel)] disabled:opacity-60"
      }
    >
      {pending ? "Menghapus…" : label}
    </button>
  );
}

export default function TombolHapus({
  aksi,
  id,
  nama,
  label = "Hapus",
  kecil = false,
  peringatan,
}: {
  aksi: (formData: FormData) => void | Promise<void>;
  id: number;
  nama: string;
  label?: string;
  kecil?: boolean;
  peringatan?: string;
}) {
  return (
    <form
      action={aksi}
      onSubmit={(e) => {
        const pesan =
          peringatan ?? `Hapus "${nama}"? Tindakan ini tidak bisa dibatalkan.`;
        if (!confirm(pesan)) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <Tombol label={label} kecil={kecil} />
    </form>
  );
}
