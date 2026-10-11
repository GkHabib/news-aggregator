// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthorsEditor } from "@/features/preferences/AuthorsEditor/AuthorsEditor";

describe("AuthorsEditor", () => {
  it("adds a suggested writer or any typed name from one field", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(
      <AuthorsEditor
        authors={[]}
        suggestions={["Ruth Klein"]}
        onAdd={onAdd}
        onRemove={() => {}}
        layout="rows"
      />,
    );
    const input = screen.getByRole("combobox", { name: "Author name" });

    await user.type(input, "ruth{Enter}");
    await user.type(input, "Jane Doe{Enter}");

    expect(onAdd.mock.calls).toEqual([["Ruth Klein"], ["Jane Doe"]]);
    expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
  });

  it("explains how to add authors when none are followed", () => {
    render(<AuthorsEditor authors={[]} onAdd={() => {}} onRemove={() => {}} layout="pills" />);
    expect(screen.getByText(/Pick a writer from recent stories, type any name/)).toBeVisible();
  });

  it("lists followed authors with their origin and removes them", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const author = { name: "Mira Osei", origin: "name" as const };
    render(<AuthorsEditor authors={[author]} onAdd={() => {}} onRemove={onRemove} layout="rows" />);

    expect(screen.getByText("Added by name")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Unfollow Mira Osei" }));

    expect(onRemove).toHaveBeenCalledWith(author);
  });
});
