import type { NyTimesDoc, NyTimesResponse } from "@/services/news/api/nyTimes/nyTimes.types";
import {
  includesKeyword,
  isWithinDays,
  numberParam,
  paginate,
  type MockHandler,
} from "@/services/news/mock/mockUtils";

const pageSize = 10;

const clausePattern = /(section\.name|subsection\.name):\(([^)]*)\)/g;
const quotedPattern = /"([^"]*)"/g;

/** Supports the subset of `fq` the client builds: `field:("A" "B") OR field:("C")`. */
function matchesFilterQuery(doc: NyTimesDoc, fq: string | null): boolean {
  if (!fq) return true;
  return [...fq.matchAll(clausePattern)].some(([, field, values = ""]) => {
    const wanted = [...values.matchAll(quotedPattern)].map(([, value]) => value);
    const actual = field === "section.name" ? doc.section_name : doc.subsection_name;
    return actual !== undefined && wanted.includes(actual);
  });
}

/** `YYYYMMDD` -> `YYYY-MM-DD` */
const fromNyTimesDate = (date: string | null) =>
  date && `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;

/** Emulates `/articlesearch.json` over `docs` with q, fq, begin_date, end_date and 0-based paging. */
export const createNyTimesHandler =
  (docs: readonly NyTimesDoc[]): MockHandler =>
  (_path, params): NyTimesResponse => {
    const keyword = params.get("q");
    const from = fromNyTimesDate(params.get("begin_date"));
    const to = fromNyTimesDate(params.get("end_date"));
    const page = numberParam(params, "page", 0) + 1;

    const matches = docs.filter(
      (doc) =>
        matchesFilterQuery(doc, params.get("fq")) &&
        includesKeyword(keyword, doc.headline.main, doc.abstract, doc.snippet) &&
        isWithinDays(doc.pub_date, from, to),
    );

    return {
      status: "OK",
      response: {
        docs: paginate(matches, page, pageSize),
        metadata: { hits: matches.length, offset: (page - 1) * pageSize },
      },
    };
  };
