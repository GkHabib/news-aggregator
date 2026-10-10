import { describe, expect, it } from "vitest";
import type { CalendarDate } from "@/types";
import { normalizeArticleQuery } from "@/services/news/articleQuery";

describe("normalizeArticleQuery", () => {
  it("makes equivalent queries deeply equal", () => {
    const a = normalizeArticleQuery({
      keyword: "  climate ",
      categories: ["technology", "politics", "technology"],
      authors: [" Grace Miller", ""],
    });
    const b = normalizeArticleQuery({
      keyword: "climate",
      categories: ["politics", "technology"],
      authors: ["grace miller"],
    });
    expect(a).toEqual(b);
    expect(a).toEqual({
      keyword: "climate",
      categories: ["politics", "technology"],
      authors: ["grace miller"],
    });
  });

  it("drops empty values and the default page", () => {
    expect(
      normalizeArticleQuery({ keyword: " ", categories: [], sources: [], authors: [], page: 1 }),
    ).toEqual({});
    expect(Object.keys(normalizeArticleQuery({}))).toEqual([]);
  });

  it("keeps dates and later pages as they are", () => {
    const from = "2026-10-01" as CalendarDate;
    expect(normalizeArticleQuery({ from, page: 3 })).toEqual({ from, page: 3 });
  });
});
