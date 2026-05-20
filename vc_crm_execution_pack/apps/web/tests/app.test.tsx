import "@testing-library/jest-dom/vitest";

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { App } from "../src/app/App";

describe("App", (): void => {
  it("renders the dashboard inside the protected app shell", (): void => {
    renderApp("/");

    expect(screen.getByRole("heading", { name: "Operating overview" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByText("CRM")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getAllByText("Virtual Coders").length).toBeGreaterThan(0);
  });

  it("renders the frontend health page", (): void => {
    renderApp("/health");

    expect(screen.getByRole("heading", { name: "Web health: ok" })).toBeInTheDocument();
  });

  it("renders the login page", (): void => {
    renderApp("/login");

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
  });

  it("renders placeholder module pages with a table shell", (): void => {
    renderApp("/leads");

    expect(screen.getByRole("heading", { name: "Leads" })).toBeInTheDocument();
    expect(screen.getByText("Leads list shell")).toBeInTheDocument();
  });

  it("renders concrete admin foundation pages", (): void => {
    renderApp("/admin/users");

    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByText("Tenant users")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "AI Settings" })).toBeInTheDocument();
  });

  it("renders AI settings and audit log admin layouts", (): void => {
    renderApp("/admin/ai-settings");
    expect(screen.getByRole("heading", { name: "AI settings" })).toBeInTheDocument();
    expect(screen.getByText("Secret write-only")).toBeInTheDocument();

    renderApp("/admin/audit-logs");
    expect(screen.getByRole("heading", { name: "Audit logs" })).toBeInTheDocument();
    expect(screen.getByText("Audit trail")).toBeInTheDocument();
  });

  it("supports keyboard shortcuts for search and the new-record panel", (): void => {
    renderApp("/");

    fireEvent.keyDown(window, { key: "/" });
    expect(screen.getByPlaceholderText("Search records, reports, vendors")).toHaveFocus();

    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "N" });
    expect(screen.getByRole("complementary", { name: "New record" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("complementary", { name: "New record", hidden: true })).toHaveAttribute(
      "aria-label",
      "New record",
    );
  });
});

function renderApp(initialEntry: string): void {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  );
}
