// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchField } from "@/components/SearchField/SearchField";

describe("SearchField", () => {
  it("submits the trimmed keyword on Enter only", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchField value="" onSubmit={onSubmit} />);

    await user.type(screen.getByRole("searchbox"), "  heat pumps ");
    expect(onSubmit).not.toHaveBeenCalled();
    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("heat pumps");
  });

  it("clears and submits an empty keyword", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchField value="climate" onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onSubmit).toHaveBeenCalledWith("");
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("follows the applied value when it changes elsewhere", () => {
    const { rerender } = render(<SearchField value="climate" onSubmit={() => {}} />);
    rerender(<SearchField value="" onSubmit={() => {}} />);
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("focuses on '/' unless the user is already typing somewhere", async () => {
    const user = userEvent.setup();
    render(
      <>
        <input aria-label="Other field" />
        <SearchField value="" onSubmit={() => {}} shortcut />
      </>,
    );

    await user.click(screen.getByRole("textbox", { name: "Other field" }));
    await user.keyboard("/");
    expect(screen.getByRole("textbox", { name: "Other field" })).toHaveValue("/");

    await user.click(document.body);
    await user.keyboard("/");
    expect(screen.getByRole("searchbox")).toHaveFocus();
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });
});
