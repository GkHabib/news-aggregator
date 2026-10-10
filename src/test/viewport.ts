let width = 375;

/** Evaluates `(min-width: Npx)` queries against a fake viewport width. */
function matches(query: string): boolean {
  const minWidth = /\(min-width:\s*(\d+)px\)/.exec(query);
  return minWidth ? width >= Number(minWidth[1]) : false;
}

/** jsdom has no matchMedia; this one answers min-width queries for the given width. */
export function setViewportWidth(next: number): void {
  width = next;
  window.matchMedia = (query: string) =>
    ({
      matches: matches(query),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
