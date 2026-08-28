import type { TableOfContentsItem } from "@/content/toc";
import dictionary from "@/i18n/messages/id.json";

export function TableOfContents({ items }: { items: TableOfContentsItem[] }) {
  if (items.length < 2) return null;
  return (
    <nav
      className="sticky top-[6.5rem] border-l border-border pl-4 max-[767px]:static max-[767px]:order-[-1]"
      aria-label={dictionary.article.toc}
    >
      <h2 className="m-0 mb-[0.85rem] font-mono text-[0.65rem] font-[700] leading-[1.4] tracking-[0.16em] text-muted-foreground uppercase">
        {dictionary.article.toc}
      </h2>
      <ol className="m-0 grid list-none gap-[0.6rem] p-0">
        {items.map((item) => (
          <li
            className={item.depth === 3 ? "pl-[0.7rem]" : undefined}
            key={`${item.id}-${item.title}`}
          >
            <a
              className="text-[0.8rem] leading-[1.4] text-muted-foreground underline decoration-transparent transition-[color,text-decoration-color] duration-[var(--motion-fast)] ease hover:text-cue-rose hover:decoration-current focus-visible:text-cue-rose focus-visible:decoration-current"
              href={`#${item.id}`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
