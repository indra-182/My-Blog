import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MotionProvider } from "@/components/motion-provider";
import dictionary from "@/i18n/messages/id.json";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const themeScript = `(()=>{try{const s=localStorage.getItem("theme");const t=s==="light"||s==="dark"?s:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");const r=document.documentElement;r.classList.toggle("light",t==="light");r.classList.toggle("dark",t==="dark");r.style.colorScheme=t}catch{const r=document.documentElement;r.classList.remove("light");r.classList.add("dark");r.style.colorScheme="dark"}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.blogUrl),
  title: {
    default: "INDRA.DEV | Catatan Engineering",
    template: "%s | INDRA.DEV",
  },
  description: dictionary.blog.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="auto" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Recursive-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Literata-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main-content"
          className="fixed left-3 top-3 z-[60] -translate-y-[200%] bg-atlas-survey-paper px-4 py-3 font-[750] text-atlas-night-water focus:translate-y-0"
        >
          Langsung ke konten utama
        </a>
        <MotionProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
