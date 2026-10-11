import type { FollowedAuthor } from "@/types";
import { Autocomplete } from "@/components/Autocomplete/Autocomplete";
import { IconButton } from "@/components/IconButton/IconButton";
import styles from "@/features/preferences/AuthorsEditor/AuthorsEditor.module.css";

interface AuthorsEditorProps {
  authors: readonly FollowedAuthor[];
  /** Offered while typing (authors from loaded stories); any other name is accepted too. */
  suggestions?: readonly string[];
  onAdd: (name: string) => void;
  onRemove: (author: FollowedAuthor) => void;
  /** "rows" with origin notes (phone, tablet) or compact "pills" (desktop). */
  layout: "rows" | "pills";
}

const originNote: Record<FollowedAuthor["origin"], string> = {
  story: "Followed from a story",
  name: "Added by name",
};

/**
 * No provider offers an author directory, so suggestions come from stories
 * already loaded; any other typed name is accepted too.
 */
export function AuthorsEditor({
  authors,
  suggestions = [],
  onAdd,
  onRemove,
  layout,
}: AuthorsEditorProps) {
  return (
    <>
      <Autocomplete
        label="Author name"
        placeholder="Search writers or type any name"
        suggestions={suggestions}
        onSubmit={onAdd}
        createLabel={(name) => `Add “${name}”`}
      />

      {authors.length === 0 ? (
        <p className={styles.empty}>
          No authors yet. Pick a writer from recent stories, type any name, or use a story’s ⋯ menu.
        </p>
      ) : layout === "rows" ? (
        <ul className={styles.list}>
          {authors.map((author) => (
            <li key={author.name} className={styles.row}>
              <span className={styles.name}>
                {author.name}
                <span className={styles.note}>{originNote[author.origin]}</span>
              </span>
              <IconButton
                icon="x"
                tone="muted"
                label={`Unfollow ${author.name}`}
                onClick={() => onRemove(author)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul className={styles.pills}>
          {authors.map((author) => (
            <li key={author.name} className={styles.pill}>
              {author.name}
              <IconButton
                icon="x"
                size="small"
                className={styles.pillRemove}
                label={`Unfollow ${author.name}`}
                onClick={() => onRemove(author)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
