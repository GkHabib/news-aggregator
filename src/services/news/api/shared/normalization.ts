import type { Author } from "@/types";

const bylinePrefix = /^by\s+/i;
const authorSeparator = /\s*[,;]\s*|\s+and\s+|\s*&\s*/i;
const url = /^https?:\/\//i;

/** Trailing credits for other contributors: "… in Kyiv. Photography by Julia Kochetova". */
const contributorCredit =
  /\.\s+(?:photography|photographs|pictures|video|illustrations?|additional reporting)\b.*$/i;
/** Live-blog shift notes: "Rob Smyth (earlier)". */
const parenthetical = /\s*\([^)]*\)/g;
/**
 * A job title after the name, as the Guardian writes them: "Aletha Adu Political
 * correspondent", "Tobi Thomas Health and inequalities correspondent", "Hannah
 * Al-Othman North of England correspondent". It starts at a capitalized word followed
 * only by lowercase words (or "of Place"), so the surname before it is never taken.
 * Removed before splitting, since titles can contain "and".
 */
const jobTitle =
  /\s+[A-Z][\p{L}'’-]*(?:\s+(?:of|for)\s+[A-Z][\p{L}'’-]*|\s+[a-z][\p{L}'’-]*)*?\s+(?:correspondent|editor|reporter|writer|columnist|critic|analyst|commentator)s?$/u;
/** First-person pieces: "Lillian Crawford; as told to Olivia Ladanyi". */
const asToldTo = /^as told to\s+/i;
/** Where it was filed from: "Edward Helmore in New York", "Angus Fontaine at Eden Park". */
const filedFrom = /\s+(?:in|at)\s+[A-Z].*$/u;
/** Credits that aren't a person: "Guardian staff", "6abc Digital Staff", "agencies". */
const notAPerson = /^(?:agency|agencies|.*\bstaff)$/i;

/**
 * Splits a free-text byline into people, dropping job titles, locations, shift notes,
 * photo credits, generic credits and URLs.
 * "By Daniel Park and Ruth Klein" -> [{ name: "Daniel Park" }, { name: "Ruth Klein" }]
 *
 * ponytail: heuristics tuned on real Guardian/NewsAPI/NYT bylines (see the tests);
 * a lowercase title right after a surname ("Jo Smith technology editor") is still kept.
 */
export function parseAuthors(byline: string | null | undefined): Author[] {
  if (!byline) return [];
  const names = byline
    .trim()
    .replace(bylinePrefix, "")
    .replace(contributorCredit, "")
    .replace(parenthetical, "")
    .replace(jobTitle, "")
    .split(authorSeparator)
    .map((name) => name.replace(asToldTo, "").replace(filedFrom, "").trim())
    .filter((name) => name && !url.test(name) && !notAPerson.test(name));
  return [...new Set(names)].map((name) => ({ name }));
}

// ponytail: tag stripping only; switch to DOMParser if entity-encoded text shows up.
export const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

/** Empty strings from providers become undefined. */
export const optionalText = (value: string | null | undefined) => value?.trim() || undefined;
