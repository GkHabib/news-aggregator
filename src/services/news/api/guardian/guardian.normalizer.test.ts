import { describe, expect, it } from "vitest";
import { normalizeGuardianResult } from "@/services/news/api/guardian/guardian.normalizer";
import type { GuardianResult } from "@/services/news/api/guardian/guardian.types";

const raw: GuardianResult = {
  id: "film/2026/oct/05/festival-review",
  type: "article",
  sectionId: "film",
  sectionName: "Film",
  webPublicationDate: "2026-10-05T09:30:00Z",
  webTitle: "Festival review",
  webUrl: "https://example.com/g",
  fields: {
    trailText: "<p>Four <strong>stars</strong></p>",
    byline: "Tom Hughes and Aisha Rahman",
  },
};

describe("normalizeGuardianResult", () => {
  it("maps a raw result to the domain model", () => {
    expect(normalizeGuardianResult(raw)).toEqual({
      id: "guardian:film/2026/oct/05/festival-review",
      sourceId: "guardian",
      publisher: "The Guardian",
      title: "Festival review",
      summary: "Four stars",
      url: "https://example.com/g",
      imageUrl: undefined,
      authors: [{ name: "Tom Hughes" }, { name: "Aisha Rahman" }],
      category: "entertainment",
      publishedAt: "2026-10-05T09:30:00.000Z",
    });
  });

  it("falls back to 'general' for unmapped sections and tolerates missing fields", () => {
    const article = normalizeGuardianResult({
      ...raw,
      sectionId: "environment",
      fields: undefined,
    });
    expect(article).toMatchObject({ category: "general", summary: undefined, authors: [] });
  });
});
