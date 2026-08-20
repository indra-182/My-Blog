import type { TableOfContentsItem } from "@/content/toc";
import dictionary from "@/i18n/messages/id.json";

export function TableOfContents({ items }: { items: TableOfContentsItem[] }) {
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
