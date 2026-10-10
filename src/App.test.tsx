// @vitest-environment jsdom
import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { preferencesStorageKey } from "@/features/preferences/preferencesStorage";
import { renderApp } from "@/test/render";

// End-to-end through the real data layer on the mock providers (ENABLE_MOCK_DATA=true).

const articleTitles = () =>
  screen
    .queryAllByRole("article")
    .map((article) => within(article).getByRole("heading").textContent);

const findArticle = async (title: string) =>
  (await screen.findByRole("link", { name: title })).closest("article") as HTMLElement;

describe("news aggregator", () => {
  it("shows top stories from all three sources", async () => {
    renderApp("/");

    expect(screen.getByRole("heading", { level: 1, name: "Top stories" })).toBeInTheDocument();
    await screen.findByRole("link", { name: /Chip Start-Ups Race/ });
    expect(articleTitles()).toHaveLength(12);
    // One of each provider: NewsAPI outlets are labelled "via NewsAPI".
    for (const label of ["The Guardian", "The New York Times", "via NewsAPI"]) {
      expect(screen.getAllByText(label, { selector: "span" }).length).toBeGreaterThan(0);
    }
  });

  it("reads the search from the URL", async () => {
    renderApp("/?q=chip");

    expect(
      await screen.findByRole("heading", { level: 1, name: /Results for “chip”/ }),
    ).toBeVisible();
    await waitFor(() =>
      expect(articleTitles()).toEqual([
        "Chip Start-Ups Race to Fill the Gap Left by Export Rules",
        "New AI chip export rules leave manufacturers scrambling",
      ]),
    );
  });

  it("applies filters from the phone sheet, writes them to the URL and explains coverage gaps", async () => {
    const { user, router } = renderApp("/");
    await findArticle("Chip Start-Ups Race to Fill the Gap Left by Export Rules");

    await user.click(screen.getByRole("button", { name: "Filters" }));
    const sheet = screen.getByRole("dialog", { name: "Filters" });
    await user.click(within(sheet).getByRole("button", { name: "Health" }));
    await user.click(within(sheet).getByRole("checkbox", { name: /The Guardian/ }));
    expect(within(sheet).getByText("Doesn’t cover Health")).toBeInTheDocument();
    await user.click(within(sheet).getByRole("button", { name: "Show results" }));

    expect(router.state.location.search).toBe("?cat=health&src=guardian");
    expect(
      await screen.findByRole("heading", { name: "The Guardian doesn't cover Health" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add NewsAPI and NYT" }));
    await findArticle("What a new study says about sleep and memory");
    expect(router.state.location.search).toBe("?cat=health&src=guardian%2CnewsApi%2CnyTimes");
  });

  it("removes a filter immediately and can undo it", async () => {
    const { user, router } = renderApp("/?cat=technology,politics");
    await findArticle("Senate Hearing Turns Tense Over Election Security");

    await user.click(screen.getByRole("button", { name: "Remove filter: Politics" }));
    expect(router.state.location.search).toBe("?cat=technology");
    await waitFor(() =>
      expect(articleTitles()).not.toContain("Senate Hearing Turns Tense Over Election Security"),
    );

    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(router.state.location.search).toBe("?cat=technology%2Cpolitics");
  });

  it("makes every filter change a history entry", async () => {
    const { user, router } = renderApp("/");

    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.type(screen.getByRole("searchbox", { name: "Search news" }), "chip{Enter}");
    expect(router.state.location.search).toBe("?q=chip");

    await router.navigate(-1);
    expect(await screen.findByRole("heading", { level: 1, name: "Top stories" })).toBeVisible();
  });

  it("follows an author from a card, personalizes the feed and saves it", async () => {
    const { user } = renderApp("/");
    const card = await findArticle("Senate Hearing Turns Tense Over Election Security");

    await user.click(within(card).getByRole("button", { name: "Follow options" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: /Follow Grace Miller/ }));

    expect(await screen.findByRole("heading", { level: 1, name: "For you" })).toBeVisible();
    await waitFor(() =>
      expect(articleTitles()).toEqual(["Senate Hearing Turns Tense Over Election Security"]),
    );
    expect(JSON.parse(localStorage.getItem(preferencesStorageKey) ?? "{}").authors).toEqual([
      { name: "Grace Miller", origin: "story" },
    ]);

    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Top stories" })).toBeVisible();
  });

  it("restores saved preferences on a new visit", async () => {
    localStorage.setItem(
      preferencesStorageKey,
      JSON.stringify({ sources: ["guardian"], categories: [], authors: [] }),
    );
    renderApp("/");

    expect(await screen.findByRole("heading", { level: 1, name: "For you" })).toBeVisible();
    await waitFor(() => expect(articleTitles()).toHaveLength(4));
  });
});
