// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Autocomplete } from "@/components/Autocomplete/Autocomplete";

const suggestions = ["Daniel Park", "Grace Miller", "Ruth Klein"];

function setup() {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(
    <Autocomplete
      label="Author name"
      placeholder="Search or type a name"
      suggestions={suggestions}
      onSubmit={onSubmit}
      createLabel={(text) => `Add “${text}”`}
    />,
  );
  const input = screen.getByRole("combobox", { name: "Author name" });
  const options = () => screen.queryAllByRole("option").map((option) => option.textContent);
  return { user, onSubmit, input, options };
}

describe("Autocomplete", () => {
  it("shows all suggestions on focus, then filters as you type with the typed text last", async () => {
    const { user, input, options } = setup();

    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(options()).toEqual(suggestions);

    await user.type(input, "ru");
    expect(options()).toEqual(["Ruth Klein", "Add “ru”"]);
  });

  it("pre-selects the best match so Enter picks it", async () => {
    const { user, input, onSubmit } = setup();

    await user.type(input, "ruth{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("Ruth Klein");
    expect(input).toHaveValue("");
  });

  it("reaches the free-text option with the arrow keys", async () => {
    const { user, input, onSubmit } = setup();

    await user.type(input, "ruth");
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: /Add “ruth”/ }).id,
    );
    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("ruth");
  });

  it("offers only the free-text option when nothing matches, and hides it for exact matches", async () => {
    const { user, input, options } = setup();

    await user.type(input, "Jane Doe");
    expect(options()).toEqual(["Add “Jane Doe”"]);

    await user.clear(input);
    await user.type(input, "grace miller");
    expect(options()).toEqual(["Grace Miller"]);
  });

  it("picks an option by mouse without losing focus, and closes on Escape", async () => {
    const { user, input, onSubmit } = setup();

    await user.click(input);
    await user.click(screen.getByRole("option", { name: "Grace Miller" }));
    expect(onSubmit).toHaveBeenCalledWith("Grace Miller");
    expect(input).toHaveFocus();

    await user.type(input, "d");
    await user.keyboard("{Escape}");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });
});
