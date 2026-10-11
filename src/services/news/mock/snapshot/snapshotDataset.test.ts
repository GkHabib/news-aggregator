import { describe, expect, it } from "vitest";
import { createNewsSources } from "@/services/news/api/sources";
import { createArticleService } from "@/services/news/articleService";
import { fixtureDataset } from "@/services/news/mock/mockDataset";
import { createMockFetchJson } from "@/services/news/mock/mockFetchJson";
import { shiftToRecentDays, snapshotDataset } from "@/services/news/mock/snapshot/snapshotDataset";

describe("shiftToRecentDays", () => {
  const hour = 60 * 60 * 1000;
  const newestIn = (dataset: typeof fixtureDataset) =>
    Math.max(
      ...dataset.guardian.map((result) => Date.parse(result.webPublicationDate)),
      ...dataset.nyTimes.map((doc) => Date.parse(doc.pub_date)),
      ...dataset.newsApi.map(({ article }) => Date.parse(article.publishedAt)),
    );
  const capturedNewest = newestIn(fixtureDataset); // 2026-10-09T23:15:12Z
  const timesOf = (dataset: typeof fixtureDataset) => dataset.nyTimes.map((doc) => doc.pub_date);

  it("puts the newest story within the last 24 hours, never in the future", () => {
    for (const now of [
      Date.parse("2030-01-01T00:00:00.000Z"),
      Date.parse("2030-01-01T23:59:59.000Z"),
      capturedNewest + 3 * hour,
    ]) {
      const newest = newestIn(shiftToRecentDays(fixtureDataset, now));
      expect(newest).toBeLessThanOrEqual(now);
      expect(newest).toBeGreaterThan(now - 24 * hour);
    }
  });

  it("moves stories by whole days, keeping their time of day and spacing", () => {
    const shifted = shiftToRecentDays(fixtureDataset, Date.parse("2030-01-01T12:00:00.000Z"));
    const original = timesOf(fixtureDataset);
    timesOf(shifted).forEach((time, index) => {
      expect(time.slice(10)).toBe(new Date(original[index]!).toISOString().slice(10));
    });
  });

  it("gives the same timestamps on every reload until a full day has passed", () => {
    const firstLoad = Date.parse("2030-01-01T12:00:00.000Z");
    const reloads = [firstLoad + 1, firstLoad + 5 * hour];
    for (const reload of reloads) {
      expect(timesOf(shiftToRecentDays(fixtureDataset, reload))).toEqual(
        timesOf(shiftToRecentDays(fixtureDataset, firstLoad)),
      );
    }
  });

  it("does not move a snapshot that is still recent", () => {
    expect(timesOf(shiftToRecentDays(fixtureDataset, capturedNewest + hour))).toEqual(
      timesOf(fixtureDataset).map((time) => new Date(time).toISOString()),
    );
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
