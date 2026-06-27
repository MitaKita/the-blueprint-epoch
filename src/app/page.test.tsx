import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CityGridProvider } from "@/game/city-grid-context";

import Home from "./page";

describe("Home", () => {
  it("renders the city grid experience", () => {
    render(
      <CityGridProvider projection="isometric" width={12} height={10}>
        <Home />
      </CityGridProvider>,
    );

    expect(
      screen.getByRole("heading", {
        name: /plan buildings on a living city grid/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/connected to community pathway/i).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(/creative hub/i).length,
    ).toBeGreaterThan(0);
  });
});