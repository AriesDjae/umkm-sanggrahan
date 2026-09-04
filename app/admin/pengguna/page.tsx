import KepalaHalaman from "@/components/admin/KepalaHalaman";
import TombolHapus from "@/components/admin/TombolHapus";
import { db } from "@/lib/db";
import { LABEL_PERAN, PERAN, PERAN_PENYELIA, type Peran } from "@/lib/konstanta";
import { wajibPeran } from "@/lib/otorisasi";

import { hapusPengguna } from "./aksi";
import FormPengguna from "./FormPengguna";

export const metadata = { title: "Akun pengurus" };

export default async function HalamanPengguna() {
  const saya = await wajibPeran(PERAN_PENYELIA);

  const daftar = await db.user.findMany({
    orderBy: [{ aktif: "desc" }, { nama: "asc" }],
    select: {
      id: true,
      nama: true,
      email: true,
      peran: true,
      telepon: true,
      aktif: true,
    },
  });

  const adminAktif = daftar.filter((u) => u.peran === PERAN.ADMIN && u.aktif).length;

  return (
    <>
      <KepalaHalaman
        label="Pengelolaan"
        judul="Akun pengurus"
        keterangan="Hanya orang yang tercantum di sini yang bisa membuka panel. Warga yang mendaftarkan usahanya tidak butuh akun."
      />

      <ul className="space-y-4">
        {daftar.map((u) => {
          const diriSendiri = u.id === saya.id;
          const adminTerakhir = u.peran === PERAN.ADMIN && u.aktif && adminAktif === 1;

          return (
            <li key={u.id} className="lembar px-6 py-6">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4 border-b-[1.5px] border-garis pb-4">
                <span>
                  <span className="judul-registri text-base text-tinta">{u.nama}</span>
                  <span className="mt-2 block text-xs text-tinta-lembut">
                    {u.email} · {LABEL_PERAN[u.peran as Peran]}
                    {!u.aktif && " · nonaktif"}
                  </span>
                </span>

                {diriSendiri ? (
                  <span className="label-registri">Akun Anda</span>
                ) : adminTerakhir ? (
                  <span className="text-xs text-tinta-lembut">
                    Administrator aktif terakhir — tidak bisa dihapus
                  </span>
                ) : (
                  <TombolHapus
                    aksi={hapusPengguna}
                    id={u.id}
                    nama={u.nama}
                    kecil
                    peringatan={`Hapus akun ${u.nama} (${u.email})? Kalau hanya ingin mencabut aksesnya sementara, matikan saja "Akun aktif".`}
                  />
                )}
              </div>

              <FormPengguna
                awal={{
                  id: u.id,
                  nama: u.nama,
                  email: u.email,
                  peran: u.peran as Peran,
                  telepon: u.telepon,
                  aktif: u.aktif,
                }}
                diriSendiri={diriSendiri}
              />
            </li>
          );
        })}
      </ul>

      <section className="lembar mt-8 px-6 py-6">
        <p className="label-registri mb-4">Tambah akun</p>
        <FormPengguna />
      </section>
    </>
  );
}
