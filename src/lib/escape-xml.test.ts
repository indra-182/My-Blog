import { describe, expect, it } from "vitest";
import { escapeXml } from "./escape-xml";

describe("escapeXml", () => {
  it("escapes all XML special characters", () => {
    expect(escapeXml(`<a href="x">&'`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&apos;",
    );
  });

  it("leaves safe text untouched", () => {
    expect(escapeXml("React 19: state & props")).toBe(
      "React 19: state &amp; props",
    );
    expect(escapeXml("")).toBe("");
  });
});
