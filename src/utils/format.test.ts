import { describe, expect, it } from "vitest";
import type { IsoDateTime } from "@/types";
import { formatAuthors, formatCategory, formatRelativeTime, summarizeList } from "@/utils/format";

const now = Date.parse("2026-10-11T12:00:00Z");
const at = (value: string) => value as IsoDateTime;

describe("formatRelativeTime", () => {
  it("uses the largest whole unit up to a week, then a short date", () => {
    expect(formatRelativeTime(at("2026-10-11T11:59:30Z"), now)).toBe("just now");
    expect(formatRelativeTime(at("2026-10-11T11:55:00Z"), now)).toBe("5m ago");
    expect(formatRelativeTime(at("2026-10-11T09:00:00Z"), now)).toBe("3h ago");
    expect(formatRelativeTime(at("2026-10-09T12:00:00Z"), now)).toBe("2d ago");
    expect(formatRelativeTime(at("2026-10-01T12:00:00Z"), now)).toBe("1 Oct");
  });
});

describe("formatAuthors", () => {
  const names = (...list: string[]) => list.map((name) => ({ name }));

  it("joins names with commas and a final ampersand", () => {
    expect(formatAuthors([])).toBe("");
    expect(formatAuthors(names("Daniel Park"))).toBe("Daniel Park");
    expect(formatAuthors(names("Daniel Park", "Ruth Klein"))).toBe("Daniel Park & Ruth Klein");
    expect(formatAuthors(names("A", "B", "C"))).toBe("A, B & C");
  });
});

describe("summarizeList", () => {
  it("collapses the tail into 'and N more'", () => {
    expect(summarizeList(["A", "B"], 3)).toBe("A, B");
    expect(summarizeList(["A", "B", "C", "D", "E"], 3)).toBe("A, B, C and 2 more");
  });
});

it("formatCategory capitalizes", () => {
  expect(formatCategory("technology")).toBe("Technology");
});
