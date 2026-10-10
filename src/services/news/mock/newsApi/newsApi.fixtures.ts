import type { NewsApiArticle, NewsApiCategory } from "@/services/news/api/newsApi/newsApi.types";
import { fixtureImage } from "@/services/news/mock/mockUtils";

/**
 * NewsAPI responses carry no category, but the real server knows it. The fake
 * server needs it too, so each fixture is stored next to its category.
 */
export interface NewsApiFixture {
  category: NewsApiCategory;
  article: NewsApiArticle;
}

export const newsApiFixtures: readonly NewsApiFixture[] = [
  {
    category: "technology",
    article: {
      source: { id: "the-verge", name: "The Verge" },
      author: "Alex Rivera, Sam Chen",
      title: "Foldable laptops finally make sense, after a week of testing - The Verge",
      description:
        "We spent a week with three foldable laptops to see if the form factor is ready.",
      url: "https://example.com/verge/foldable-laptops",
      urlToImage: fixtureImage("foldable"),
      publishedAt: "2026-10-09T13:36:02Z",
    },
  },
  {
    category: "business",
    article: {
      source: { id: "reuters", name: "Reuters" },
      author: "Maria Lopez",
      title: "Central banks signal a slower pace of rate cuts - Reuters",
      description: "Policymakers in several major economies hinted at a pause in easing.",
      url: "https://example.com/reuters/rate-cuts",
      urlToImage: fixtureImage("banks"),
      publishedAt: "2026-10-08T07:15:00Z",
    },
  },
  {
    category: "sports",
    article: {
      source: { id: "espn", name: "ESPN" },
      author: null,
      title: "Underdogs clinch a playoff spot on the final day",
      description: null,
      url: "https://example.com/espn/playoffs",
      urlToImage: null,
      publishedAt: "2026-10-06T21:02:00Z",
    },
  },
  {
    category: "health",
    article: {
      source: { id: null, name: "Healthline" },
      author: "https://www.healthline.com/authors/priya-natarajan",
      title: "What a new study says about sleep and memory - Healthline",
      description: "Researchers tracked 4,000 adults for a decade.",
      url: "https://example.com/healthline/sleep-memory",
      urlToImage: fixtureImage("sleep"),
      publishedAt: "2026-10-03T10:00:00Z",
    },
  },
  {
    category: "general",
    article: {
      // Placeholder NewsAPI returns for deleted articles; the normalizer drops it.
      source: { id: null, name: "[Removed]" },
      author: null,
      title: "[Removed]",
      description: "[Removed]",
      url: "https://removed.com",
      urlToImage: null,
      publishedAt: "1970-01-01T00:00:00Z",
    },
  },
];
