import { useEffect, useState } from "react";
import { Button } from "@/components/Button/Button";
import { StateMessage } from "@/components/StateMessage/StateMessage";

const firstCooldownSeconds = 10;
const maxCooldownSeconds = 60;

/**
 * Total failure. After each retry the button cools down (10s, doubling to 60s)
 * so repeated taps can't burn the providers' daily quota.
 */
export function FeedError({ onRetry }: { onRetry: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [nextCooldown, setNextCooldown] = useState(firstCooldownSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const retry = () => {
    onRetry();
    setSecondsLeft(nextCooldown);
    setNextCooldown((seconds) => Math.min(seconds * 2, maxCooldownSeconds));
  };

  return (
    <StateMessage
      role="alert"
      icon="alert"
      tone="warn"
      title="We couldn't load any stories"
      description="All three news sources are unavailable right now. This is usually temporary."
      actions={
        <Button variant="primary" icon="refresh" disabled={secondsLeft > 0} onClick={retry}>
          {secondsLeft > 0 ? `Try again in ${secondsLeft}s` : "Try again"}
        </Button>
      }
    />
  );
}
