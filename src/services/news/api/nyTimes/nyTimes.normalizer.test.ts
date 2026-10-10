import { describe, expect, it } from "vitest";
import { normalizeNyTimesDoc } from "@/services/news/api/nyTimes/nyTimes.normalizer";
import type { NyTimesDoc } from "@/services/news/api/nyTimes/nyTimes.types";

const raw: NyTimesDoc = {
  _id: "nyt://article/0002",
  web_url: "https://example.com/n",
  headline: { main: "Senate Hearing Turns Tense" },
  abstract: "",
  snippet: "Five hours of questions.",
  byline: { original: "By Grace Miller" },
  multimedia: { default: { url: "https://example.com/n.jpg" } },
  pub_date: "2026-10-07T16:40:00Z",
  section_name: "U.S.",
  subsection_name: "Politics",
  source: "The New York Times",
};

describe("normalizeNyTimesDoc", () => {
  it("maps a raw doc to the domain model", () => {
    expect(normalizeNyTimesDoc(raw)).toEqual({
      id: "nyTimes:nyt://article/0002",
      sourceId: "nyTimes",
      publisher: "The New York Times",
      title: "Senate Hearing Turns Tense",
      summary: "Five hours of questions.",
      url: "https://example.com/n",
      imageUrl: "https://example.com/n.jpg",
      authors: [{ name: "Grace Miller" }],
      category: "politics",
      publishedAt: "2026-10-07T16:40:00.000Z",
    });
  });

  it("resolves category by section when the subsection is unmapped", () => {
    expect(
      normalizeNyTimesDoc({ ...raw, section_name: "Business", subsection_name: "DealBook" }),
    ).toMatchObject({ category: "business" });
    expect(
      normalizeNyTimesDoc({ ...raw, section_name: "Opinion", subsection_name: "" }),
    ).toMatchObject({ category: "general" });
  });

  it("tolerates missing images and bylines", () => {
    expect(
      normalizeNyTimesDoc({ ...raw, multimedia: null, byline: { original: null } }),
    ).toMatchObject({ imageUrl: undefined, authors: [] });
  });
});
