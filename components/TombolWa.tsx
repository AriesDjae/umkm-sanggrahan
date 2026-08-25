import { IkonWa } from "./Ikon";
import { tautanWa } from "@/lib/format";

type Props = {
  nomor: string;
  pesan: string;
  children?: React.ReactNode;
  ukuran?: "besar" | "kecil";
  className?: string;
};

/**
 * Tombol WhatsApp. Persegi, bergaris tegas, memakai satu warna resmi —
 * bukan tombol hijau bulat yang berteriak. Tiap layar di situs ini
 * berakhir di sini.
 */
export default function TombolWa({
  nomor,
  pesan,
  children = "Chat WhatsApp",
  ukuran = "besar",
  className = "",
}: Props) {
  const besar = ukuran === "besar";

  return (
    <a
      href={tautanWa(nomor, pesan)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-[2px] border-[1.5px] font-semibold transition-colors duration-150 ${
        besar ? "px-6 py-4 text-base" : "px-4 py-2 text-sm"
      } ${className}`}
      style={{
        backgroundColor: "var(--color-resmi)",
        borderColor: "var(--color-resmi-tua)",
        color: "var(--color-putih)",
      }}
    >
      <IkonWa className={besar ? "h-6 w-6" : "h-4 w-4"} />
      {children}
    </a>
  );
}
