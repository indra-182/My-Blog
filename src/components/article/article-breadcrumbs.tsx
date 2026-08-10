import Link from "next/link";
import type { Locale } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";

export function ArticleBreadcrumbs({ locale, title, dictionary }: { locale: Locale; title: string; dictionary: Dictionary }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href={`/${locale}`}>{dictionary.article.home}</Link><span aria-hidden="true">/</span><Link href={`/${locale}`}>{dictionary.navigation.blog}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>;
}
