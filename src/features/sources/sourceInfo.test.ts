import { describe, expect, it } from "vitest";
import { findCoverageGap, sourceCoverageNote } from "@/features/sources/sourceInfo";

describe("sourceCoverageNote", () => {
  it("describes what a source never covers (matches the spec copy)", () => {
    expect(sourceCoverageNote("newsApi", [])).toEqual({
      text: "Many outlets · no Politics or World",
      tone: "muted",
    });
    expect(sourceCoverageNote("guardian", [])).toEqual({ text: "No Health", tone: "muted" });
    expect(sourceCoverageNote("nyTimes", [])).toBeUndefined();
  });

  it("warns when a selected category can't come from the source", () => {
    expect(sourceCoverageNote("guardian", ["health"])).toEqual({
      text: "Doesn’t cover Health",
      tone: "warn",
    });
    expect(sourceCoverageNote("newsApi", ["politics", "world", "science"])).toEqual({
      text: "Doesn’t cover Politics or World",
      tone: "warn",
    });
  });
});

describe("findCoverageGap", () => {
  it("finds selections no selected source can serve, with alternatives", () => {
    expect(findCoverageGap(["health"], ["guardian"])).toEqual({
      sources: ["guardian"],
      categories: ["health"],
      alternatives: ["newsApi", "nyTimes"],
    });
  });

  it("is null when any selected source serves any selected category, or nothing is narrowed", () => {
    expect(findCoverageGap(["health", "politics"], ["guardian"])).toBeNull();
    expect(findCoverageGap(["health"], [])).toBeNull();
    expect(findCoverageGap([], ["guardian"])).toBeNull();
  });
});
