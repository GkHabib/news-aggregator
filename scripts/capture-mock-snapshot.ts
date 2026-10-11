// Captures a realistic mock snapshot from the real APIs, through the app's own
// proxy (so API keys stay server-side). Run a real-data dev server first:
//
//   ENABLE_MOCK_DATA=false pnpm dev
//   pnpm mock:capture            # or: pnpm mock:capture http://localhost:3001
//
// Budget: 14 requests (7 NewsAPI, 3 Guardian, 4 NYT). Responses are trimmed to
// the fields our raw types use and written to src/services/news/mock/snapshot/.
// Typed against the app's own raw provider types, so they can't drift apart.
// Node 24 runs this TypeScript file directly (type stripping), no build step.

import { mkdir, writeFile } from "node:fs/promises";
import type {
  GuardianResponse,
  GuardianResult,
} from "../src/services/news/api/guardian/guardian.types.ts";
import type {
  NewsApiArticle,
  NewsApiCategory,
  NewsApiResponse,
} from "../src/services/news/api/newsApi/newsApi.types.ts";
import type {
  NyTimesDoc,
  NyTimesResponse,
} from "../src/services/news/api/nyTimes/nyTimes.types.ts";

/** Same shape as the mock's NewsApiFixture: NewsAPI responses carry no category. */
interface NewsApiSnapshotItem {
  category: NewsApiCategory;
  article: NewsApiArticle;
}

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = new URL("../src/services/news/mock/snapshot/", import.meta.url);
let requestCount = 0;

async function get<T>(path: string): Promise<T> {
  requestCount++;
  const response = await fetch(new URL(path, base));
  if (!response.ok) throw new Error(`${response.status} for ${path}`);
  return (await response.json()) as T;
}

const uniqueBy = <T>(items: readonly T[], key: (item: T) => string): T[] => [
  ...new Map(items.map((item) => [key(item), item] as const)).values(),
];

// NewsAPI responses carry no category, so ask per category and remember it.
async function captureNewsApi(): Promise<NewsApiSnapshotItem[]> {
  const categories: NewsApiCategory[] = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];
  const fixtures: NewsApiSnapshotItem[] = [];
  for (const category of categories) {
    const { articles } = await get<NewsApiResponse>(
      `/api/newsapi/top-headlines?country=us&category=${category}&pageSize=20`,
    );
    for (const article of articles) {
      fixtures.push({
        category,
        article: {
          source: { id: article.source.id, name: article.source.name },
          author: article.author,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
        },
      });
    }
  }
  return uniqueBy(fixtures, (fixture) => fixture.article.url ?? "");
}

async function captureGuardian(): Promise<GuardianResult[]> {
  const fields = "show-fields=trailText,byline,thumbnail&order-by=newest";
  const queries = [
    `page-size=50&${fields}`,
    `page-size=30&section=politics|world|science&${fields}`,
    `page-size=30&section=technology|business|sport|culture|film|music&${fields}`,
  ];
  const results: GuardianResult[] = [];
  for (const query of queries) {
    const { response } = await get<GuardianResponse>(`/api/guardian/search?${query}`);
    results.push(
      ...response.results.map((result) => ({
        id: result.id,
        type: result.type,
        sectionId: result.sectionId,
        sectionName: result.sectionName,
        webPublicationDate: result.webPublicationDate,
        webTitle: result.webTitle,
        webUrl: result.webUrl,
        fields: result.fields,
      })),
    );
  }
  return uniqueBy(results, (result) => result.id);
}

async function captureNyTimes(): Promise<NyTimesDoc[]> {
  const queries = [
    "sort=newest&page=0",
    "sort=newest&page=1",
    `sort=newest&page=0&fq=${encodeURIComponent('section.name:("Technology" "Science" "Health" "Business")')}`,
    `sort=newest&page=0&fq=${encodeURIComponent('subsection.name:("Politics") OR section.name:("World")')}`,
  ];
  const docs: NyTimesDoc[] = [];
  for (const query of queries) {
    const { response } = await get<NyTimesResponse>(`/api/nytimes/articlesearch.json?${query}`);
    docs.push(
      ...(response.docs ?? []).map((doc): NyTimesDoc => ({
        _id: doc._id,
        web_url: doc.web_url,
        headline: { main: doc.headline?.main ?? "" },
        abstract: doc.abstract,
        snippet: doc.snippet,
        byline: { original: doc.byline?.original ?? null },
        multimedia: doc.multimedia?.default?.url
          ? { default: { url: doc.multimedia.default.url } }
          : null,
        pub_date: doc.pub_date,
        section_name: doc.section_name,
        subsection_name: doc.subsection_name,
        source: doc.source,
      })),
    );
    // NYT allows 5 requests per minute.
    await new Promise((resolve) => setTimeout(resolve, 12_000));
  }
  return uniqueBy(docs, (doc) => doc._id);
}

const snapshot = {
  newsApi: await captureNewsApi(),
  guardian: await captureGuardian(),
  nyTimes: await captureNyTimes(),
};

await mkdir(outDir, { recursive: true });
for (const [name, data] of Object.entries(snapshot)) {
  await writeFile(new URL(`${name}.json`, outDir), `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${name}: ${data.length} items`);
}
console.log(`captured ${new Date().toISOString()} with ${requestCount} requests`);
