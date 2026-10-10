import { mappedCategories, type CategoryMap } from "@/services/news/api/shared/categoryMap";

/** Our category -> Guardian section ids. Unmapped sections normalize to "general". */
export const guardianSectionMap: CategoryMap = {
  business: ["business", "money"],
  entertainment: ["culture", "film", "music", "tv-and-radio", "stage", "books", "games"],
  politics: ["politics"],
  science: ["science"],
  sports: ["sport", "football"],
  technology: ["technology"],
  world: ["world"],
};

export const guardianCategories = mappedCategories(guardianSectionMap);
