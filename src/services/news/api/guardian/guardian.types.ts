// Raw Guardian Content API shapes — https://open-platform.theguardian.com/documentation/search

export interface GuardianResult {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  /** Present only for fields requested via `show-fields`. */
  fields?: {
    trailText?: string;
    byline?: string;
    thumbnail?: string;
  };
}

export interface GuardianResponse {
  response: {
    status: "ok";
    total: number;
    currentPage: number;
    pages: number;
    results: GuardianResult[];
  };
}
