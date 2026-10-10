import { categories, type FollowedAuthor } from "@/types";
import { Button } from "@/components/Button/Button";
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
import styles from "@/pages/PreferencesPage/PreferencesPage.module.css";
import { formatCategory } from "@/utils/format";

/** "Your feed": every change applies at once, so there is no Save button. */
export function PreferencesPage() {
  const { preferences, update } = usePreferences();
  const showToast = useToast();
  const isDesktop = useBreakpoint() === "desktop";

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
        description={isDesktop ? "Add by name, or follow from any story." : undefined}
      >
        <AuthorsEditor
          layout={isDesktop ? "pills" : "rows"}
          authors={preferences.authors}
          onAdd={(name) => update((current) => followAuthor(current, name, "name"))}
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
