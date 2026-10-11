// @vitest-environment jsdom
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Article, IsoDateTime, SearchResult } from "@/types";
import { maxPagesWhileEmpty, useArticles } from "@/queries/useArticles";
import { articleService } from "@/services/news";

const article: Article = {
  id: "guardian:match",
  sourceId: "guardian",
  publisher: "The Guardian",
  title: "A matching story",
  url: "https://example.com/match",
  authors: [{ name: "Patrick Wintour" }],
  category: "world",
  publishedAt: "2026-10-09T00:00:00.000Z" as IsoDateTime,
};

const empty: SearchResult = { articles: [], errors: [], sourcesWithMore: ["guardian"] };
const withMatch: SearchResult = { articles: [article], errors: [], sourcesWithMore: ["guardian"] };

/** The service answers page by page from `pages`; the last answer repeats. */
function serviceAnswers(...pages: SearchResult[]) {
  return vi
    .spyOn(articleService, "search")
    .mockImplementation(async (query) => pages[Math.min((query.page ?? 1) - 1, pages.length - 1)]!);
}

function renderUseArticles() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(() => useArticles({ authors: ["patrick wintour"] }), { wrapper });
}

describe("useArticles", () => {
  afterEach(() => vi.restoreAllMocks());

  it("keeps loading pages while nothing matched yet, until a page has stories", async () => {
    const search = serviceAnswers(empty, withMatch);
    const { result } = renderUseArticles();

    await waitFor(() => expect(result.current.data?.articles).toEqual([article]));
    expect(search).toHaveBeenCalledTimes(2);
    expect(result.current.isSearchingFurther).toBe(false);
  });

  it(`gives up after ${maxPagesWhileEmpty} empty pages to protect the API quotas`, async () => {
    const search = serviceAnswers(empty);
    const { result } = renderUseArticles();

    await waitFor(() => expect(result.current.data?.pageCount).toBe(maxPagesWhileEmpty));
    await waitFor(() => expect(result.current.isFetchingNextPage).toBe(false));
    expect(search).toHaveBeenCalledTimes(maxPagesWhileEmpty);
    expect(result.current.isSearchingFurther).toBe(false);
    expect(result.current.hasNextPage).toBe(true); // more exist; scrolling can still load them
  });

  it("does not load ahead once there are stories to show", async () => {
    const search = serviceAnswers(withMatch);
    const { result } = renderUseArticles();

    await waitFor(() => expect(result.current.data?.articles).toHaveLength(1));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(search).toHaveBeenCalledTimes(1);
  });
});
