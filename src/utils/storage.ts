type StorageKind = "local" | "session";

const storageOf = (kind: StorageKind): Storage =>
  kind === "local" ? window.localStorage : window.sessionStorage;

/** JSON.parse that returns undefined instead of throwing. */
export function parseJson(raw: string | null): unknown {
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/**
 * Reads and parses JSON. Returns undefined when missing, unparsable or when
 * storage is unavailable (private mode, blocked cookies); callers validate the shape.
 */
export function readJson(kind: StorageKind, key: string): unknown {
  try {
    return parseJson(storageOf(kind).getItem(key));
  } catch {
    return undefined; // storage itself is unavailable
  }
}

/** Best effort: a full or blocked storage must never break the app. */
export function writeJson(kind: StorageKind, key: string, value: unknown): void {
  try {
    storageOf(kind).setItem(key, JSON.stringify(value));
  } catch {
    // Ignore: the in-memory state still works for this session.
  }
}
