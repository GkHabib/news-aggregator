// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Article, IsoDateTime } from "@/types";
import { FollowMenu } from "@/features/articles/FollowMenu/FollowMenu";
import { renderWithProviders } from "@/test/render";

const article: Article = {
  id: "nyTimes:1",
  sourceId: "nyTimes",
  publisher: "The New York Times",
  title: "Chip start-ups",
  url: "https://example.com/n",
  authors: [{ name: "Daniel Park" }, { name: "Ruth Klein" }],
  category: "technology",
  publishedAt: "2026-10-09T23:15:12.000Z" as IsoDateTime,
};

const items = () => screen.getAllByRole("menuitemcheckbox");

describe("FollowMenu", () => {
  it("lists each author, the source and the category", async () => {
    const { user } = renderWithProviders(<FollowMenu article={article} />);
    await user.click(screen.getByRole("button", { name: "Follow options" }));

    expect(items().map((item) => item.textContent)).toEqual([
      "Follow Daniel ParkAuthor",
      "Follow Ruth KleinAuthor",
      "Follow The New York TimesSource",
      "Follow TechnologyCategory",
    ]);
  });

  it("supports the keyboard: focus moves into the menu, arrows cycle, Escape returns focus", async () => {
    const { user } = renderWithProviders(<FollowMenu article={article} />);
    const trigger = screen.getByRole("button", { name: "Follow options" });

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(items()[0]).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(items()[3]).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(items()[0]).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("follows on select, confirms with a toast, and Undo reverts it", async () => {
    const { user } = renderWithProviders(<FollowMenu article={article} />);
    const trigger = screen.getByRole("button", { name: "Follow options" });

    await user.click(trigger);
    await user.click(screen.getByRole("menuitemcheckbox", { name: /Follow Ruth Klein/ }));
    expect(screen.getByText("Following Ruth Klein")).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole("menuitemcheckbox", { name: /Following Ruth Klein/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await user.keyboard("{Escape}");

    await user.click(screen.getByRole("button", { name: "Undo" }));
    await user.click(trigger);
    expect(screen.getByRole("menuitemcheckbox", { name: /Follow Ruth Klein/ })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("closes when clicking outside", async () => {
    const { user } = renderWithProviders(<FollowMenu article={article} />);
    await user.click(screen.getByRole("button", { name: "Follow options" }));

    await user.click(document.body);

    expect(screen.queryByRole("menu")).toBeNull();
  });
});
