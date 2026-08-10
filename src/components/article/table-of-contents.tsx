import type { TableOfContentsItem } from "@/content/toc";
import type { Dictionary } from "@/i18n/dictionaries";

export function TableOfContents({
  items,
  dictionary,
}: {
  items: TableOfContentsItem[];
  dictionary: Dictionary;
}) {
  if (items.length < 2) return null;
  return (
    <nav className="toc" aria-label={dictionary.article.toc}>
      <h2>{dictionary.article.toc}</h2>
      <ol>
        {items.map((item) => (
          <li
            className={`depth-${item.depth}`}
            key={`${item.id}-${item.title}`}
          >
            <a href={`#${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
