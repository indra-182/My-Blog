import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";

export function ArticleBreadcrumbs({
  title,
  dictionary,
}: {
  title: string;
  dictionary: Dictionary;
}) {
  return (
    <nav className="breadcrumbs" aria-label="Jejak navigasi">
      <Link href="/">{dictionary.article.home}</Link>
      <span aria-hidden="true">/</span>
      <Link href="/">{dictionary.navigation.blog}</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{title}</span>
    </nav>
  );
}
