import { useId, type ReactNode } from "react";
import styles from "@/features/preferences/PreferenceSection/PreferenceSection.module.css";

interface PreferenceSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** A card on phones and tablets; a label-and-controls row on desktop. */
export function PreferenceSection({ title, description, children }: PreferenceSectionProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={styles.section}>
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}
