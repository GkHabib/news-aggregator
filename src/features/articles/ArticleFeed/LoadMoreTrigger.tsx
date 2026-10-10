import { useEffect, useRef } from "react";

/** Start loading well before the end so scrolling rarely has to wait. */
const preloadDistance = "0px 0px 800px 0px";

/**
 * Invisible element after the list: calls `onLoadMore` when it comes within
 * 800px of the viewport. Render it only while another page can be requested;
 * when it re-mounts still in view (short pages), it fires again.
 */
export function LoadMoreTrigger({ onLoadMore }: { onLoadMore: () => void }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  // Always call the latest callback without re-creating the observer each render.
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMoreRef.current();
      },
      { rootMargin: preloadDistance },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={elementRef} aria-hidden="true" />;
}
