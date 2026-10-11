import type { GuardianResult } from "@/services/news/api/guardian/guardian.types";
import type { NyTimesDoc } from "@/services/news/api/nyTimes/nyTimes.types";
import { guardianFixtures } from "@/services/news/mock/guardian/guardian.fixtures";
import {
  newsApiFixtures,
  type NewsApiFixture,
} from "@/services/news/mock/newsApi/newsApi.fixtures";
import { nyTimesFixtures } from "@/services/news/mock/nyTimes/nyTimes.fixtures";

/** Raw provider data the mock handlers serve. Same handlers, different datasets. */
export interface MockDataset {
  readonly newsApi: readonly NewsApiFixture[];
  readonly guardian: readonly GuardianResult[];
  readonly nyTimes: readonly NyTimesDoc[];
}

/** Small, hand-made and deterministic, with edge cases; used by tests. */
export const fixtureDataset: MockDataset = {
  newsApi: newsApiFixtures,
  guardian: guardianFixtures,
  nyTimes: nyTimesFixtures,
};
