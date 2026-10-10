import type { GuardianResponse } from "@/services/news/api/guardian/guardian.types";
import { guardianFixtures } from "@/services/news/mock/guardian/guardian.fixtures";
import {
  includesKeyword,
  isWithinDays,
  numberParam,
  paginate,
  type MockHandler,
} from "@/services/news/mock/mockUtils";

/** Emulates `/search` with q, section (`a|b`), from-date, to-date and paging. */
export const handleGuardian: MockHandler = (_path, params): GuardianResponse => {
  const keyword = params.get("q");
  const sections = params.get("section")?.split("|");
  const size = numberParam(params, "page-size", 10);
  const page = numberParam(params, "page", 1);

  const matches = guardianFixtures.filter(
    (result) =>
      (!sections || sections.includes(result.sectionId)) &&
      includesKeyword(keyword, result.webTitle, result.fields?.trailText) &&
      isWithinDays(result.webPublicationDate, params.get("from-date"), params.get("to-date")),
  );

  return {
    response: {
      status: "ok",
      total: matches.length,
      currentPage: page,
      pages: Math.ceil(matches.length / size),
      results: paginate(matches, page, size),
    },
  };
};
