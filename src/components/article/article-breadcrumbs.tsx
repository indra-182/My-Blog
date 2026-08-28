import Link from "next/link";
import dictionary from "@/i18n/messages/id.json";

export function ArticleBreadcrumbs({ title }: { title: string }) {
  return (
    <nav
      className="flex flex-wrap gap-[0.6rem] font-mono text-[0.68rem] tracking-[0.04em] text-muted-foreground"
      aria-label="Navigasi halaman"
    >
      <Link
        className="underline decoration-transparent transition-[color,text-decoration-color] duration-[var(--motion-fast)] ease hover:text-cue-rose hover:decoration-current focus-visible:text-cue-rose focus-visible:decoration-current"
        href="/"
      >
        {dictionary.article.home}
      </Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{title}</span>
    </nav>
  );
}
