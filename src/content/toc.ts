import { toString as mdastToString } from "mdast-util-to-string";
import { unified } from "unified";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";

export type TableOfContentsItem = { depth: 2 | 3; title: string; id: string };

export function extractTableOfContents(source: string): TableOfContentsItem[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const slugger = new GithubSlugger();
  const items: TableOfContentsItem[] = [];

  visit(tree, "heading", (node: { depth?: number; children?: unknown[] }) => {
    if (node.depth !== 2 && node.depth !== 3) return;
    const title = mdastToString(node as Parameters<typeof mdastToString>[0]);
    items.push({ depth: node.depth, title, id: slugger.slug(title) });
  });

  return items;
}
