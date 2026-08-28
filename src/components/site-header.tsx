import Link from "next/link";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";
import dictionary from "@/i18n/messages/id.json";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color-mix(in_srgb,var(--foreground)_18%,transparent)] bg-[color-mix(in_srgb,var(--background)_94%,transparent)]">
      <div className="shell flex min-h-[4.75rem] items-center justify-between gap-4">
        <Link className="site-wordmark" href="/" aria-label="Beranda INDRA.DEV">
          INDRA<span>.</span>DEV
        </Link>
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navigasi situs"
        >
          <Link
            className="inline-flex min-h-11 items-center border-b border-transparent px-[0.7rem] py-[0.8rem] font-mono text-[0.66rem] tracking-[0.09em] text-muted-foreground uppercase transition-[color,border-color] duration-[var(--motion-fast)] ease hover:border-cue-rose hover:text-foreground focus-visible:border-cue-rose focus-visible:text-foreground"
            href={siteConfig.portfolioUrl}
          >
            {dictionary.navigation.portfolio}
          </Link>
          <Link
            className="inline-flex min-h-11 items-center border-b border-cue-rose px-[0.7rem] py-[0.8rem] font-mono text-[0.66rem] tracking-[0.09em] text-foreground uppercase transition-[color,border-color] duration-[var(--motion-fast)] ease"
            href="/"
            aria-current="page"
          >
            {dictionary.navigation.blog}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-[0.2rem]">
          <ThemeToggle />
          <MobileNavigation portfolioUrl={siteConfig.portfolioUrl} />
        </div>
      </div>
    </header>
  );
}
