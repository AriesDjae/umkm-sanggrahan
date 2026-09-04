/**
 * Uji jalan panel pengurus dari ujung ke ujung.
 * Jalankan:  npm run build && npx next start -p 3210
 *            npm run uji:panel        (di jendela terminal lain)
 *
 * Yang ditelusuri: panel terkunci sebelum masuk, sandi salah ditolak, masuk,
 * mencatat bidang baru, menambah produk, menyunting, menyembunyikan dari situs
 * publik, memunculkannya lagi, menghapus, lalu keluar. Setiap langkah juga
 * memeriksa halaman publiknya ikut berubah — itu bagian yang paling mudah
 * diam-diam rusak, karena halaman publik dibangun statis dan hanya berubah
 * kalau server action-nya memanggil revalidatePath.
 *
 * Bidang yang dibuat uji ini dihapus lagi di langkah terakhir. Nomor bidangnya
 * memang hangus — nomor di registri ini tidak pernah dipakai ulang.
 */
import fs from "node:fs";
import puppeteer from "puppeteer-core";

const ALAMAT = process.argv[2] ?? "http://localhost:3210";

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error("Tidak menemukan Chrome atau Edge.");
  process.exit(1);
}

const hijau = (t) => `\x1b[32m${t}\x1b[0m`;
const merah = (t) => `\x1b[31m${t}\x1b[0m`;

let gagal = 0;
function cek(nama, lulus, catatan = "") {
  if (lulus) console.log(`${hijau("  ok")}  ${nama}`);
  else {
    gagal++;
    console.log(`${merah("GAGAL")}  ${nama}${catatan ? ` — ${catatan}` : ""}`);
  }
}

const NAMA_UJI = "Warung Uji Otomatis";

async function isi(page, nama, nilai, dalamForm) {
  await page.evaluate(
    (n, v, label) => {
      const akar = label
        ? [...document.querySelectorAll("form")].find((f) =>
            [...f.querySelectorAll('button[type="submit"]')].some((b) =>
              b.textContent.trim().startsWith(label),
            ),
          )
        : document;
      akar.querySelector(`[name="${n}"]`).value = v;
    },
    nama,
    nilai,
    dalamForm ?? null,
  );
}

/** Tekan tombol kirim sebuah form, dikenali dari teks tombolnya. */
async function kirim(page, labelTombol) {
  await page.evaluate((label) => {
    const tombol = [...document.querySelectorAll('form button[type="submit"]')].find((b) =>
      b.textContent.trim().startsWith(label),
    );
    if (!tombol) throw new Error(`Tombol "${label}" tidak ditemukan`);
    tombol.click();
  }, labelTombol);

  // Server action tanpa redirect tidak memicu navigasi, jadi tidak bisa
  // sekadar menunggu navigation — beri jeda supaya render ulangnya selesai.
  await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 1500));
}

const peramban = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await peramban.newPage();
page.setDefaultTimeout(30000);
page.on("dialog", (d) => d.accept());

