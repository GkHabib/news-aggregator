import { Link } from "react-router";
import { Icon } from "@/components/Icon/Icon";
import { IconButton } from "@/components/IconButton/IconButton";
import styles from "@/features/articles/PersonalizePrompt/PersonalizePrompt.module.css";

/** Shown on "Top stories" until the user personalizes or dismisses it. */
export function PersonalizePrompt({ onDismiss }: { onDismiss: () => void }) {
  return (
    <aside className={styles.prompt} aria-label="Personalize">
      <p className={styles.text}>
        Make this feed yours. Pick the sources, topics and writers you want to see first.
      </p>
      <IconButton
        icon="x"
        label="Dismiss"
        tone="muted"
        className={styles.dismiss}
        onClick={onDismiss}
      />
      <Link to="/preferences" className={styles.link}>
        Personalize your feed <Icon name="arrow" size={18} />
      </Link>
    </aside>
  );
}
