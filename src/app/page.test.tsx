import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("renders the starter content", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /to get started, edit the page\.tsx file\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /documentation/i }),
    ).toHaveAttribute(
      "href",
      "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
    );
  });
});