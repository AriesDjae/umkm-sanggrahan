import type { MetadataRoute } from "next";
import { KATEGORI } from "@/lib/kategori";
import { semuaUmkm } from "@/lib/umkm";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const sekarang = new Date();

  const halamanTetap: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: sekarang, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/umkm`, lastModified: sekarang, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/peta`, lastModified: sekarang, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/daftar`, lastModified: sekarang, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/tentang`, lastModified: sekarang, changeFrequency: "monthly", priority: 0.4 },
  ];

  const halamanKategori: MetadataRoute.Sitemap = KATEGORI.map((k) => ({
    url: `${site.url}/kategori/${k.slug}`,
    lastModified: sekarang,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const halamanUmkm: MetadataRoute.Sitemap = semuaUmkm().map((u) => ({
    url: `${site.url}/umkm/${u.slug}`,
    lastModified: sekarang,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...halamanTetap, ...halamanKategori, ...halamanUmkm];
}
