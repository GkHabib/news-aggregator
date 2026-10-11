import { HttpError } from "@/services/news/api/http";
import type { NewsApiResponse } from "@/services/news/api/newsApi/newsApi.types";
import type { NewsApiFixture } from "@/services/news/mock/newsApi/newsApi.fixtures";
import {
  includesKeyword,
  isWithinDays,
  numberParam,
  paginate,
  type MockHandler,
} from "@/services/news/mock/mockUtils";

/** Emulates `/top-headlines` (category, no dates) and `/everything` (dates, keyword required). */
export const createNewsApiHandler =
  (fixtures: readonly NewsApiFixture[]): MockHandler =>
  (path, params): NewsApiResponse => {
    const keyword = params.get("q");
    const category = params.get("category");
    const isEverything = path === "/everything";

    if (isEverything && !keyword) {
      throw new HttpError(400, "parametersMissing: q is required for /everything");
    }

    const matches = fixtures
      .filter((fixture) => isEverything || !category || fixture.category === category)
      .map((fixture) => fixture.article)
      .filter(
        (article) =>
          includesKeyword(keyword, article.title, article.description) &&
          (!isEverything ||
            isWithinDays(article.publishedAt, params.get("from"), params.get("to"))),
      );

    return {
      status: "ok",
      totalResults: matches.length,
      articles: paginate(
        matches,
        numberParam(params, "page", 1),
        numberParam(params, "pageSize", 20),
      ),
    };
  };
