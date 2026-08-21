import { ImageResponse } from "next/og";
import { site } from "@/lib/site.config";

/**
 * Generated Open Graph card. Rendered per request rather than shipped as static
 * art, so every page gets a card with its own title without anyone opening a
 * design tool. The mark is redrawn in flat vectors because Satori supports only
 * a restricted CSS subset — a deliberate simplification, not a reuse.
 *
 * Usage: /api/og?title=...&kind=...
 */
export const runtime = "nodejs";

const BG = "#0d0e12";
const PANEL = "#161820";
const INK = "#f4f5f7";
const DIM = "#9ba1ad";
const HOT = "#ff4500";
const WARM = "#ff8c00";
const TEAL = "#00f5d4";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 130) ?? site.name;
  const kind = searchParams.get("kind")?.slice(0, 40) ?? site.tagline;
  const size = title.length > 76 ? 52 : title.length > 46 ? 64 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "60px 68px",
          position: "relative",
        }}
      >
        {/* Blueprint grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Warm bloom, top-right — the single light source */}
        <div
          style={{
            position: "absolute",
            top: -240,
            right: -160,
            width: 760,
            height: 620,
            background: "radial-gradient(circle, rgba(255,69,0,0.24), transparent 65%)",
          }}
        />
        {/* Glass plate */}
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 40,
            right: 40,
            bottom: 34,
            borderRadius: 16,
            background: PANEL,
            opacity: 0.55,
            borderTop: `1px solid rgba(255,69,0,0.3)`,
            borderLeft: `1px solid rgba(255,69,0,0.16)`,
          }}
        />

        {/* Header */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="58" height="58" viewBox="0 0 40 40">
            <path d="M4 31.5 L9.2 31.5 L13.4 20.5 L8.2 20.5 Z" fill={HOT} />
            <path d="M13 31.5 L18.2 31.5 L24.4 14.5 L19.2 14.5 Z" fill="#ff6a00" />
            <path d="M22 31.5 L27.2 31.5 L35.4 8.5 L30.2 8.5 Z" fill={WARM} />
            <rect x="34.4" y="4.6" width="3" height="3" rx="0.8" fill={TEAL} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: INK, letterSpacing: "0.02em" }}>
              ABM Tech
            </div>
            <div
              style={{
                fontSize: 14,
                color: DIM,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              {kind}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: HOT }} />
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.14)" }} />
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.14)" }} />
          </div>
        </div>

        {/* Title */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ width: 68, height: 4, background: HOT, marginBottom: 28 }} />
          <div
            style={{
              fontSize: size,
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 18,
            color: DIM,
          }}
        >
          <span>{site.url.replace(/^https?:\/\//, "")}</span>
          <span style={{ color: HOT }}>·</span>
          <span>CRM</span>
          <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
          <span>ERP</span>
          <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
          <span>Billing platforms</span>
          <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
          <span>AI automation</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, immutable, no-transform, max-age=31536000" },
    },
  );
}
