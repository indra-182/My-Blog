import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";
import type { Locale } from "@/content/post-types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const dictionary = getDictionary(value);
  return { title: dictionary.blog.title, alternates: { languages: { id: "/id", en: "/en" } } };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale = value as Locale;
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SiteHeader locale={locale} />
      {children}
      <SiteFooter locale={locale} />
    </ThemeProvider>
  );
}
