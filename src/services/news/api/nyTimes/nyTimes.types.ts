// Raw NYT Article Search shapes — https://developer.nytimes.com/docs/articlesearch-product/1/overview

export interface NyTimesDoc {
  _id: string;
  web_url: string;
  headline: { main: string };
  abstract?: string;
  snippet?: string;
  byline?: { original?: string | null };
  /** Object since the 2025 API update; may be empty or null when there is no image. */
  multimedia?: { default?: { url?: string } } | null;
  pub_date: string;
  section_name?: string;
  subsection_name?: string;
  source?: string;
}

export interface NyTimesResponse {
  status: "OK";
  response: {
    docs: NyTimesDoc[] | null;
    metadata: { hits: number; offset: number };
  };
}
