import { describe, expect, it } from "vitest";
import type { Article, IsoDateTime, SearchResult } from "@/types";
import { collectAuthorNames } from "@/queries/knownAuthors";

const article = (id: string, ...authors: string[]): Article => ({
  id: `guardian:${id}`,
  sourceId: "guardian",
  publisher: "The Guardian",
  title: id,
  url: `https://example.com/${id}`,
  authors: authors.map((name) => ({ name })),
  category: "general",
  publishedAt: "2026-10-09T00:00:00.000Z" as IsoDateTime,
});

const feed = (...pages: Article[][]) => ({
  pages: pages.map((articles): SearchResult => ({ articles, errors: [], sourcesWithMore: [] })),
  pageParams: pages.map((_, index) => index),
});

describe("collectAuthorNames", () => {
  it("collects unique authors across feeds and pages, sorted", () => {
    const names = collectAuthorNames([
      feed([article("a", "Ruth Klein", "Daniel Park")], [article("b", "Mira Osei")]),
      feed([article("c", "ruth klein"), article("d")]),
      undefined,
    ]);
    expect(names).toEqual(["Daniel Park", "Mira Osei", "Ruth Klein"]);
  });

  it("leaves out authors already followed, ignoring case", () => {
    const names = collectAuthorNames(
      [feed([article("a", "Ruth Klein", "Daniel Park")])],
      ["RUTH KLEIN"],
    );
    expect(names).toEqual(["Daniel Park"]);
  });
});
