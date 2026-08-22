import { describe, expect, it } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("formats dates pinned to Asia/Jakarta regardless of offset", () => {
    expect(formatDate("2026-08-01T00:00:00Z")).toBe("1 Agu 2026");
    expect(formatDate("2026-08-01T20:00:00+07:00")).toBe("1 Agu 2026");
  });

  it("supports long style", () => {
    expect(formatDate("2026-08-01T20:00:00+07:00", "long")).toBe(
      "1 Agustus 2026",
    );
  });
});
