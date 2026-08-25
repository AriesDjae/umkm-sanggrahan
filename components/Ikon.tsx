/**
 * Ikon digambar sendiri, satu bahasa bentuk: bidang penuh, sudut tumpul,
 * tanpa garis tipis — seperti gambar yang dikuas tukang papan nama.
 * Semuanya di petak 24×24 dan mewarisi warna teks induknya.
 */

type Props = {
  className?: string;
  title?: string;
};

function Bungkus({
  children,
  className = "h-6 w-6",
  title,
}: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/* ---------- Ikon kategori ---------- */

export function IkonMangkuk(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M2.6 10.4h18.8c.5 0 .9.4.8.9-.4 3.7-2.9 6.7-6.3 7.8v.7c0 .7-.6 1.2-1.2 1.2H9.3c-.7 0-1.2-.5-1.2-1.2v-.7c-3.4-1.1-5.9-4.1-6.3-7.8 0-.5.3-.9.8-.9Z" />
      <path d="M8 8.6c-.6 0-1-.6-.8-1.1.3-.8.8-1.3 1.3-1.8.5-.5.7-.8.7-1.3 0-.4-.1-.7-.4-1.1-.3-.5.1-1.2.7-1.2.3 0 .5.1.7.3.5.6.9 1.3.9 2.1 0 1.2-.6 2-1.2 2.5-.3.3-.5.5-.6.8-.1.5-.5.8-1 .8Z" />
      <path d="M13.2 8.6c-.6 0-1-.6-.8-1.1.3-.8.8-1.3 1.3-1.8.5-.5.7-.8.7-1.3 0-.4-.1-.7-.4-1.1-.3-.5.1-1.2.7-1.2.3 0 .5.1.7.3.5.6.9 1.3.9 2.1 0 1.2-.6 2-1.2 2.5-.3.3-.5.5-.6.8-.1.5-.5.8-1 .8Z" />
    </Bungkus>
  );
}

export function IkonAnyaman(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M3.4 8.6h17.2c.6 0 1 .5.9 1.1l-1.4 9.4c-.1.7-.7 1.2-1.4 1.2H5.3c-.7 0-1.3-.5-1.4-1.2L2.5 9.7c-.1-.6.3-1.1.9-1.1Zm2.2 2.6.5 6.5h2.3l-.5-6.5H5.6Zm4.7 0v6.5h2.4v-6.5h-2.4Zm4.8 0-.5 6.5h2.3l.5-6.5h-2.3Z" />
      <path d="M12 2.4c3.1 0 5.7 2.1 6.4 5 .1.5-.3 1-.8 1H6.4c-.5 0-.9-.5-.8-1 .7-2.9 3.3-5 6.4-5Zm0 2.4c-1.5 0-2.8.8-3.5 2h7c-.7-1.2-2-2-3.5-2Z" />
    </Bungkus>
  );
}

export function IkonGunting(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M7.4 2.6c.5-.3 1.2-.1 1.5.5l6.9 12c.3.6.1 1.3-.5 1.6-.6.3-1.3.1-1.6-.5l-6.9-12c-.3-.6-.1-1.3.6-1.6Z" />
      <path d="M16.6 2.6c.6.3.8 1 .5 1.6l-6.9 12c-.3.6-1 .8-1.6.5-.6-.3-.8-1-.5-1.6l6.9-12c.4-.6 1.1-.8 1.6-.5Z" />
      <path d="M6.6 15.4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 2.3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
      <path d="M17.4 15.4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 2.3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
    </Bungkus>
  );
}

export function IkonDaun(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M20.4 3.1c.4 6.2-1.3 10.6-4.3 12.9-2.4 1.9-5.3 2.2-7.7 1.4l-1.9 3.2c-.3.6-1.1.8-1.7.4-.6-.3-.8-1.1-.4-1.7l1.9-3.2c-1.8-1.8-2.6-4.5-1.9-7.3.9-3.5 4.3-6 10.2-6.5l4.6-.4c.6-.1 1.1.4 1.2 1.2Zm-3.2 1.6-3.4.3c-4.8.4-7.3 2.3-7.9 4.7-.3 1.3-.1 2.6.5 3.7l6.4-10.7-.7 12.2c1.2-.2 2.3-.7 3.2-1.5 2-1.5 3.3-4.3 3.4-8.7Z" />
    </Bungkus>
  );
}

export function IkonKunci(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M15.8 2.2c.6-.2 1.2.3 1.1.9l-.5 3.3 2 2 3.3-.5c.6-.1 1.1.5.9 1.1a6.6 6.6 0 0 1-8.1 4.4l-6.2 6.2a3 3 0 1 1-4.2-4.2l6.2-6.2a6.6 6.6 0 0 1 4.4-8.1Zm-1.9 6.4c-.5 1-.5 2.2 0 3.2l-7.4 7.4a.8.8 0 1 1-1.1-1.1l7.4-7.4c-.6-.5-1.4-1.2-1.9-2.1Z" />
    </Bungkus>
  );
}

