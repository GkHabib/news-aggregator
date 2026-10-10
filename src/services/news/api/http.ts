/** Injected into every source so real HTTP and the mock server are interchangeable. */
export type FetchJson = <T>(url: string, signal?: AbortSignal) => Promise<T>;

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const httpFetchJson: FetchJson = async (url, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new HttpError(response.status, `Request failed with status ${response.status}`);
  }
  return response.json();
};

type QueryParams = Readonly<Record<string, string | number | undefined>>;

/** Builds a relative URL, skipping empty params. */
export function buildUrl(path: string, params: QueryParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}
