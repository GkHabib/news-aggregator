import { useId, useState, type FormEvent } from "react";
import type { FollowedAuthor } from "@/types";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import styles from "@/features/preferences/AuthorsEditor/AuthorsEditor.module.css";

interface AuthorsEditorProps {
  authors: readonly FollowedAuthor[];
  onAdd: (name: string) => void;
  onRemove: (author: FollowedAuthor) => void;
  /** "rows" with origin notes (phone, tablet) or compact "pills" (desktop). */
  layout: "rows" | "pills";
}

const originNote: Record<FollowedAuthor["origin"], string> = {
  story: "Followed from a story",
  name: "Added by name",
};

/** Authors can't be browsed, so they're added by name or followed from a story. */
export function AuthorsEditor({ authors, onAdd, onRemove, layout }: AuthorsEditorProps) {
  const [name, setName] = useState("");
  const inputId = useId();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd(name);
    setName("");
  };

  return (
    <>
      <form className={styles.form} onSubmit={submit}>
        <label htmlFor={inputId} className="visually-hidden">
          Author name
        </label>
        <input
          id={inputId}
          className={styles.input}
          placeholder="Add an author by name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="off"
        />
        <Button type="submit" variant="primary" size={layout === "rows" ? "large" : "medium"}>
          Add
        </Button>
      </form>

      {authors.length === 0 ? (
        <p className={styles.empty}>No authors yet. Use a story’s ⋯ menu to follow its writers.</p>
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
