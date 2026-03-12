import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { getSocialImageContent } from "@/lib/seo";

function getLogoDataUrl() {
  const logoPath = path.join(process.cwd(), "public", "logo_typo.svg");
  const logoBuffer = fs.readFileSync(logoPath);
  return `data:image/svg+xml;base64,${Buffer.from(logoBuffer).toString("base64")}`;
}

export function createSocialImage(
  locale: string,
  size: { width: number; height: number },
) {
  const content = getSocialImageContent(locale);
  const logoDataUrl = getLogoDataUrl();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "radial-gradient(circle at top left, #4e00de 0%, #aa00ff 25%, #0c0c0c 70%)",
        color: "#fff7e6",
        padding: "64px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#ffd27a",
          }}
        >
          {content.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: "82%",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          {content.title}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: "74%",
            fontSize: 30,
            lineHeight: 1.3,
            color: "#f6e4be",
          }}
        >
          {content.subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUrl} width={400} height={150} alt="CHARIOT logo" />
        </div>
        <div
          style={{
            display: "flex",
            padding: "14px 22px",
            borderRadius: 9999,
            border: "1px solid rgba(170, 0, 255, 0.45)",
            fontSize: 20,
            color: "#aa00ff",
            textTransform: "uppercase",
          }}
        >
          {content.locale.toUpperCase()}
        </div>
      </div>
    </div>,
    size,
  );
}
