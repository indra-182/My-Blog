import Link from "next/link";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";
import dictionary from "@/i18n/messages/id.json";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link className="site-wordmark" href="/" aria-label="INDRA.DEV Blog">
          INDRA<span>.</span>DEV
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          <Link href={siteConfig.portfolioUrl}>
            {dictionary.navigation.portfolio}
          </Link>
          <Link className="active" href="/" aria-current="page">
            {dictionary.navigation.blog}
          </Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <MobileNavigation portfolioUrl={siteConfig.portfolioUrl} />
        </div>
      </div>
    </header>
  );
}
