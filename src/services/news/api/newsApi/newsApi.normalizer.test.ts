import { describe, expect, it } from "vitest";
import { normalizeNewsApiArticle } from "@/services/news/api/newsApi/newsApi.normalizer";
import type { NewsApiArticle } from "@/services/news/api/newsApi/newsApi.types";

const raw: NewsApiArticle = {
  source: { id: "the-verge", name: "The Verge" },
  author: "Alex Rivera, Sam Chen",
  title: "Foldable laptops tested - The Verge",
  description: "A week with three laptops.",
  url: "https://example.com/a",
  urlToImage: "",
  publishedAt: "2026-10-09T13:36:02Z",
};

describe("normalizeNewsApiArticle", () => {
  it("maps a raw article to the domain model", () => {
    expect(normalizeNewsApiArticle(raw, "technology")).toEqual({
      id: "newsApi:https://example.com/a",
      sourceId: "newsApi",
      publisher: "The Verge",
      title: "Foldable laptops tested",
      summary: "A week with three laptops.",
      url: "https://example.com/a",
      imageUrl: undefined,
      authors: [{ name: "Alex Rivera" }, { name: "Sam Chen" }],
      category: "technology",
      publishedAt: "2026-10-09T13:36:02.000Z",
    });
  });

  it("drops an outlet named as the author", () => {
    const outletAsAuthor = { ...raw, source: { id: null, name: "ABC News" } };
    expect(
      normalizeNewsApiArticle({ ...outletAsAuthor, author: "ABC News - Breaking News" }, "general")
        ?.authors,
    ).toEqual([]);
    expect(
      normalizeNewsApiArticle({ ...outletAsAuthor, author: "Jane Doe" }, "general")?.authors,
    ).toEqual([{ name: "Jane Doe" }]);
  });

  it("drops removed and incomplete articles", () => {
    expect(normalizeNewsApiArticle({ ...raw, title: "[Removed]" }, "general")).toBeUndefined();
    expect(normalizeNewsApiArticle({ ...raw, url: null }, "general")).toBeUndefined();
    expect(normalizeNewsApiArticle({ ...raw, publishedAt: "" }, "general")).toBeUndefined();
  });
});
