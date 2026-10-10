import type { Article } from "@/types";
import { toCategory } from "@/services/news/api/shared/categoryMap";
import { optionalText, parseAuthors, stripHtml } from "@/services/news/api/shared/normalization";
import { guardianSectionMap } from "@/services/news/api/guardian/guardian.categories";
import type { GuardianResult } from "@/services/news/api/guardian/guardian.types";
import { parseIsoDateTime } from "@/utils/date";

/** Returns undefined for incomplete results. */
export function normalizeGuardianResult(raw: GuardianResult): Article | undefined {
  const publishedAt = parseIsoDateTime(raw.webPublicationDate);
  if (!raw.webTitle || !raw.webUrl || !publishedAt) return undefined;

  return {
    id: `guardian:${raw.id}`,
    sourceId: "guardian",
    publisher: "The Guardian",
    title: raw.webTitle,
    summary: optionalText(raw.fields?.trailText && stripHtml(raw.fields.trailText)),
    url: raw.webUrl,
    imageUrl: optionalText(raw.fields?.thumbnail),
    authors: parseAuthors(raw.fields?.byline),
    category: toCategory(guardianSectionMap, raw.sectionId) ?? "general",
    publishedAt,
  };
}