try {
  /* ---- 1. Panel terkunci sebelum masuk ---- */
  await page.goto(`${ALAMAT}/admin/umkm`, { waitUntil: "networkidle0" });
  cek("/admin/umkm mengalihkan ke halaman masuk", page.url().includes("/masuk"));

  /* ---- 2. Sandi salah ditolak ---- */
  // Konteks terpisah: /masuk memang mengalihkan pengguna yang sudah masuk.
  const konteks = await peramban.createBrowserContext();
  const p2 = await konteks.newPage();
  await p2.goto(`${ALAMAT}/masuk`, { waitUntil: "networkidle0" });
  await isi(p2, "email", "admin@sanggrahan.id");
  await isi(p2, "sandi", "sandi-yang-salah");
  await kirim(p2, "Masuk");
  const galat = await p2.$eval('[role="alert"]', (el) => el.textContent).catch(() => "");
  cek("sandi salah ditolak", galat.includes("tidak cocok"), galat || "tidak ada pesan");
  await konteks.close();

  /* ---- 3. Masuk ---- */
  await isi(page, "email", "admin@sanggrahan.id");
  await isi(page, "sandi", "sanggrahan123");
  await kirim(page, "Masuk");
  cek("masuk berhasil, mendarat di panel", page.url().includes("/admin"), page.url());

  /* ---- 4. Buat bidang baru ---- */
  await page.goto(`${ALAMAT}/admin/umkm/baru`, { waitUntil: "networkidle0" });
  await isi(page, "nama", NAMA_UJI);
  await isi(page, "pemilik", "Bu Uji");
  await isi(page, "deskripsi", "Bidang buatan uji otomatis untuk memastikan CRUD berjalan.");
  await isi(page, "alamat", "RT 01 RW 01, Sanggrahan");
  await isi(page, "whatsapp", "0812-3456-7890");
  await isi(page, "jamMulai", "08:00");
  await isi(page, "jamSelesai", "17:00");
  await isi(page, "lat", "-7.7947");
  await isi(page, "lng", "110.3855");
  await page.select(
    '[name="kategoriId"]',
    await page.$eval('[name="kategoriId"] option:nth-child(2)', (o) => o.value),
  );
  await page.$$eval('[name="hari"]', (els) =>
    els.slice(1, 7).forEach((e) => (e.checked = true)),
  );
  await kirim(page, "Catat bidang");

  const urlSunting = page.url();
  cek(
    "bidang baru tersimpan & dialihkan ke halaman sunting",
    /\/admin\/umkm\/\d+/.test(urlSunting),
    urlSunting,
  );

  const nomor = await page.$eval('[name="nomor"]', (el) => el.value).catch(() => "");
  cek("nomor bidang dibuatkan otomatis", /^SGR-\d{2}-\d{3}$/.test(nomor), nomor);

  const wa = await page.$eval('[name="whatsapp"]', (el) => el.value);
  cek("nomor WhatsApp dirapikan ke 62…", wa === "6281234567890", wa);

  const hari = await page.$$eval('[name="hari"]', (els) =>
    els.filter((e) => e.checked).map((e) => e.value).join(","),
  );
  cek("hari buka tersimpan", hari === "1,2,3,4,5,6", hari);

  /* ---- 5. Tampil di situs publik ---- */
  const slug = await page.$eval('[name="slug"]', (el) => el.value);
  const p3 = await peramban.newPage();
  let r = await p3.goto(`${ALAMAT}/umkm/${slug}`, { waitUntil: "networkidle0" });
  cek("lembar publiknya langsung terbit", r.status() === 200, `status ${r.status()}`);

  await p3.goto(`${ALAMAT}/umkm`, { waitUntil: "networkidle0" });
  cek("muncul di registri lengkap", (await p3.content()).includes(NAMA_UJI));

  /* ---- 6. Tambah produk ---- */
  await isi(page, "nama", "Es Teh Uji", "Tambah produk");
  await isi(page, "harga", "5000", "Tambah produk");
  await isi(page, "satuan", "gelas", "Tambah produk");
  await kirim(page, "Tambah produk");

  await page.goto(urlSunting, { waitUntil: "networkidle0" });
  cek("produk tersimpan", (await page.content()).includes("Es Teh Uji"));

  await p3.goto(`${ALAMAT}/umkm/${slug}`, { waitUntil: "networkidle0" });
  const isiLembar = await p3.content();
  cek("produk & harganya tampil di lembar publik", isiLembar.includes("Es Teh Uji"));
  cek("harga terformat rupiah", /Rp\s?5\.000/.test(isiLembar));

  /* ---- 7. Sunting nama ---- */
  await isi(page, "nama", `${NAMA_UJI} (diubah)`, "Simpan perubahan");
  await kirim(page, "Simpan perubahan");
  await page.goto(urlSunting, { waitUntil: "networkidle0" });
  const namaBaru = await page.$eval('[name="nama"]', (el) => el.value);
  cek("suntingan nama tersimpan", namaBaru === `${NAMA_UJI} (diubah)`, namaBaru);

  /* ---- 8. Sembunyikan dari publik ---- */
  await page.$eval('[name="aktif"]', (el) => (el.checked = false));
  await kirim(page, "Simpan perubahan");
  r = await p3.goto(`${ALAMAT}/umkm/${slug}`, { waitUntil: "networkidle0" });
  cek("bidang tersembunyi hilang dari situs publik", r.status() === 404, `status ${r.status()}`);

  /* ---- 9. Munculkan lagi ---- */
  await page.goto(urlSunting, { waitUntil: "networkidle0" });
  await page.$eval('[name="aktif"]', (el) => (el.checked = true));
  await kirim(page, "Simpan perubahan");
  r = await p3.goto(`${ALAMAT}/umkm/${slug}`, { waitUntil: "networkidle0" });
  cek("dimunculkan lagi, terbit kembali", r.status() === 200, `status ${r.status()}`);

  /* ---- 10. Halaman khusus administrator ---- */
  await page.goto(`${ALAMAT}/admin/pengguna`, { waitUntil: "networkidle0" });
  cek("administrator boleh membuka /admin/pengguna", page.url().endsWith("/admin/pengguna"));
  await page.goto(`${ALAMAT}/admin/kategori`, { waitUntil: "networkidle0" });
  const isiKategori = await page.content();
  cek(
    "kategori terpakai tidak bisa dihapus",
    isiKategori.includes("Tidak bisa dihapus selama masih dipakai"),
  );

  /* ---- 11. Hapus bidang uji ---- */
  await page.goto(urlSunting, { waitUntil: "networkidle0" });
  await kirim(page, "Hapus bidang permanen");
  cek("setelah hapus, kembali ke daftar bidang", page.url().endsWith("/admin/umkm"), page.url());

  r = await p3.goto(`${ALAMAT}/umkm/${slug}`, { waitUntil: "networkidle0" });
  cek("lembar publiknya ikut hilang", r.status() === 404, `status ${r.status()}`);

  /* ---- 12. Keluar ---- */
  await page.goto(`${ALAMAT}/admin`, { waitUntil: "networkidle0" });
  await kirim(page, "Keluar");
  await page.goto(`${ALAMAT}/admin`, { waitUntil: "networkidle0" });
  cek("setelah keluar, panel terkunci lagi", page.url().includes("/masuk"), page.url());

  await p3.close();
} catch (e) {
  gagal++;
  console.log(merah(`GAGAL  ${e.message}`));
} finally {
  await peramban.close();
}

console.log(gagal === 0 ? hijau("\nSemua uji lolos.") : merah(`\n${gagal} uji gagal.`));
process.exit(gagal === 0 ? 0 : 1);
