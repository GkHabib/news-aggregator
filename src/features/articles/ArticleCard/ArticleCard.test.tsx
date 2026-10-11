// @vitest-environment jsdom
import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Article, IsoDateTime } from "@/types";
import { ArticleCard } from "@/features/articles/ArticleCard/ArticleCard";
import { renderWithProviders } from "@/test/render";

const article: Article = {
  id: "newsApi:https://example.com/a",
  sourceId: "newsApi",
  publisher: "The Verge",
  title: "Foldable laptops tested",
  summary: "A week with three laptops.",
  url: "https://example.com/a",
  imageUrl: "https://example.com/a.jpg",
  authors: [{ name: "Alex Rivera" }, { name: "Sam Chen" }],
  category: "technology",
  publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() as IsoDateTime,
};

describe("ArticleCard", () => {
  it("links the title to the publisher in a new tab and shows the meta line", () => {
    renderWithProviders(<ArticleCard article={article} />);

    const link = screen.getByRole("link", { name: "Foldable laptops tested" });
    expect(link).toHaveAttribute("href", "https://example.com/a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");

    const card = screen.getByRole("article");
    expect(within(card).getByText("Technology")).toBeInTheDocument();
    expect(within(card).getByText("via NewsAPI")).toBeInTheDocument();
    expect(within(card).getByText("Alex Rivera & Sam Chen")).toBeInTheDocument();
    expect(within(card).getByText("3h ago")).toHaveAttribute("datetime", article.publishedAt);
  });

  it("falls back to the no-image layout when the image fails", () => {
    const { container } = renderWithProviders(<ArticleCard article={article} />);
    const image = container.querySelector("img")!;

    fireEvent.error(image);

    expect(container.querySelector("img")).toBeNull();
  });

  it("omits optional parts that are missing", () => {
    renderWithProviders(
      <ArticleCard
        article={{
          ...article,
          sourceId: "guardian",
          summary: undefined,
          authors: [],
          imageUrl: undefined,
        }}
      />,
    );
    const card = screen.getByRole("article");
    expect(within(card).queryByText("via NewsAPI")).toBeNull();
    expect(card.querySelector("p:not([class*=info])")).toBeNull();
    expect(card.querySelector("img")).toBeNull();
  });
});
