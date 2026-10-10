import { describe, expect, it } from "vitest";
import { parseAuthors } from "@/services/news/api/shared/normalization";

const names = (byline: string | null) => parseAuthors(byline).map((author) => author.name);

describe("parseAuthors", () => {
  it("splits bylines on commas, 'and' and '&', dropping the 'By' prefix", () => {
    expect(names("By Daniel Park and Ruth Klein")).toEqual(["Daniel Park", "Ruth Klein"]);
    expect(names("Antonio G. Di Benedetto, David Pierce & Stevie Bonifield")).toEqual([
      "Antonio G. Di Benedetto",
      "David Pierce",
      "Stevie Bonifield",
    ]);
  });

  it("drops URLs, blanks and duplicates", () => {
    expect(names("https://example.com/authors/jane")).toEqual([]);
    expect(names("Jane Doe, , Jane Doe")).toEqual(["Jane Doe"]);
    expect(names(null)).toEqual([]);
  });

  it("does not split names that merely contain 'and'", () => {
    expect(names("Alexandra Anderson")).toEqual(["Alexandra Anderson"]);
  });
});
