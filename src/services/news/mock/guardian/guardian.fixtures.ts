import type { GuardianResult } from "@/services/news/api/guardian/guardian.types";
import { fixtureImage } from "@/services/news/mock/mockUtils";

export const guardianFixtures: readonly GuardianResult[] = [
  {
    id: "technology/2026/oct/09/ai-chip-export-rules",
    type: "article",
    sectionId: "technology",
    sectionName: "Technology",
    webPublicationDate: "2026-10-09T18:20:00Z",
    webTitle: "New AI chip export rules leave manufacturers scrambling",
    webUrl: "https://example.com/guardian/ai-chip-export-rules",
    fields: {
      trailText: "<p>Companies have <strong>90 days</strong> to comply with the new regime</p>",
      byline: "Hannah Okafor",
      thumbnail: fixtureImage("chips"),
    },
  },
  {
    id: "politics/2026/oct/08/budget-vote",
    type: "article",
    sectionId: "politics",
    sectionName: "Politics",
    webPublicationDate: "2026-10-08T12:00:00Z",
    webTitle: "Budget vote delayed as coalition talks stall",
    webUrl: "https://example.com/guardian/budget-vote",
    fields: {
      trailText: "Ministers expect a decision next week",
      byline: "Tom Hughes and Aisha Rahman",
      thumbnail: fixtureImage("parliament"),
    },
  },
  {
    id: "film/2026/oct/05/festival-review",
    type: "article",
    sectionId: "film",
    sectionName: "Film",
    webPublicationDate: "2026-10-05T09:30:00Z",
    webTitle: "Festival review: a quiet drama steals the show",
    webUrl: "https://example.com/guardian/festival-review",
    fields: { trailText: "Four stars for an understated debut", byline: "Lena Fischer" },
  },
  {
    id: "environment/2026/oct/02/river-restoration",
    type: "article",
    sectionId: "environment",
    sectionName: "Environment",
    webPublicationDate: "2026-10-02T15:45:00Z",
    webTitle: "River restoration project brings back salmon",
    webUrl: "https://example.com/guardian/river-restoration",
    fields: { thumbnail: fixtureImage("river") },
  },
];
