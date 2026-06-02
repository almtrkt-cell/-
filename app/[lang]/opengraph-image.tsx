import { ImageResponse } from "next/og";

export const alt = "WABEL — A Flood of Results. Not Just Ads.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CARBON = "#0A0A0A";
const CREAM = "#FAF6EF";
const SPLASH = "#FF5436";

export default function OpengraphImage({
  params,
}: {
  params: { lang: string };
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: CARBON,
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* splash glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(255,84,54,0.22)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              backgroundColor: SPLASH,
              display: "flex",
            }}
          />
          <div
            style={{
              color: CREAM,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            SAUDI · AI-POWERED MARKETING
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              color: CREAM,
              fontSize: 150,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            WABE<span style={{ color: SPLASH }}>L</span>
          </div>
          <div
            style={{
              display: "flex",
              color: "rgba(250,246,239,0.82)",
              fontSize: 40,
              fontWeight: 500,
              maxWidth: 900,
            }}
          >
            A Flood of Results. Not Just Ads.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(250,246,239,0.55)",
            fontSize: 28,
          }}
        >
          <div style={{ display: "flex" }}>wabel.sa</div>
          <div style={{ display: "flex" }}>{params.lang.toUpperCase()}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
