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
    expect(screen.getByText("Sales")).toBeInTheDocument();
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
    renderApp("/billing");

    expect(screen.getByRole("heading", { name: "Billing" })).toBeInTheDocument();
    expect(screen.getByText("Billing list shell")).toBeInTheDocument();
  });

  it("renders proposal workflows and activity views", (): void => {
    renderApp("/proposals");

    expect(screen.getByRole("heading", { name: "Proposals" })).toBeInTheDocument();
    expect(screen.getByText("Proposal approval queue")).toBeInTheDocument();
    expect(screen.getByText("Proposal list")).toBeInTheDocument();

    renderApp("/proposals/prop-1");
    expect(screen.getByRole("heading", { name: "Acme React Squad Proposal" })).toBeInTheDocument();
    expect(screen.getByText("Proposal editor shell")).toBeInTheDocument();
    expect(screen.getByText("Approval workflow")).toBeInTheDocument();
    expect(screen.getByText("Version history")).toBeInTheDocument();

    renderApp("/activities");
    expect(screen.getByRole("heading", { name: "Activities" })).toBeInTheDocument();
    expect(screen.getAllByText("Activity timeline").length).toBeGreaterThan(0);
    expect(screen.getByText("Task list")).toBeInTheDocument();
    expect(screen.getByText("Reminder UI")).toBeInTheDocument();
  });

  it("renders vendor list and detail layouts", (): void => {
    renderApp("/vendors");

    expect(screen.getByRole("heading", { name: "Vendors" })).toBeInTheDocument();
    expect(screen.getByText("Vendor list")).toBeInTheDocument();
    expect(screen.getAllByText("TalentBridge Solutions").length).toBeGreaterThan(0);

    renderApp("/vendors/vendor-1");
    expect(screen.getByRole("heading", { name: "TalentBridge Solutions" })).toBeInTheDocument();
    expect(screen.getByText("Document/status panel")).toBeInTheDocument();
    expect(screen.getByText("Expertise tags")).toBeInTheDocument();
    expect(screen.getByText("Scorecard tab")).toBeInTheDocument();
    expect(screen.getByText("Candidates tab placeholder")).toBeInTheDocument();
  });

  it("renders candidate list and detail layouts", (): void => {
    renderApp("/candidates");

    expect(screen.getByRole("heading", { name: "Candidates" })).toBeInTheDocument();
    expect(screen.getByText("Candidate list")).toBeInTheDocument();
    expect(screen.getByText("Resume upload UI")).toBeInTheDocument();
    expect(screen.getAllByText("Isha Mehta").length).toBeGreaterThan(0);

    renderApp("/candidates/candidate-1");
    expect(screen.getByRole("heading", { name: "Isha Mehta" })).toBeInTheDocument();
    expect(screen.getByText("Skill filters")).toBeInTheDocument();
    expect(screen.getByText("Resume upload")).toBeInTheDocument();
    expect(screen.getByText("Parsed data review placeholder")).toBeInTheDocument();
    expect(screen.getByText("Consent tracking")).toBeInTheDocument();
  });

  it("renders requirement and submission layouts", (): void => {
    renderApp("/requirements");

    expect(screen.getByRole("heading", { name: "Requirements" })).toBeInTheDocument();
    expect(screen.getByText("Requirements list")).toBeInTheDocument();
    expect(screen.getByText("Broadcast to vendors placeholder")).toBeInTheDocument();

    renderApp("/requirements/req-1");
    expect(screen.getByRole("heading", { name: "Senior React Engineer" })).toBeInTheDocument();
    expect(screen.getByText("Requirement profile")).toBeInTheDocument();
    expect(screen.getByText("Submission tracker")).toBeInTheDocument();
    expect(screen.getByText("Candidate matching panel placeholder")).toBeInTheDocument();

    renderApp("/submissions");
    expect(screen.getByRole("heading", { name: "Submissions" })).toBeInTheDocument();
    expect(screen.getByText("Feedback capture")).toBeInTheDocument();
  });

  it("renders interview and placement layouts", (): void => {
    renderApp("/interviews");

    expect(screen.getByRole("heading", { name: "Interviews" })).toBeInTheDocument();
    expect(screen.getByText("Interview calendar/list")).toBeInTheDocument();
    expect(screen.getAllByText("Schedule interview").length).toBeGreaterThan(0);

    renderApp("/placements");
    expect(screen.getByRole("heading", { name: "Placements" })).toBeInTheDocument();
    expect(screen.getByText("Placement list")).toBeInTheDocument();
    expect(
      screen.getAllByText("Finance fields visible to authorized roles only").length,
    ).toBeGreaterThan(0);

    renderApp("/placements/placement-1");
    expect(screen.getAllByRole("heading", { name: "Isha Mehta" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Placement timeline")).toBeInTheDocument();
    expect(screen.getByText("Authorized finance fields")).toBeInTheDocument();
    expect(screen.getByText("Margin calculation")).toBeInTheDocument();
  });

  it("renders opportunity pipeline and detail layouts", (): void => {
    renderApp("/opportunities");

    expect(screen.getByRole("heading", { name: "Opportunities" })).toBeInTheDocument();
    expect(screen.getByText("Kanban pipeline")).toBeInTheDocument();
    expect(screen.getByText("Opportunity list")).toBeInTheDocument();
    expect(screen.getByText("Weighted forecast")).toBeInTheDocument();

    renderApp("/opportunities/opp-1");
    expect(
      screen.getByRole("heading", { name: "Acme Cloud - Dedicated React squad" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Stage movement").length).toBeGreaterThan(0);
    expect(screen.getByText("Activity feed placeholder")).toBeInTheDocument();
  });

  it("renders accounts list and account detail layouts", (): void => {
    renderApp("/accounts");

    expect(screen.getByRole("heading", { name: "Accounts" })).toBeInTheDocument();
    expect(screen.getByText("Account list")).toBeInTheDocument();
    expect(screen.getByText("Open Acme Cloud Systems detail")).toBeInTheDocument();

    renderApp("/accounts/acct-1");
    expect(screen.getByRole("heading", { name: "Acme Cloud Systems" })).toBeInTheDocument();
    expect(screen.getByText("Contacts sub-table")).toBeInTheDocument();
    expect(screen.getByText("Activity timeline")).toBeInTheDocument();
  });

  it("renders lead list and detail layouts", (): void => {
    renderApp("/leads");

    expect(screen.getByRole("heading", { name: "Leads" })).toBeInTheDocument();
    expect(screen.getByText("Lead list")).toBeInTheDocument();
    expect(screen.getByText("Bulk assign placeholder")).toBeInTheDocument();
    expect(screen.getAllByText("Avni Shah").length).toBeGreaterThan(0);

    renderApp("/leads/lead-1");
    expect(screen.getByRole("heading", { name: "Avni Shah" })).toBeInTheDocument();
    expect(screen.getByText("Lead activity timeline")).toBeInTheDocument();
    expect(screen.getByText("Import and disposition")).toBeInTheDocument();
  });

  it("renders contacts list layout", (): void => {
    renderApp("/contacts");

    expect(screen.getByRole("heading", { name: "Contacts" })).toBeInTheDocument();
    expect(screen.getByText("Contact list")).toBeInTheDocument();
    expect(screen.getByText("Activity timeline placeholder")).toBeInTheDocument();
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

    renderApp("/admin/parsing-jobs");
    expect(screen.getByRole("heading", { name: "Parsing jobs" })).toBeInTheDocument();
    expect(screen.getByText("Document parsing jobs")).toBeInTheDocument();
    expect(screen.getAllByText("Vendor website intelligence placeholder").length).toBeGreaterThan(
      0,
    );

    renderApp("/admin/parsing-jobs/job-1");
    expect(screen.getByRole("heading", { name: "Resume parsed data review" })).toBeInTheDocument();
    expect(screen.getByText("Approve parsed fields")).toBeInTheDocument();
    expect(screen.getByText("Reject parsed fields")).toBeInTheDocument();
    expect(screen.getByText("Human approval required before saving")).toBeInTheDocument();

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
