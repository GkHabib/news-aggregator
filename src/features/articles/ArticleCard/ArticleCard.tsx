import { useState } from "react";
import type { Article } from "@/types";
import { CategoryTag } from "@/components/CategoryTag/CategoryTag";
import { RelativeTime } from "@/components/RelativeTime/RelativeTime";
import { FollowMenu } from "@/features/articles/FollowMenu/FollowMenu";
import styles from "@/features/articles/ArticleCard/ArticleCard.module.css";
import { formatAuthors } from "@/utils/format";

interface ArticleCardProps {
  article: Article;
}

/**
 * The title is the only link (opens the publisher in a new tab), so screen
 * readers hear it once; the ⋯ menu is a separate control.
 */
export function ArticleCard({ article }: ArticleCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = article.imageUrl && !imageFailed;

  return (
    <article className={styles.card}>
      {showImage && (
        <img
          className={styles.image}
          src={article.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className={styles.body}>
        <CategoryTag category={article.category} />
        <h3 className={styles.title}>
          <a className={styles.link} href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
        {article.summary && <p className={styles.summary}>{article.summary}</p>}
      </div>
      <div className={styles.meta}>
        <p className={styles.info}>
          <span className={styles.publisher}>{article.publisher}</span>
          {article.sourceId === "newsApi" && <span>via NewsAPI</span>}
          {article.authors.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>{formatAuthors(article.authors)}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <RelativeTime dateTime={article.publishedAt} />
        </p>
        <FollowMenu article={article} className={styles.menu} />
      </div>
    </article>
  );
}
