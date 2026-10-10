import type { Article, Category } from "@/types";
import { optionalText, parseAuthors } from "@/services/news/api/shared/normalization";
import type { NewsApiArticle } from "@/services/news/api/newsApi/newsApi.types";
import { parseIsoDateTime } from "@/utils/date";

/** Placeholder NewsAPI returns for deleted articles. */
const removedMarker = "[Removed]";

/** Returns undefined for removed or incomplete articles. */
export function normalizeNewsApiArticle(
  raw: NewsApiArticle,
  category: Category,
): Article | undefined {
  const publishedAt = parseIsoDateTime(raw.publishedAt);
  if (!raw.title || raw.title === removedMarker || !raw.url || !publishedAt) return undefined;

  return {
    id: `newsApi:${raw.url}`,
    sourceId: "newsApi",
    publisher: raw.source.name,
    title: stripPublisherSuffix(raw.title, raw.source.name),
    summary: optionalText(raw.description),
    url: raw.url,
    imageUrl: optionalText(raw.urlToImage),
    authors: parseAuthors(raw.author),
    category,
    publishedAt,
  };
}

/** NewsAPI titles come as "Headline - Publisher". */
function stripPublisherSuffix(title: string, publisher: string): string {
  const suffix = ` - ${publisher}`;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}
