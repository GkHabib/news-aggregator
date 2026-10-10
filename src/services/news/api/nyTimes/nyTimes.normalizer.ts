import type { Article, Category } from "@/types";
import { toCategory } from "@/services/news/api/shared/categoryMap";
import { optionalText, parseAuthors } from "@/services/news/api/shared/normalization";
import {
  nyTimesSectionMap,
  nyTimesSubsectionMap,
} from "@/services/news/api/nyTimes/nyTimes.categories";
import type { NyTimesDoc } from "@/services/news/api/nyTimes/nyTimes.types";
import { parseIsoDateTime } from "@/utils/date";

/** Subsection wins: "U.S." > "Politics" is politics, not general. */
const resolveCategory = (raw: NyTimesDoc): Category =>
  toCategory(nyTimesSubsectionMap, raw.subsection_name) ??
  toCategory(nyTimesSectionMap, raw.section_name) ??
  "general";

/** Returns undefined for incomplete docs. */
export function normalizeNyTimesDoc(raw: NyTimesDoc): Article | undefined {
  const publishedAt = parseIsoDateTime(raw.pub_date);
  if (!raw.headline.main || !raw.web_url || !publishedAt) return undefined;

  return {
    id: `nyTimes:${raw._id}`,
    sourceId: "nyTimes",
    publisher: optionalText(raw.source) ?? "The New York Times",
    title: raw.headline.main,
    summary: optionalText(raw.abstract) ?? optionalText(raw.snippet),
    url: raw.web_url,
    imageUrl: optionalText(raw.multimedia?.default?.url),
    authors: parseAuthors(raw.byline?.original),
    category: resolveCategory(raw),
    publishedAt,
  };
}
