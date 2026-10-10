import type { Category } from "@/types";
import styles from "@/components/CategoryTag/CategoryTag.module.css";
import { formatCategory } from "@/utils/format";

export function CategoryTag({ category }: { category: Category }) {
  return (
    <span className={styles.tag} data-category={category}>
      {formatCategory(category)}
    </span>
  );
}
