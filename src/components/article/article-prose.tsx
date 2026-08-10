import { MDXRemote } from "next-mdx-remote/rsc";
import { Children, isValidElement } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { PostDocument } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";
import { CodeBlock } from "./code-block";

export async function ArticleProse({
  post,
  dictionary,
}: {
  post: PostDocument;
  dictionary: Dictionary;
}) {
  function extractText(node: React.ReactNode): string {
    if (typeof node === "string" || typeof node === "number")
      return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (isValidElement(node)) {
      const props = node.props as {
        children?: React.ReactNode;
        "data-line"?: string;
      };
      const text = extractText(props.children);
      return props["data-line"] !== undefined ? `${text}\n` : text;
    }
    return "";
  }
  const components = {
    pre: ({ children }: { children?: React.ReactNode }) => {
      const child = Children.toArray(children)[0];
      if (isValidElement(child)) {
        const props = child.props as {
          children?: React.ReactNode;
          className?: string;
          "data-language"?: string;
        };
        const language =
          props["data-language"] ??
          props.className?.match(/language-([\w-]+)/)?.[1];
        return (
          <CodeBlock
            code={extractText(props.children).replace(/\n$/, "")}
            highlightedCode={props.children}
            language={language}
            dictionary={dictionary}
          />
        );
      }
      return <pre>{children}</pre>;
    },
  };
  return (
    <div className="prose">
      <MDXRemote
        source={post.source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              rehypeAutolinkHeadings,
              [rehypePrettyCode, { theme: "dracula" }],
            ],
          },
        }}
      />
    </div>
  );
}
