// Raw NewsAPI.org shapes — https://newsapi.org/docs/endpoints

export interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string | null;
  description: string | null;
  url: string | null;
  urlToImage: string | null;
  publishedAt: string;
}

export interface NewsApiResponse {
  status: "ok";
  totalResults: number;
  articles: NewsApiArticle[];
}

/** NewsAPI's own category values (`/top-headlines?category=`). */
export type NewsApiCategory =
  "business" | "entertainment" | "general" | "health" | "science" | "sports" | "technology";
