import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Batasi akar proyek ke folder ini supaya Turbopack tidak ikut membaca
  // berkas di folder induk (D:\Project).
  turbopack: { root: path.resolve(process.cwd()) },
};

export default nextConfig;
