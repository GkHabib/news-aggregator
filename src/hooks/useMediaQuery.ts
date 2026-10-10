import { useSyncExternalStore } from "react";

/** Keep in sync with the breakpoints documented in src/styles/tokens.css. */
export const mediaQueries = {
  tablet: "(min-width: 640px)",
  desktop: "(min-width: 1024px)",
} as const;

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
  );
}

export type Breakpoint = "phone" | "tablet" | "desktop";

/** For layouts that differ in structure, not just style; otherwise prefer CSS media queries. */
export function useBreakpoint(): Breakpoint {
  const isTablet = useMediaQuery(mediaQueries.tablet);
  const isDesktop = useMediaQuery(mediaQueries.desktop);
  if (isDesktop) return "desktop";
  return isTablet ? "tablet" : "phone";
}
