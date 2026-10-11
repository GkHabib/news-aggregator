import type { GuardianResult } from "@/services/news/api/guardian/guardian.types";
import type { NyTimesDoc } from "@/services/news/api/nyTimes/nyTimes.types";
import type { MockDataset } from "@/services/news/mock/mockDataset";
import type { NewsApiFixture } from "@/services/news/mock/newsApi/newsApi.fixtures";
import guardianSnapshot from "@/services/news/mock/snapshot/guardian.json";
import newsApiSnapshot from "@/services/news/mock/snapshot/newsApi.json";
import nyTimesSnapshot from "@/services/news/mock/snapshot/nyTimes.json";

// Real responses captured with `pnpm mock:capture` (see scripts/), trimmed to
// the fields our raw types use. Used by `pnpm dev` in mock mode.

const newsApi = newsApiSnapshot as NewsApiFixture[];
const guardian = guardianSnapshot as GuardianResult[];
const nyTimes = nyTimesSnapshot as NyTimesDoc[];

const dayMs = 24 * 60 * 60 * 1000;

/**
 * Moves every timestamp forward by the same whole number of days, so the newest
 * story falls within the last 24 hours. Keeps the snapshot useful for date
 * filters (Today, Past week) long after it was captured, while each story keeps
 * its time of day and its spacing to the others. Whole days make the result
 * stable: reloading gives the same timestamps (they only move on by a day once
 * a full day has passed), and no story ever lands in the future.
 */
export function shiftToRecentDays(dataset: MockDataset, now = Date.now()): MockDataset {
  const timestamps = [
    ...dataset.newsApi.map(({ article }) => article.publishedAt),
    ...dataset.guardian.map((result) => result.webPublicationDate),
    ...dataset.nyTimes.map((doc) => doc.pub_date),
  ].map(Date.parse);
  const offset = Math.floor((now - Math.max(...timestamps)) / dayMs) * dayMs;
  const shift = (date: string) => new Date(Date.parse(date) + offset).toISOString();

  return {
    newsApi: dataset.newsApi.map((fixture) => ({
      ...fixture,
      article: { ...fixture.article, publishedAt: shift(fixture.article.publishedAt) },
    })),
    guardian: dataset.guardian.map((result) => ({
      ...result,
      webPublicationDate: shift(result.webPublicationDate),
    })),
    nyTimes: dataset.nyTimes.map((doc) => ({ ...doc, pub_date: shift(doc.pub_date) })),
  };
}

export const snapshotDataset: MockDataset = shiftToRecentDays({ newsApi, guardian, nyTimes });
