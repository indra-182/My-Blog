import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : "id";
  const dictionary = getDictionary(locale);
  return new ImageResponse(<div style={{ background: "#0B0D10", color: "#F5F7FA", width: "1200px", height: "630px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", fontFamily: "sans-serif" }}><div style={{ color: "#60A5FA", fontSize: 28, fontWeight: 700 }}>INDRA.DEV</div><div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.06em", maxWidth: "900px" }}>{dictionary.blog.title}</div><div style={{ color: "#A6ADB8", fontSize: 24 }}>React · Next.js · TypeScript · React Native</div></div>, { width: 1200, height: 630 });
}
