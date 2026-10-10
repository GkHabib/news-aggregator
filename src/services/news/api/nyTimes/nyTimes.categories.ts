import { mappedCategories, type CategoryMap } from "@/services/news/api/shared/categoryMap";

/** Our category -> NYT `section.name` values. */
export const nyTimesSectionMap: CategoryMap = {
  business: ["Business", "Business Day"],
  entertainment: ["Arts", "Movies", "Theater", "Books"],
  health: ["Health", "Well"],
  science: ["Science", "Climate"],
  sports: ["Sports"],
  technology: ["Technology"],
  world: ["World"],
};

/** Our category -> NYT `subsection.name` values. Politics lives under the "U.S." section. */
export const nyTimesSubsectionMap: CategoryMap = {
  politics: ["Politics"],
};

export const nyTimesCategories = [
  ...mappedCategories(nyTimesSectionMap),
  ...mappedCategories(nyTimesSubsectionMap),
];
