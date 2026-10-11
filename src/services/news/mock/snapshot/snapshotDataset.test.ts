import { describe, expect, it } from "vitest";
import { createNewsSources } from "@/services/news/api/sources";
import { createArticleService } from "@/services/news/articleService";
import { fixtureDataset } from "@/services/news/mock/mockDataset";
import { createMockFetchJson } from "@/services/news/mock/mockFetchJson";
import { shiftToNow, snapshotDataset } from "@/services/news/mock/snapshot/snapshotDataset";

describe("shiftToNow", () => {
  it("moves the newest story to now and keeps the spacing between stories", () => {
    const now = Date.parse("2030-01-01T12:00:00.000Z");
    const shifted = shiftToNow(fixtureDataset, now);

    const newest = Math.max(
      ...shifted.guardian.map((result) => Date.parse(result.webPublicationDate)),
      ...shifted.nyTimes.map((doc) => Date.parse(doc.pub_date)),
      ...shifted.newsApi.map(({ article }) => Date.parse(article.publishedAt)),
    );
    expect(newest).toBe(now);

    const gap = (dataset: typeof fixtureDataset) =>
      Date.parse(dataset.nyTimes[0]!.pub_date) - Date.parse(dataset.nyTimes[1]!.pub_date);
    expect(gap(shifted)).toBe(gap(fixtureDataset));
  });
});

// Guards future `pnpm mock:capture` refreshes: the snapshot must still fit our
// raw types and give the dev feed every provider, category coverage and paging.
describe("captured snapshot", () => {
  const service = createArticleService(
    Object.values(createNewsSources(createMockFetchJson(snapshotDataset))),
  );

  it("feeds every provider through the real normalizers, with more pages to load", async () => {
    const { articles, errors, sourcesWithMore } = await service.search({});

    expect(errors).toEqual([]);
    expect(new Set(articles.map((article) => article.sourceId))).toEqual(
      new Set(["newsApi", "guardian", "nyTimes"]),
    );
    expect(sourcesWithMore.length).toBeGreaterThan(0);
  });

  it("has stories for every category", async () => {
    const categories = [
      "business",
      "entertainment",
      "general",
      "health",
      "politics",
      "science",
      "sports",
      "technology",
      "world",
    ] as const;
    for (const category of categories) {
      const { articles } = await service.search({ categories: [category] });
      expect(articles.length, category).toBeGreaterThan(0);
    }
  });
});
