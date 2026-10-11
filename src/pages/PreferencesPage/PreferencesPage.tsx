import { categories, type FollowedAuthor } from "@/types";
import { Button } from "@/components/Button/Button";
import { buttonClassName } from "@/components/Button/buttonClassName";
import { Icon } from "@/components/Icon/Icon";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import { ChoiceChip } from "@/components/Chip/ChoiceChip";
import { useToast } from "@/components/Toast/toastContext";
import { AuthorsEditor } from "@/features/preferences/AuthorsEditor/AuthorsEditor";
import {
  emptyPreferences,
  followAuthor,
  hasPreferences,
  toggleCategory,
  toggleSource,
  unfollowAuthor,
} from "@/features/preferences/feedPreferences";
import { PreferenceSection } from "@/features/preferences/PreferenceSection/PreferenceSection";
import { usePreferences } from "@/features/preferences/preferencesContext";
import { sourceIds, sourceLabel } from "@/features/sources/sourceInfo";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { BackToFeedLink } from "@/layout/BackToFeedLink/BackToFeedLink";
import { useKnownAuthors } from "@/queries/knownAuthors";
import styles from "@/pages/PreferencesPage/PreferencesPage.module.css";
import { cx } from "@/utils/cx";
import { formatCategory } from "@/utils/format";

/** "Your feed": every change applies at once, so there is no Save button. */
export function PreferencesPage() {
  const { preferences, update } = usePreferences();
  const showToast = useToast();
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === "desktop";
  const authorSuggestions = useKnownAuthors(preferences.authors.map((author) => author.name));

  const removeAuthor = (author: FollowedAuthor) => {
    update((current) => unfollowAuthor(current, author.name));
    showToast({
      message: `Unfollowed ${author.name}`,
      action: {
        label: "Undo",
        onAction: () => update((current) => followAuthor(current, author.name, author.origin)),
      },
    });
  };

  const resetAll = () => {
    const previous = preferences;
    update(() => ({
      ...emptyPreferences,
      personalizePromptDismissed: previous.personalizePromptDismissed,
    }));
    showToast({
      message: "Preferences reset",
      action: { label: "Undo", onAction: () => update(() => previous) },
    });
  };

  return (
    <main className={styles.page}>
      <title>Your feed · News Aggregator</title>
      {/* Phones have "Back to feed" in the header instead. */}
      {breakpoint !== "phone" && (
        <BackToFeedLink
          className={cx(buttonClassName({ variant: "text", icon: "back" }), styles.back)}
        >
          <Icon name="back" size={18} />
          Back to feed
        </BackToFeedLink>
      )}
      <div className={styles.intro}>
        <h1 className={styles.title}>Your feed</h1>
        <p className={styles.subtitle}>Saved on this device. Changes apply right away.</p>
      </div>

      <PreferenceSection title="Sources" description="None selected means all sources.">
        {isDesktop ? (
          <div className={styles.chips}>
            {sourceIds.map((id) => (
              <ChoiceChip
                key={id}
                selected={preferences.sources.includes(id)}
                onToggle={() => update((current) => toggleSource(current, id))}
              >
                {sourceLabel(id)}
              </ChoiceChip>
            ))}
          </div>
        ) : (
          sourceIds.map((id) => (
            <Checkbox
              key={id}
              label={sourceLabel(id)}
              checked={preferences.sources.includes(id)}
              onChange={() => update((current) => toggleSource(current, id))}
            />
          ))
        )}
      </PreferenceSection>

      <PreferenceSection
        title="Categories"
        description={isDesktop ? "Pick any number." : undefined}
      >
        <div className={styles.chips}>
          {categories.map((category) => (
            <ChoiceChip
              key={category}
              selected={preferences.categories.includes(category)}
              onToggle={() => update((current) => toggleCategory(current, category))}
            >
              {formatCategory(category)}
            </ChoiceChip>
          ))}
        </div>
      </PreferenceSection>

      <PreferenceSection
        title="Authors"
        description={
          isDesktop ? "Pick from writers in recent stories, or add any name." : undefined
        }
      >
        <AuthorsEditor
          layout={isDesktop ? "pills" : "rows"}
          authors={preferences.authors}
          suggestions={authorSuggestions}
          onAdd={(name) => {
            // A picked suggestion is a writer from a loaded story; anything else was typed.
            const origin = authorSuggestions.includes(name) ? "story" : "name";
            update((current) => followAuthor(current, name, origin));
          }}
          onRemove={removeAuthor}
        />
      </PreferenceSection>

      {hasPreferences(preferences) && (
        <Button variant="text" className={styles.reset} onClick={resetAll}>
          Reset all preferences
        </Button>
      )}
    </main>
  );
}
