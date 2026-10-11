import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";

interface BackToFeedLinkProps {
  className?: string;
  children: ReactNode;
}

const isPlainClick = (event: MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/**
 * Returns to the feed as the user left it: goes back in history (keeping the
 * filters in the URL) when they came from inside the app, otherwise to "/".
 * Still a real link, so modified clicks open the feed in a new tab.
 */
export function BackToFeedLink({ className, children }: BackToFeedLinkProps) {
  const navigate = useNavigate();
  // React Router gives the first entry of the session the key "default".
  const cameFromApp = useLocation().key !== "default";

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!cameFromApp || !isPlainClick(event)) return;
    event.preventDefault();
    navigate(-1);
  };

  return (
    <Link to="/" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
