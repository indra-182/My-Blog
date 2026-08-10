import Link from "next/link";
import type { Locale } from "@/content/post-types";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="wordmark" href={`/${locale}`}>INDRA<span>.</span>DEV</Link>
          <p className="footer-note">Engineering notes for software that lasts.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href={siteConfig.portfolioUrl}>{dictionary.footer.portfolio}</Link>
          <Link href={`/${locale}`}>{dictionary.footer.blog}</Link>
          <Link href={siteConfig.linkedinUrl}>{dictionary.footer.linkedin}</Link>
          <Link href={`mailto:${siteConfig.contactEmail}`}>{dictionary.footer.email}</Link>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Mahadi Indra Manurung</span>
        <span>Asia/Jakarta</span>
      </div>
    </footer>
  );
}
