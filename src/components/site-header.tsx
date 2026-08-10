import Link from "next/link";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";
import type { Locale } from "@/content/post-types";
import { getDictionary } from "@/i18n/dictionaries";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link className="wordmark" href={`/${locale}`} aria-label="INDRA.DEV Blog">
          INDRA<span>.</span>DEV
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="https://indra.dev">{dictionary.navigation.portfolio}</Link>
          <Link className="active" href={`/${locale}`}>{dictionary.navigation.blog}</Link>
        </nav>
        <div className="header-actions">
          <LocaleSwitcher locale={locale} dictionary={dictionary} />
          <ThemeToggle dictionary={dictionary} />
          <MobileNavigation locale={locale} dictionary={dictionary} />
        </div>
      </div>
    </header>
  );
}
