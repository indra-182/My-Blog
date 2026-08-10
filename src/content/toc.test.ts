import { describe, expect, it } from "vitest";
import { extractTableOfContents } from "./toc";

describe("extractTableOfContents", () => {
  it("extracts level two and three headings with unique ids", () => {
    const source = `## Architecture\n\n### Shared boundary\n\n## Architecture\n\n#### Ignored`;

    expect(extractTableOfContents(source)).toEqual([
      { depth: 2, title: "Architecture", id: "architecture" },
      { depth: 3, title: "Shared boundary", id: "shared-boundary" },
      { depth: 2, title: "Architecture", id: "architecture-1" },
    ]);
  });

  it("ignores markdown headings inside fenced code blocks", () => {
    const source = "```md\n## Not a heading\n```\n\n## Real heading";

    expect(extractTableOfContents(source)).toEqual([
      { depth: 2, title: "Real heading", id: "real-heading" },
    ]);
  });
});
