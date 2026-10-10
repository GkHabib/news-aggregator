// @vitest-environment jsdom
import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FeedFilters } from "@/types";
import { emptyFeedFilters } from "@/features/filters/feedFilters";
import { FilterSidebar } from "@/features/filters/FilterSidebar/FilterSidebar";
import { renderWithProviders } from "@/test/render";

const applied: FeedFilters = { ...emptyFeedFilters, keyword: "climate", categories: ["science"] };

const renderSidebar = () => {
  const onApply = vi.fn();
  const view = renderWithProviders(<FilterSidebar applied={applied} onApply={onApply} />);
  return { onApply, ...view };
};

describe("FilterSidebar", () => {
  it("keeps changes as a draft until Apply, keeping the keyword", async () => {
    const { user, onApply } = renderSidebar();
    const apply = screen.getByRole("button", { name: "Apply" });
    expect(apply).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "Past week" }));
    await user.click(screen.getByRole("button", { name: "Technology" }));
    expect(onApply).not.toHaveBeenCalled();
    expect(screen.getByText("2 changes not applied")).toBeInTheDocument();

    await user.click(apply);
    expect(onApply).toHaveBeenCalledWith({
      ...applied,
      date: "week",
      categories: ["science", "technology"],
    });
  });

  it("Undo discards the draft", async () => {
    const { user } = renderSidebar();
    await user.click(screen.getByRole("checkbox", { name: /The Guardian/ }));

    await user.click(screen.getByRole("button", { name: "Undo" }));

    expect(screen.getByRole("checkbox", { name: /The Guardian/ })).not.toBeChecked();
    expect(screen.queryByText(/not applied/)).toBeNull();
  });

  it("warns about coverage only when a selected category can't come from a source", async () => {
    const { user } = renderSidebar();
    const sources = screen.getByRole("group", { name: "Source" });
    expect(within(sources).queryByText(/Doesn’t cover/)).toBeNull();

    await user.click(screen.getByRole("button", { name: "Health" }));

    expect(within(sources).getByText("Doesn’t cover Health")).toBeInTheDocument();
  });

  it("Clear all applies immediately with an undo message", async () => {
    const { user, onApply } = renderSidebar();

    await user.click(screen.getByRole("button", { name: "Clear all" }));

    expect(onApply).toHaveBeenCalledWith(
      { ...emptyFeedFilters, keyword: "climate" },
      "Filters cleared",
    );
  });
});
