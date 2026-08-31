import Link from "next/link";
import dictionary from "@/i18n/messages/id.json";
import { siteConfig } from "@/lib/site-config";
import { Briefcase, Mail } from "@/components/icons";

function GitHubIcon() {
  return (
    <svg
      className="size-4 flex-none text-cue-rose"
      viewBox="0 0 16 16"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      className="size-4 flex-none text-cue-rose"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.2.792 24 1.771 24h20.451C23.2 24 24 23.2 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-[clamp(5rem,10vw,9rem)] border-t border-border bg-surface pt-14 pb-5">
      <div className="shell flex flex-col gap-8 border-b border-border pb-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Link className="site-wordmark" href="/">
            INDRA<span>.</span>DEV
          </Link>
          <p className="mt-4 mb-0 max-w-[28rem] text-[0.9rem] leading-[1.6] text-muted-foreground">
            {dictionary.footer.description}
          </p>
        </div>
        <nav
          className="grid grid-cols-[repeat(2,minmax(0,max-content))] gap-x-4 gap-y-[0.65rem] md:flex md:items-center"
          aria-label={dictionary.footer.navigationLabel}
        >
          <a
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.65rem] tracking-[0.06em] text-muted-foreground uppercase transition-colors duration-[var(--motion-fast)] ease hover:text-foreground focus-visible:text-foreground"
            href={siteConfig.portfolioUrl}
            aria-label={dictionary.footer.portfolio}
            title={dictionary.footer.portfolio}
          >
            <Briefcase
              className="size-4 flex-none text-cue-rose"
              size={18}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <span>{dictionary.footer.portfolio}</span>
          </a>
          <a
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.65rem] tracking-[0.06em] text-muted-foreground uppercase transition-colors duration-[var(--motion-fast)] ease hover:text-foreground focus-visible:text-foreground"
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={dictionary.footer.github}
            title={dictionary.footer.github}
          >
            <GitHubIcon />
            <span>{dictionary.footer.github}</span>
          </a>
          <a
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.65rem] tracking-[0.06em] text-muted-foreground uppercase transition-colors duration-[var(--motion-fast)] ease hover:text-foreground focus-visible:text-foreground"
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={dictionary.footer.linkedin}
            title={dictionary.footer.linkedin}
          >
            <LinkedInIcon />
            <span>{dictionary.footer.linkedin}</span>
          </a>
          <a
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.65rem] tracking-[0.06em] text-muted-foreground uppercase transition-colors duration-[var(--motion-fast)] ease hover:text-foreground focus-visible:text-foreground"
            href={`mailto:${siteConfig.contactEmail}`}
            aria-label={dictionary.footer.email}
            title={dictionary.footer.email}
          >
            <Mail
              className="size-4 flex-none text-cue-rose"
              size={18}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <span>{dictionary.footer.email}</span>
          </a>
        </nav>
      </div>
      <div className="shell flex flex-col gap-2 pt-4 font-mono text-[0.62rem] tracking-[0.04em] text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="m-0">
          © {new Date().getFullYear()} Mahadi Indra Manurung.{" "}
          {dictionary.footer.rights}
        </p>
        <span className="text-cue-rose">Bogor/Indonesia</span>
      </div>
    </footer>
  );
}
