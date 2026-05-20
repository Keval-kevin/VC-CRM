import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "../src/app/App";

describe("App", () => {
  it("renders the Phase 0 foundation screen", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Foundation Ready" })).toBeInTheDocument();
  });
});
