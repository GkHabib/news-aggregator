import { describe, expect, it } from "vitest";
import { parseCalendarDate, parseIsoDateTime, toCalendarDate } from "@/utils/date";

describe("date utils", () => {
  it("normalizes any parseable timestamp to UTC ISO", () => {
    expect(parseIsoDateTime("2026-10-10T16:03:30+0200")).toBe("2026-10-10T14:03:30.000Z");
    expect(parseIsoDateTime("not a date")).toBeUndefined();
    expect(parseIsoDateTime(null)).toBeUndefined();
  });

  it("accepts only real YYYY-MM-DD calendar dates", () => {
    expect(parseCalendarDate("2026-10-09")).toBe("2026-10-09");
    expect(parseCalendarDate("2026-02-30")).toBeUndefined();
    expect(parseCalendarDate("2026-10-09T00:00:00Z")).toBeUndefined();
    expect(parseCalendarDate("")).toBeUndefined();
  });

  it("takes the UTC day of a timestamp", () => {
    expect(toCalendarDate(parseIsoDateTime("2026-10-09T23:59:59Z")!)).toBe("2026-10-09");
  });
});
