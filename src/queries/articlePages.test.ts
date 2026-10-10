import { describe, expect, it } from "vitest";
import type { Article, IsoDateTime, SearchResult } from "@/types";
import { firstPageParam, getNextPageParam, mergePages } from "@/queries/articlePages";

const article = (url: string, publishedAt: string): Article => ({
  id: `guardian:${url}`,
  sourceId: "guardian",
  publisher: "The Guardian",
  title: url,
  url,
  authors: [],
  category: "general",
  publishedAt: publishedAt as IsoDateTime,
});

const page = (overrides: Partial<SearchResult>): SearchResult => ({
  articles: [],
  errors: [],
  sourcesWithMore: [],
  ...overrides,
});

describe("getNextPageParam", () => {
  it("continues only with the sources that have more", () => {
    const next = getNextPageParam(page({ sourcesWithMore: ["guardian"] }), [], firstPageParam());
    expect(next).toEqual({ page: 2, sources: ["guardian"] });
  });

  it("stops when no source has more", () => {
    expect(getNextPageParam(page({}), [], { page: 4 })).toBeUndefined();
  });
});

describe("mergePages", () => {
  it("appends pages in load order without reshuffling, dropping duplicates", () => {
    const feed = mergePages({
      pageParams: [firstPageParam(), { page: 2 }],
      pages: [
        page({
          articles: [article("a", "2026-10-09T00:00:00Z"), article("b", "2026-10-05T00:00:00Z")],
        }),
        // Newer than "b", but the user has already scrolled past page 1.
        page({
          articles: [article("c", "2026-10-07T00:00:00Z"), article("a", "2026-10-09T00:00:00Z")],
        }),
      ],
    });
    expect(feed.articles.map((a) => a.url)).toEqual(["a", "b", "c"]);
  });

  it("keeps the latest error per source", () => {
    const feed = mergePages({
      pageParams: [firstPageParam(), { page: 2 }],
      pages: [
        page({ errors: [{ sourceId: "nyTimes", message: "first" }] }),
        page({ errors: [{ sourceId: "nyTimes", message: "second" }] }),
      ],
    });
    expect(feed.errors).toEqual([{ sourceId: "nyTimes", message: "second" }]);
  });
});
