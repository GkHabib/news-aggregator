import { useId, type Dispatch, type SetStateAction } from "react";
import { categories, datePresets, type FeedFilters } from "@/types";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import { ChoiceChip } from "@/components/Chip/ChoiceChip";
import { RadioChip } from "@/components/Chip/RadioChip";
import { Radio } from "@/components/Radio/Radio";
import { datePresetLabels, toggle } from "@/features/filters/feedFilters";
import { sourceCoverageNote, sourceIds, sourceLabel } from "@/features/sources/sourceInfo";
import styles from "@/features/filters/FilterFields/FilterFields.module.css";
import { cx } from "@/utils/cx";
import { parseCalendarDate } from "@/utils/date";
import { formatCategory } from "@/utils/format";

interface FilterFieldsProps {
  draft: FeedFilters;
  /** A state setter: updates are functional, so quick successive changes never clobber each other. */
  onChange: Dispatch<SetStateAction<FeedFilters>>;
  /** "sidebar": radios, small chips, only warning hints. "sheet": chips and every hint. */
  variant: "sidebar" | "sheet";
}

const today = () => new Date().toISOString().slice(0, 10);

/** The date, category and source groups (fieldset + legend each). */
export function FilterFields({ draft, onChange, variant }: FilterFieldsProps) {
  const name = useId();
  const compact = variant === "sidebar";
  const set = (patch: (current: FeedFilters) => Partial<FeedFilters>) =>
    onChange((current) => ({ ...current, ...patch(current) }));

  return (
    <div className={cx(compact && styles.compact)}>
      <fieldset className={styles.group}>
        <legend className={styles.legend}>Date</legend>
        <div className={cx(!compact && styles.chips)}>
          {datePresets.map((preset) =>
            compact ? (
              <Radio
                key={preset}
                name={`${name}-date`}
                label={datePresetLabels[preset]}
                checked={draft.date === preset}
                onSelect={() => set(() => ({ date: preset }))}
              />
            ) : (
              <RadioChip
                key={preset}
                name={`${name}-date`}
                label={datePresetLabels[preset]}
                checked={draft.date === preset}
                onSelect={() => set(() => ({ date: preset }))}
              />
            ),
          )}
        </div>
        {draft.date === "custom" && (
          <>
            <div className={styles.range}>
              <label className={styles.dateLabel}>
                From
                <input
                  type="date"
                  className={styles.dateInput}
                  value={draft.from ?? ""}
                  max={draft.to ?? today()}
                  onChange={(event) => {
                    const from = parseCalendarDate(event.target.value);
                    set(() => ({ from }));
                  }}
                />
              </label>
              <label className={styles.dateLabel}>
                To
                <input
                  type="date"
                  className={styles.dateInput}
                  value={draft.to ?? ""}
                  min={draft.from}
                  max={today()}
                  onChange={(event) => {
                    const to = parseCalendarDate(event.target.value);
                    set(() => ({ to }));
                  }}
                />
              </label>
            </div>
            <p className={styles.hint}>Free plans only reach back about 30 days.</p>
          </>
        )}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Category</legend>
        <div className={styles.chips}>
          {categories.map((category) => (
            <ChoiceChip
              key={category}
              size={compact ? "small" : "medium"}
              selected={draft.categories.includes(category)}
              onToggle={() =>
                set((current) => ({ categories: toggle(current.categories, category) }))
              }
            >
              {formatCategory(category)}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={cx(styles.legend, styles.sourceLegend)}>Source</legend>
        {sourceIds.map((id) => {
          const note = sourceCoverageNote(id, draft.categories);
          const showNote = note && (!compact || note.tone === "warn");
          return (
            <Checkbox
              key={id}
              layout={compact ? "compact" : "divided"}
              label={sourceLabel(id)}
              checked={draft.sources.includes(id)}
              onChange={() => set((current) => ({ sources: toggle(current.sources, id) }))}
              note={showNote ? note.text : undefined}
              noteTone={note?.tone}
            />
          );
        })}
      </fieldset>
    </div>
  );
}
