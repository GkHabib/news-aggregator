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

  // Real bylines from the captured snapshot.
  it("drops job titles, keeping the surname", () => {
    expect(names("Aletha Adu Political correspondent")).toEqual(["Aletha Adu"]);
    expect(names("Ian Sample Science editor")).toEqual(["Ian Sample"]);
    expect(names("Dan Milmo Global technology editor")).toEqual(["Dan Milmo"]);
    expect(names("Hannah Al-Othman North of England correspondent")).toEqual(["Hannah Al-Othman"]);
    // The title contains "and", so it must go before splitting on "and".
    expect(names("Tobi Thomas Health and inequalities correspondent ")).toEqual(["Tobi Thomas"]);
    expect(names("Dan Sabbagh Defence and security editor")).toEqual(["Dan Sabbagh"]);
  });

  it("drops where the story was filed from", () => {
    expect(names("Edward Helmore in New York ")).toEqual(["Edward Helmore"]);
    expect(names("Gerard Meagher at DPD Stadium at Franklin's Gardens")).toEqual([
      "Gerard Meagher",
    ]);
    expect(names("Hannah Ellis-Petersen and Aakash Hassan in Delhi")).toEqual([
      "Hannah Ellis-Petersen",
      "Aakash Hassan",
    ]);
  });

  it("drops live-blog shift notes and other contributors' credits", () => {
    expect(names("Rob Smyth (earlier) and James Wallace (now)")).toEqual([
      "Rob Smyth",
      "James Wallace",
    ]);
    expect(names("Marina Dunbar (now); José Olivares and Taz Ali (earlier)")).toEqual([
      "Marina Dunbar",
      "José Olivares",
      "Taz Ali",
    ]);
    expect(names("Pjotr Sauer in Kyiv. Photography by Julia Kochetova")).toEqual(["Pjotr Sauer"]);
    expect(names("Lillian Crawford; as told to Olivia Ladanyi")).toEqual([
      "Lillian Crawford",
      "Olivia Ladanyi",
    ]);
  });

  it("drops credits that aren't a person", () => {
    expect(names("Guardian staff")).toEqual([]);
    expect(names("Guardian staff and agencies")).toEqual([]);
    expect(names("Patrick Wintour and agencies")).toEqual(["Patrick Wintour"]);
    expect(names("6abc Digital Staff")).toEqual([]);
    expect(
      names("https://www.newson6.com/samantha-rupe, https://www.newson6.com/makayla-glenn"),
    ).toEqual([]);
  });
});
