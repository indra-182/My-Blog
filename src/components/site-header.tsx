import Link from "next/link";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const dictionary = getDictionary();
  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link className="wordmark" href="/" aria-label="INDRA.DEV Blog">
          INDRA<span>.</span>DEV
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href={siteConfig.portfolioUrl}>
            {dictionary.navigation.portfolio}
          </Link>
          <Link className="active" href="/">
            {dictionary.navigation.blog}
          </Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle dictionary={dictionary} />
          <MobileNavigation dictionary={dictionary} />
        </div>
      </div>
    </header>
  );
}
