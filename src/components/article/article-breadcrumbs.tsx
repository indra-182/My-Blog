import Link from "next/link";
import dictionary from "@/i18n/messages/id.json";

export function ArticleBreadcrumbs({ title }: { title: string }) {
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
