import Link from "next/link";
import type { Locale } from "@/content/post-types";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleSwitcher } from "./locale-switcher";

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
          <Link href="https://portfolio-mahadi-indra.vercel.app/">{dictionary.footer.portfolio}</Link>
          <Link href={`/${locale}`}>{dictionary.footer.blog}</Link>
          <Link href="https://www.linkedin.com/in/mahadindra/">{dictionary.footer.linkedin}</Link>
          <Link href="mailto:mahadiindra2@gmail.com">{dictionary.footer.email}</Link>
        </nav>
        <LocaleSwitcher locale={locale} dictionary={dictionary} />
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Mahadi Indra Manurung</span>
        <span>Asia/Jakarta</span>
      </div>
    </footer>
  );
}
