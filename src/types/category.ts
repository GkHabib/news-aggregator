/** Our own taxonomy; every provider's sections are mapped onto it. */
export const categories = [
  "business",
  "entertainment",
  "general",
  "health",
  "politics",
  "science",
  "sports",
  "technology",
  "world",
] as const;

export type Category = (typeof categories)[number];
