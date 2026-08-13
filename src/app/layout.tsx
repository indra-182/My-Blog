import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const themeScript = `(()=>{try{const t=localStorage.getItem("theme")==="light"?"light":"dark";document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t}catch{document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark"}})()`;

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
    <html
      lang="id"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
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
