import type { Category } from "@/types/category";
import type { SourceId } from "@/types/source";

export interface FollowedAuthor {
  readonly name: string;
  /** Shown as "Followed from a story" / "Added by name". */
  readonly origin: "story" | "name";
}

/** The personalized feed. Empty lists mean "no preference". */
export interface FeedPreferences {
  readonly sources: readonly SourceId[];
  readonly categories: readonly Category[];
  readonly authors: readonly FollowedAuthor[];
  readonly personalizePromptDismissed: boolean;
}
