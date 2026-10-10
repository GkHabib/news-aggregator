import type { Category } from "@/types";
import type { NewsApiCategory } from "@/services/news/api/newsApi/newsApi.types";

/** Our category -> NewsAPI category. NewsAPI has no politics or world. */
export const newsApiCategoryMap: Readonly<Partial<Record<Category, NewsApiCategory>>> = {
  business: "business",
  entertainment: "entertainment",
  general: "general",
  health: "health",
  science: "science",
  sports: "sports",
  technology: "technology",
};

export const newsApiCategories = Object.keys(newsApiCategoryMap) as Category[];
