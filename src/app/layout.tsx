import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const themeScript = `(()=>{try{const t=localStorage.getItem("theme")==="light"?"light":"dark";const r=document.documentElement;r.classList.toggle("light",t==="light");r.classList.toggle("dark",t==="dark");r.style.colorScheme=t}catch{const r=document.documentElement;r.classList.remove("light");r.classList.add("dark");r.style.colorScheme="dark"}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.blogUrl),
  title: { default: "INDRA.DEV Blog", template: "%s — INDRA.DEV" },
  description:
    "Tulisan teknis tentang React, Next.js, TypeScript, dan React Native.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script
          id="impeccable-direction-contract"
          type="text/plain"
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: Cue Horizon stages technical writing as a clear reading path, refusing generic developer-blog chrome and decorative sequencing.
OWN-WORLD: Near-black cyclorama, cobalt horizon, rose transition, white-day focus, cue tape, matte stage floor, tabular cue labels, and controlled luminance.
STORY: Engineers identify the writing focus, search or filter published notes, read an article through its headings and code, then continue through series or related links.
FIRST VIEWPORT: Sticky stage header above a near-black field descending into cobalt; the headline leads, the rose Catatan teknis cue and description follow, and deliberate breathing room separates the hero from discovery tools.
FORM: Cue Horizon reading stage, pinned sibling-portfolio direction, source seed 6dea048c, code-led.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`,
          }}
        />
        <a href="#main-content" className="skip-link">
          Lewati ke konten
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
