import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Gambar yang muncul saat tautan dibagikan di WhatsApp atau Facebook:
 * satu kop lembar registri, sama seperti di dalam situsnya.
 *
 * Catatan: mesin penggambarnya menuntut setiap <div> yang punya lebih dari
 * satu anak diberi display eksplisit, dan setiap teks berupa satu untaian utuh.
 */
export const alt = `${site.nama} — registri usaha warga ${site.wilayahSingkat}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Gambar() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 44,
          background: "#f7f8fa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#ffffff",
            border: "2px solid #878d96",
            padding: "52px 60px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 58,
                height: 58,
                border: "2px solid #1b3b6f",
                color: "#1b3b6f",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              SGR
            </div>
            <div
              style={{
                display: "flex",
                color: "#4b5360",
                fontSize: 26,
                letterSpacing: 3,
                marginLeft: 22,
              }}
            >
              {`USAHA WARGA · ${site.kelurahan.toUpperCase()} · ${site.kemantren.toUpperCase()}`}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#14171c",
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: -3,
                lineHeight: 1.02,
              }}
            >
              Registri usaha warga
            </div>
            <div
              style={{
                display: "flex",
                color: "#1b3b6f",
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: -3,
                lineHeight: 1.02,
                marginTop: 6,
              }}
            >
              Sanggrahan
            </div>
            <div
              style={{ display: "flex", color: "#4b5360", fontSize: 30, marginTop: 26 }}
            >
              Lihat yang bertanda buka hari ini, lalu hubungi pemiliknya langsung.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", height: 4, width: 96, background: "#1b3b6f" }} />
            <div style={{ display: "flex", color: "#4b5360", fontSize: 24, marginLeft: 20 }}>
              {site.url.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
