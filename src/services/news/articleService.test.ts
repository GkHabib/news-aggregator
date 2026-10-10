import { describe, expect, it } from "vitest";
import type { ArticleQuery, CalendarDate } from "@/types";
import { HttpError, type FetchJson } from "@/services/news/api/http";
import { createNewsSources } from "@/services/news/api/sources";
import { createArticleService } from "@/services/news/articleService";
import { AllSourcesFailedError } from "@/services/news/errors";
import { mockFetchJson } from "@/services/news/mock/mockFetchJson";

// Integration test: real clients + normalizers + service, against the mock providers.
const createService = (fetchJson: FetchJson = mockFetchJson) =>
  createArticleService(Object.values(createNewsSources(fetchJson)));

const search = (query: ArticleQuery) => createService().search(query);
const day = (value: string) => value as CalendarDate;

describe("articleService", () => {
  it("merges all sources into unique articles, newest first", async () => {
    const { articles, errors } = await search({});

    expect(errors).toEqual([]);
    expect(new Set(articles.map((a) => a.sourceId))).toEqual(
      new Set(["newsApi", "guardian", "nyTimes"]),
    );
    expect(new Set(articles.map((a) => a.id)).size).toBe(articles.length);
    const dates = articles.map((a) => a.publishedAt);
    expect(dates).toEqual(dates.toSorted().reverse());
  });

  it("routes categories only to sources that support them", async () => {
    const politics = await search({ categories: ["politics"] });
    expect(politics.articles.map((a) => a.sourceId).toSorted()).toEqual(["guardian", "nyTimes"]);

    const health = await search({ categories: ["health"] });
    expect(health.articles.map((a) => a.title)).toEqual([
      "What a new study says about sleep and memory",
    ]);
  });

  it("combines categories across sources", async () => {
    const { articles } = await search({ categories: ["technology", "politics"] });
    expect(new Set(articles.map((a) => a.category))).toEqual(new Set(["technology", "politics"]));
    expect(articles).toHaveLength(5);
  });

  it("filters by source, author, keyword and date", async () => {
    const guardian = await search({ sources: ["guardian"] });
    expect(guardian.articles.every((a) => a.sourceId === "guardian")).toBe(true);

    const byAuthor = await search({ authors: ["ruth"] });
    expect(byAuthor.articles.map((a) => a.url)).toEqual(["https://example.com/nyt/chip-startups"]);

    const byKeyword = await search({ keyword: "chip" });
    expect(byKeyword.articles).toHaveLength(2);

    const byDate = await search({ from: day("2026-10-08"), to: day("2026-10-08") });
    expect(byDate.articles.map((a) => a.title).toSorted()).toEqual([
      "Budget vote delayed as coalition talks stall",
      "Central banks signal a slower pace of rate cuts",
    ]);
  });

  it("reports a failing source without dropping the others", async () => {
    const failingGuardian: FetchJson = (url, signal) =>
      url.startsWith("/api/guardian")
        ? Promise.reject(new HttpError(429, "Rate limited"))
        : mockFetchJson(url, signal);

    const { articles, errors } = await createService(failingGuardian).search({});

    expect(errors).toEqual([{ sourceId: "guardian", message: "Rate limited", status: 429 }]);
    expect(articles.some((a) => a.sourceId === "guardian")).toBe(false);
    expect(articles.some((a) => a.sourceId === "nyTimes")).toBe(true);
  });

  it("throws only when every queried source failed", async () => {
    const offline: FetchJson = () => Promise.reject(new TypeError("Failed to fetch"));

    const failure = createService(offline).search({});
    await expect(failure).rejects.toBeInstanceOf(AllSourcesFailedError);
    await expect(failure).rejects.toMatchObject({ errors: { length: 3 } });
  });

  it("returns an empty result when no source can serve the query", async () => {
    const result = await search({ sources: ["newsApi"], categories: ["politics"] });
    expect(result).toEqual({ articles: [], errors: [], sourcesWithMore: [] });
  });

  it("reports which sources have more pages", async () => {
    expect((await search({})).sourcesWithMore).toEqual([]);

    // Pretend the Guardian has a second page.
    const pagedGuardian: FetchJson = async <T>(url: string, signal?: AbortSignal) => {
      const data = await mockFetchJson<T>(url, signal);
      if (url.startsWith("/api/guardian")) {
        Object.assign((data as { response: object }).response, { pages: 2 });
      }
      return data;
    };
    const { sourcesWithMore } = await createService(pagedGuardian).search({});
    expect(sourcesWithMore).toEqual(["guardian"]);
  });

  it("returns later pages from the mock providers", async () => {
    const { articles, sourcesWithMore } = await search({ page: 2 });
    expect(articles).toEqual([]);
    expect(sourcesWithMore).toEqual([]);
  });
});
