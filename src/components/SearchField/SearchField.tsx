import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon/Icon";
import { IconButton } from "@/components/IconButton/IconButton";
import styles from "@/components/SearchField/SearchField.module.css";
import { cx } from "@/utils/cx";

interface SearchFieldProps {
  /** The applied keyword. Typing only edits a draft; Enter submits it. */
  value: string;
  onSubmit: (keyword: string) => void;
  showIcon?: boolean;
  /** Show the "/" hint and focus the field when "/" is pressed outside an input. */
  shortcut?: boolean;
  autoFocus?: boolean;
  /** Larger text, for the phone search header. */
  prominent?: boolean;
  className?: string;
}

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export function SearchField({
  value,
  onSubmit,
  showIcon = true,
  shortcut = false,
  autoFocus = false,
  prominent = false,
  className,
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(value);
  const [appliedValue, setAppliedValue] = useState(value);

  // Re-sync the draft when the applied keyword changes elsewhere (e.g. "Clear all").
  if (value !== appliedValue) {
    setAppliedValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || isTypingTarget(event.target))
        return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [shortcut]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(draft.trim());
  };

  const clear = () => {
    setDraft("");
    onSubmit("");
    inputRef.current?.focus();
  };

  return (
    <form
      role="search"
      className={cx(styles.form, prominent && styles.prominent, className)}
      onSubmit={submit}
    >
      {showIcon && <Icon name="search" />}
      <input
        ref={inputRef}
        type="search"
        aria-label="Search news"
        placeholder="Search news"
        className={styles.input}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        autoFocus={autoFocus}
        enterKeyHint="search"
      />
      {draft ? (
        <IconButton icon="x" label="Clear search" size="small" onClick={clear} />
      ) : (
        shortcut && (
          <kbd className={styles.shortcut} aria-hidden="true">
            /
          </kbd>
        )
      )}
    </form>
  );
}
