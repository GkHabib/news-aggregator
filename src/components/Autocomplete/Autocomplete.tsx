import { useId, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/Icon/Icon";
import styles from "@/components/Autocomplete/Autocomplete.module.css";
import { cx } from "@/utils/cx";

interface AutocompleteProps {
  /** Accessible name (visually hidden). */
  label: string;
  placeholder: string;
  suggestions: readonly string[];
  /** Called with the chosen suggestion or the typed text. */
  onSubmit: (value: string) => void;
  /** Label of the free-text option, e.g. (text) => `Add “${text}”`. */
  createLabel: (text: string) => string;
  maxSuggestions?: number;
}

interface Option {
  value: string;
  kind: "suggestion" | "create";
}

const lower = (text: string) => text.toLocaleLowerCase();

/** Bolds the first case-insensitive occurrence of `query` in `text`. */
function Highlighted({ text, query }: { text: string; query: string }) {
  const start = query ? lower(text).indexOf(lower(query)) : -1;
  if (start < 0) return text;
  const end = start + query.length;
  return (
    <span>
      {text.slice(0, start)}
      <span className={styles.match}>{text.slice(start, end)}</span>
      {text.slice(end)}
    </span>
  );
}

/**
 * Standalone combobox (WAI-ARIA 1.2 pattern): matching suggestions first, then
 * an option to use the typed text as-is. Arrows move, Enter picks, Escape closes.
 * Focus never leaves the input; options are referenced via aria-activedescendant.
 */
export function Autocomplete({
  label,
  placeholder,
  suggestions,
  onSubmit,
  createLabel,
  // Few enough that the free-text option at the end is always visible without scrolling.
  maxSuggestions = 6,
}: AutocompleteProps) {
  const id = useId();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const query = text.trim();
  const matches = suggestions
    .filter((suggestion) => lower(suggestion).includes(lower(query)))
    .slice(0, maxSuggestions);
  const exactMatch = suggestions.some((suggestion) => lower(suggestion) === lower(query));
  const options: Option[] = [
    ...matches.map((value): Option => ({ value, kind: "suggestion" })),
    ...(query && !exactMatch ? [{ value: query, kind: "create" } as const] : []),
  ];
  const expanded = open && options.length > 0;
  const optionId = (index: number) => `${id}-option-${index}`;

  const choose = (option: Option) => {
    onSubmit(option.value);
    setText("");
    setActiveIndex(-1);
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        if (!options.length) return;
        setOpen(true);
        setActiveIndex((index) => (index + 1) % options.length);
        break;
      case "ArrowUp":
        if (!options.length) return;
        setOpen(true);
        setActiveIndex((index) => (index <= 0 ? options.length - 1 : index - 1));
        break;
      case "Enter": {
        const option = expanded ? options[activeIndex] : undefined;
        if (option) choose(option);
        else if (query) choose({ value: query, kind: "create" });
        break;
      }
      case "Escape":
        if (!expanded) return;
        setOpen(false);
        setActiveIndex(-1);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  return (
    <div className={styles.root}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        role="combobox"
        aria-expanded={expanded}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
        aria-activedescendant={expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        placeholder={placeholder}
        value={text}
        autoComplete="off"
        onChange={(event) => {
          setText(event.target.value);
          setOpen(true);
          // While typing, pre-select the best match so Enter picks it.
          setActiveIndex(event.target.value.trim() ? 0 : -1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      <ul
        id={`${id}-listbox`}
        role="listbox"
        aria-label={label}
        hidden={!expanded}
        className={styles.listbox}
      >
        {options.map((option, index) => (
          <li
            key={`${option.kind}:${option.value}`}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            className={cx(styles.option, option.kind === "create" && styles.create)}
            // Keep focus in the input so the combobox stays open and keyboard-usable.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(option)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            {option.kind === "create" ? (
              <>
                <Icon name="plus" size={18} />
                {createLabel(option.value)}
              </>
            ) : (
              <Highlighted text={option.value} query={query} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