export function IkonToko(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M4.4 3.4h15.2c.5 0 1 .3 1.1.8l1.2 3.9c.4 1.4-.4 2.7-1.6 3.1v8.4c0 .7-.6 1.2-1.2 1.2H5c-.7 0-1.2-.5-1.2-1.2v-8.4c-1.2-.4-2-1.7-1.6-3.1l1.1-3.9c.2-.5.6-.8 1.1-.8Zm1.8 8.9v6.1h3.9v-4.3c0-.5.4-.9.9-.9h3.9c.5 0 .9.4.9.9v4.3h3.9v-6.1c-1 0-1.9-.4-2.6-1.1a3.6 3.6 0 0 1-5.2 0 3.6 3.6 0 0 1-5.2 0c-.6.7-1.5 1.1-2.5 1.1Z" />
    </Bungkus>
  );
}

const PETA_IKON: Record<string, (p: Props) => React.ReactElement> = {
  mangkuk: IkonMangkuk,
  anyaman: IkonAnyaman,
  gunting: IkonGunting,
  daun: IkonDaun,
  kunci: IkonKunci,
  toko: IkonToko,
};

/** Ambil ikon kategori berdasarkan namanya di data/kategori.json. */
export function IkonKategori({ nama, ...p }: Props & { nama: string }) {
  const Pilih = PETA_IKON[nama] ?? IkonToko;
  return <Pilih {...p} />;
}

/* ---------- Ikon antarmuka ---------- */

export function IkonCari(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M10.6 2.2a8.4 8.4 0 0 1 6.6 13.6l4.4 4.4c.5.5.5 1.3 0 1.8s-1.3.5-1.8 0l-4.4-4.4A8.4 8.4 0 1 1 10.6 2.2Zm0 2.8a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2Z" />
    </Bungkus>
  );
}

export function IkonWa(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M12 2.2c5.4 0 9.8 4.4 9.8 9.8 0 5.4-4.4 9.8-9.8 9.8-1.7 0-3.3-.4-4.7-1.2l-5.1 1.4 1.4-5A9.7 9.7 0 0 1 2.2 12c0-5.4 4.4-9.8 9.8-9.8Zm-3.6 5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5v-.5c-.1-.2-.6-1.6-.9-2.1-.2-.5-.5-.5-.6-.5h-.9Z" />
    </Bungkus>
  );
}

export function IkonPin(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M12 2.2c4 0 7.2 3.2 7.2 7.2 0 4.6-5.3 10.6-6.5 11.9-.4.4-1 .4-1.4 0-1.2-1.3-6.5-7.3-6.5-11.9 0-4 3.2-7.2 7.2-7.2Zm0 4.2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </Bungkus>
  );
}

export function IkonJam(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M12 2.2a9.8 9.8 0 1 1 0 19.6 9.8 9.8 0 0 1 0-19.6Zm0 2.8a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 1.9c.7 0 1.2.5 1.2 1.2v3.4l2.4 1.4c.6.3.8 1.1.4 1.7-.3.6-1.1.8-1.7.4l-3-1.7c-.4-.2-.6-.6-.6-1V8.1c0-.7.6-1.2 1.3-1.2Z" />
    </Bungkus>
  );
}

export function IkonPanah(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M13.1 4.3c.5-.5 1.3-.5 1.8 0l6.8 6.8c.5.5.5 1.3 0 1.8l-6.8 6.8c-.5.5-1.3.5-1.8 0s-.5-1.3 0-1.8l4.7-4.7H3.5c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3h14.3l-4.7-4.7c-.5-.5-.5-1.3 0-1.6Z" />
    </Bungkus>
  );
}

export function IkonSilang(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M5.3 3.5c.5-.5 1.3-.5 1.8 0l4.9 4.9 4.9-4.9c.5-.5 1.3-.5 1.8 0s.5 1.3 0 1.8L13.8 10.2l4.9 4.9c.5.5.5 1.3 0 1.8s-1.3.5-1.8 0L12 12l-4.9 4.9c-.5.5-1.3.5-1.8 0s-.5-1.3 0-1.8l4.9-4.9L5.3 5.3c-.5-.5-.5-1.3 0-1.8Z" />
    </Bungkus>
  );
}

export function IkonGaris(p: Props) {
  return (
    <Bungkus {...p}>
      <path d="M3.4 5.4h17.2c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3H3.4c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3Zm0 5.3h17.2c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3H3.4c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3Zm0 5.3h17.2c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3H3.4c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3Z" />
    </Bungkus>
  );
}
