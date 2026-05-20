import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "../src/app/App";

describe("App", () => {
  it("renders the Phase 0 foundation screen", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(screen.getByRole("heading", { name: "Foundation Ready" })).toBeInTheDocument();
  });

  it("renders the frontend health page", () => {
    window.history.pushState({}, "", "/health");

    render(<App />);

    expect(screen.getByRole("heading", { name: "Web health: ok" })).toBeInTheDocument();
  });
});
