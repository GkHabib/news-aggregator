import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { Article, FeedPreferences } from "@/types";
import { Icon } from "@/components/Icon/Icon";
import { IconButton } from "@/components/IconButton/IconButton";
import { useToast } from "@/components/Toast/toastContext";
import {
  followAuthor,
  isFollowingAuthor,
  toggleCategory,
  toggleSource,
  unfollowAuthor,
} from "@/features/preferences/feedPreferences";
import { usePreferences } from "@/features/preferences/preferencesContext";
import { sourceLabel } from "@/features/sources/sourceInfo";
import styles from "@/features/articles/FollowMenu/FollowMenu.module.css";
import { formatCategory } from "@/utils/format";

interface FollowItem {
  key: string;
  label: string;
  kind: "Author" | "Source" | "Category";
  isFollowing: (preferences: FeedPreferences) => boolean;
  /** Follows when not following, unfollows otherwise; applying it twice undoes it. */
  toggle: (preferences: FeedPreferences) => FeedPreferences;
}

function followItems(article: Article): FollowItem[] {
  const authors = article.authors.map(({ name }): FollowItem => ({
    key: `author:${name}`,
    label: name,
    kind: "Author",
    isFollowing: (preferences) => isFollowingAuthor(preferences, name),
    toggle: (preferences) =>
      isFollowingAuthor(preferences, name)
        ? unfollowAuthor(preferences, name)
        : followAuthor(preferences, name, "story"),
  }));
  return [
    ...authors,
    {
      key: "source",
      label: sourceLabel(article.sourceId),
      kind: "Source",
      isFollowing: (preferences) => preferences.sources.includes(article.sourceId),
      toggle: (preferences) => toggleSource(preferences, article.sourceId),
    },
    {
      key: "category",
      label: formatCategory(article.category),
      kind: "Category",
      isFollowing: (preferences) => preferences.categories.includes(article.category),
      toggle: (preferences) => toggleCategory(preferences, article.category),
    },
  ];
}

interface FollowMenuProps {
  article: Article;
  className?: string;
}

/** ⋯ menu on a card: follow or unfollow each author, the source and the category. */
export function FollowMenu({ article, className }: FollowMenuProps) {
  const { preferences, update } = usePreferences();
  const showToast = useToast();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const items = followItems(article);

  const close = (restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("[role=menuitemcheckbox]")?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const menuItems = [
      ...(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitemcheckbox]") ?? []),
    ];
    const index = menuItems.indexOf(document.activeElement as HTMLElement);
    const focusAt = (next: number) =>
      menuItems[(next + menuItems.length) % menuItems.length]?.focus();

    switch (event.key) {
      case "ArrowDown":
        focusAt(index + 1);
        break;
      case "ArrowUp":
        focusAt(index - 1);
        break;
      case "Home":
        focusAt(0);
        break;
      case "End":
        focusAt(-1);
        break;
      case "Escape":
        close(true);
        break;
      case "Tab":
        setOpen(false);
        return;
      default:
        return;
    }
    event.preventDefault();
  };

  const select = (item: FollowItem) => {
    const wasFollowing = item.isFollowing(preferences);
    update(item.toggle);
    close(true);
    showToast({
      message: `${wasFollowing ? "Unfollowed" : "Following"} ${item.label}`,
      action: { label: "Undo", onAction: () => update(item.toggle) },
    });
  };

  return (
    <span ref={containerRef} className={styles.container}>
      <IconButton
        ref={triggerRef}
        icon="more"
        label="Follow options"
        tone="muted"
        className={className}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((isOpen) => !isOpen)}
      />
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Add to your feed"
          className={styles.menu}
          onKeyDown={onMenuKeyDown}
        >
          <div className={styles.heading} aria-hidden="true">
            Add to your feed
          </div>
          {items.map((item) => {
            const following = item.isFollowing(preferences);
            return (
              <button
                key={item.key}
                type="button"
                role="menuitemcheckbox"
                aria-checked={following}
                tabIndex={-1}
                className={styles.item}
                onClick={() => select(item)}
              >
                <span className={styles.icon}>
                  <Icon name={following ? "check" : "plus"} size={18} />
                </span>
                <span className={styles.label}>
                  {following ? "Following" : "Follow"} {item.label}
                </span>
                <span className={styles.kind}>{item.kind}</span>
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}
