import { ImageResponse } from "next/og";

import { siteName } from "@/lib/data/site";

export const alt = `${siteName}: fire-cooked restaurants in three neighbourhoods`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse renders with Satori, which can't read CSS variables, so these
// mirror the brand tokens in `:root` in app/globals.css.
const cream = "#EAE1D3";
const graphite = "#2B2C2F";
const tangerine = "#FF6A14";

/**
 * Social sharing card (Open Graph and, by fallback, X/Twitter), generated at
 * build time. Uses the built-in font; the brand fonts would need TTF files
 * bundled with the route.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: cream,
        color: graphite,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: graphite,
          }}
        />
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 4 }}>
          {siteName.toUpperCase()}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 96,
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: -4,
        }}
      >
        <div>Fire-cooked.</div>
        <div>Every plate,</div>
        <div>on purpose.</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: tangerine,
          }}
        />
        <div style={{ fontSize: 32, fontWeight: 600 }}>
          Now taking bookings in all three rooms
        </div>
      </div>
    </div>,
    size,
  );
}
