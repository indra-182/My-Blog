import { ImageResponse } from "next/og";
import dictionary from "@/i18n/messages/id.json";

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#07161D",
        color: "#EDF1F2",
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ color: "#2E5BFF", fontSize: 28, fontWeight: 700 }}>
        INDRA.DEV
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: "-0.06em",
          maxWidth: "900px",
        }}
      >
        {dictionary.blog.title}
      </div>
      <div style={{ color: "#B8C6CB", fontSize: 24 }}>
        Catatan engineering · React · Next.js · TypeScript · React Native
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
