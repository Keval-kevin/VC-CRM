import {
  ActivityStatus,
  LeadStatus,
  OpportunityStage,
  PlacementBillingStatus,
  Prisma,
  RequirementStatus,
  SubmissionStatus,
  VendorStatus,
} from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { permissions } from "../../shared/auth/permissions.js";
import { prisma } from "../../shared/prisma/client.js";
import type { DashboardRole, ReportId, ReportQuery } from "./reports.schema.js";
import type {
  DashboardPayload,
  ReportChartPoint,
  ReportMetric,
  ReportPayload,
  ReportsActor,
  ReportTableRow,
} from "./reports.types.js";

const reportCatalog = [
  {
    id: "lead-source-performance",
    title: "Lead source performance",
    description: "Lead volume and qualification by source.",
    permission: permissions.leadsRead,
  },
  {
    id: "sales-pipeline",
    title: "Sales pipeline",
    description: "Pipeline value and deal count by stage.",
    permission: permissions.opportunitiesRead,
  },
  {
    id: "weighted-forecast",
    title: "Weighted forecast",
    description: "Weighted forecast by opportunity stage.",
    permission: permissions.opportunitiesRead,
  },
  {
    id: "win-loss",
    title: "Win/loss",
    description: "Won and lost movement across deals and proposals.",
    permission: permissions.opportunitiesRead,
  },
  {
    id: "team-activity",
    title: "Team activity",
    description: "Activity volume by status and owner.",
    permission: permissions.activitiesRead,
  },
  {
    id: "vendor-performance",
    title: "Vendor performance",
    description: "Vendor scores, risk, and readiness.",
    permission: permissions.vendorsRead,
  },
  {
    id: "candidate-submissions",
    title: "Candidate submissions",
    description: "Candidate submission funnel by status.",
    permission: permissions.submissionsRead,
  },
  {
    id: "requirement-status",
    title: "Requirement status",
    description: "Open demand, priority, and positions by requirement status.",
    permission: permissions.requirementsRead,
  },
  {
    id: "placement-revenue",
    title: "Placement revenue",
    description: "Billing, cost, and margin from placements.",
    permission: permissions.placementsRead,
  },
  {
    id: "audit-security",
    title: "Audit/security report",
    description: "Security-sensitive audit activity.",
    permission: permissions.auditRead,
  },
] as const satisfies ReadonlyArray<{
  id: ReportId;
  title: string;
  description: string;
  permission: string;
}>;

export async function listReports(
  actor: ReportsActor,
  query: ReportQuery,
): Promise<ReportPayload[]> {
  await assertReportQueryAccess(actor, query);
  const visibleReports = reportCatalog.filter((report) => canView(actor, report.permission));
  const tenantWhere = getTenantWhere(actor);

  return Promise.all(
    visibleReports.map((report) => buildReportPayload(report, report.id, tenantWhere, query)),
  );
}

export async function getReport(
  actor: ReportsActor,
  reportId: ReportId,
  query: ReportQuery,
): Promise<ReportPayload> {
  const report = reportCatalog.find((item) => item.id === reportId);

  if (report === undefined) {
    throw new AppError("NOT_FOUND", "Report not found", 404);
  }

  if (!canView(actor, report.permission)) {
    throw new AppError("AUTH_003", "Insufficient permissions", 403);
  }

  await assertReportQueryAccess(actor, query);
  const tenantWhere = getTenantWhere(actor);
  const payload = await buildReportPayload(report, reportId, tenantWhere, query);

  await createReportAuditLog(actor, "report.viewed", reportId, {
    reportId,
    filters: summarizeReportQuery(query),
  });

  return payload;
}

async function buildReportPayload(
  report: (typeof reportCatalog)[number],
  reportId: ReportId,
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  switch (reportId) {
    case "lead-source-performance":
      return buildLeadSourceReport(report, tenantWhere, query);
    case "sales-pipeline":
      return buildSalesPipelineReport(report, tenantWhere, query);
    case "weighted-forecast":
      return buildWeightedForecastReport(report, tenantWhere, query);
    case "win-loss":
      return buildWinLossReport(report, tenantWhere, query);
    case "team-activity":
      return buildTeamActivityReport(report, tenantWhere, query);
    case "vendor-performance":
      return buildVendorPerformanceReport(report, tenantWhere, query);
    case "candidate-submissions":
      return buildCandidateSubmissionsReport(report, tenantWhere, query);
    case "requirement-status":
      return buildRequirementStatusReport(report, tenantWhere, query);
    case "placement-revenue":
      return buildPlacementRevenueReport(report, tenantWhere, query);
    case "audit-security":
      return buildAuditSecurityReport(report, tenantWhere, query);
  }
}

export async function getDashboard(
  actor: ReportsActor,
  role: DashboardRole,
  query: ReportQuery,
): Promise<DashboardPayload> {
  await assertReportQueryAccess(actor, query);
  assertDashboardRoleVisible(actor, role);

  const reports = await listReports(actor, query);
  const reportIds = reports.map((report) => report.id);
  const metrics = reports.flatMap((report) => report.metrics);
  const cards = pickDashboardCards(role, metrics);

  const dashboard = {
    role,
    title: getDashboardTitle(role),
    description: "Role-scoped operating dashboard assembled from report data.",
    visibleReports: reportIds,
    cards,
    charts: reports.slice(0, 3).map((report) => ({ title: report.title, points: report.chart })),
    actionQueue: reports.flatMap((report) => report.rows.slice(0, 2)).slice(0, 6),
  };

  await createReportAuditLog(actor, "dashboard.viewed", role, {
    role,
    visibleReports: reportIds,
    filters: summarizeReportQuery(query),
  });

  return dashboard;
}

function buildDateWhere(field: "createdAt" | "expectedCloseDate" | "dueAt" | "submittedAt" | "joiningDate" | "scheduledAt", query: ReportQuery): Record<string, unknown> {
  if (query.from === undefined && query.to === undefined) {
    return {};
  }

  return {
    [field]: {
      ...(query.from === undefined ? {} : { gte: query.from }),
      ...(query.to === undefined ? {} : { lte: query.to }),
    },
  };
}

async function buildLeadSourceReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const where: Prisma.LeadWhereInput = {
    ...tenantWhere,
    deletedAt: null,
    ...buildDateWhere("createdAt", query),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...enumWhere("status", query.status, LeadStatus),
  };
  const leads = await prisma.lead.findMany({
    where,
    select: { source: true, status: true, score: true, ownerId: true },
  });
  const chart = countBy(leads, (lead) => lead.source || "Unknown");
  const qualified = leads.filter((lead) => lead.status === "QUALIFIED").length;

  return toReport(report, [
    metric("Total leads", leads.length),
    metric("Qualified", qualified),
    metric("Average score", average(leads.map((lead) => lead.score))),
  ], chart, chart.map((point) => ({ source: point.label, leads: point.value })));
}

async function buildSalesPipelineReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const opportunities = await getFilteredOpportunities(tenantWhere, query);
  const chart = sumBy(opportunities, (item) => item.stage, (item) => item.valueCents);

  return toReport(report, [
    metric("Open deals", opportunities.length),
    metric("Pipeline value", sum(opportunities.map((item) => item.valueCents)), "currency"),
  ], chart, opportunities.slice(0, 25).map((item) => ({
    deal: item.name,
    stage: item.stage,
    value: item.valueCents,
    weightedForecast: item.weightedForecastCents,
  })));
}

async function buildWeightedForecastReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const opportunities = await getFilteredOpportunities(tenantWhere, query);
  const chart = sumBy(opportunities, (item) => item.stage, (item) => item.weightedForecastCents);

  return toReport(report, [
    metric("Weighted forecast", sum(opportunities.map((item) => item.weightedForecastCents)), "currency"),
    metric("Average probability", average(opportunities.map((item) => item.probability)), "percent"),
  ], chart, opportunities.slice(0, 25).map((item) => ({
    deal: item.name,
    probability: item.probability,
    weightedForecast: item.weightedForecastCents,
    expectedClose: item.expectedCloseDate?.toISOString() ?? null,
  })));
}

async function buildWinLossReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const opportunities = await getFilteredOpportunities(tenantWhere, query);
  const won = opportunities.filter((item) => item.stage === "WON").length;
  const lost = opportunities.filter((item) => item.stage === "LOST").length;
  const chart = [
    { label: "Won", value: won },
    { label: "Lost", value: lost },
    { label: "Open", value: opportunities.length - won - lost },
  ];

  return toReport(report, [
    metric("Won", won),
    metric("Lost", lost),
    metric("Win rate", opportunities.length === 0 ? 0 : Math.round((won / opportunities.length) * 100), "percent"),
  ], chart, chart.map((point) => ({ outcome: point.label, count: point.value })));
}

async function buildTeamActivityReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const where: Prisma.CrmActivityWhereInput = {
    ...tenantWhere,
    deletedAt: null,
    ...buildDateWhere("dueAt", query),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...enumWhere("status", query.status, ActivityStatus),
  };
  const activities = await prisma.crmActivity.findMany({
    where,
    select: { status: true, type: true, ownerId: true, title: true, dueAt: true },
    take: 100,
  });
  const chart = countBy(activities, (item) => item.status);

  return toReport(report, [
    metric("Activities", activities.length),
    metric("Open", activities.filter((item) => item.status === "OPEN").length),
    metric("Completed", activities.filter((item) => item.status === "COMPLETED").length),
  ], chart, activities.slice(0, 25).map((item) => ({
    activity: item.title,
    type: item.type,
    status: item.status,
    dueAt: item.dueAt?.toISOString() ?? null,
  })));
}

async function buildVendorPerformanceReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const vendors = await prisma.vendor.findMany({
    where: {
      ...tenantWhere,
      deletedAt: null,
      ...enumWhere("status", query.status, VendorStatus),
    },
    select: { name: true, tier: true, riskStatus: true, overallScore: true, portalEnabled: true },
    take: 100,
  });
  const chart = countBy(vendors, (vendor) => vendor.riskStatus);

  return toReport(report, [
    metric("Vendors", vendors.length),
    metric("Average score", average(vendors.map((vendor) => vendor.overallScore))),
    metric("Portal ready", vendors.filter((vendor) => vendor.portalEnabled).length),
  ], chart, vendors.slice(0, 25).map((vendor) => ({
    vendor: vendor.name,
    tier: vendor.tier,
    risk: vendor.riskStatus,
    score: vendor.overallScore,
  })));
}

async function buildCandidateSubmissionsReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const submissions = await prisma.candidateSubmission.findMany({
    where: {
      ...tenantWhere,
      deletedAt: null,
      ...buildDateWhere("submittedAt", query),
      ...enumWhere("status", query.status, SubmissionStatus),
    },
    select: {
      status: true,
      submittedAt: true,
      candidate: { select: { firstName: true, lastName: true } },
      requirement: { select: { roleTitle: true } },
      vendor: { select: { name: true } },
    },
    take: 100,
  });
  const chart = countBy(submissions, (submission) => submission.status);

  return toReport(report, [
    metric("Submissions", submissions.length),
    metric("Client submitted", submissions.filter((item) => item.status === "CLIENT_SUBMITTED").length),
  ], chart, submissions.slice(0, 25).map((item) => ({
    candidate: `${item.candidate.firstName} ${item.candidate.lastName}`,
    requirement: item.requirement.roleTitle,
    vendor: item.vendor?.name ?? "Direct",
    status: item.status,
  })));
}

async function buildRequirementStatusReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const requirements = await prisma.staffAugRequirement.findMany({
    where: {
      ...tenantWhere,
      deletedAt: null,
      ...buildDateWhere("createdAt", query),
      ...enumWhere("status", query.status, RequirementStatus),
    },
    select: { roleTitle: true, status: true, priority: true, positions: true, skills: true },
    take: 100,
  });
  const chart = countBy(requirements, (requirement) => requirement.status);

  return toReport(report, [
    metric("Requirements", requirements.length),
    metric("Open positions", sum(requirements.map((item) => item.positions))),
    metric("High priority", requirements.filter((item) => item.priority === "HIGH" || item.priority === "URGENT").length),
  ], chart, requirements.slice(0, 25).map((item) => ({
    requirement: item.roleTitle,
    status: item.status,
    priority: item.priority,
    positions: item.positions,
    skills: item.skills.join(", "),
  })));
}

async function buildPlacementRevenueReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const placements = await prisma.placement.findMany({
    where: {
      ...tenantWhere,
      deletedAt: null,
      ...buildDateWhere("joiningDate", query),
      ...enumWhere("billingStatus", query.status, PlacementBillingStatus),
    },
    select: {
      clientBillingRateCents: true,
      vendorCostCents: true,
      marginCents: true,
      billingStatus: true,
      candidate: { select: { firstName: true, lastName: true } },
      vendor: { select: { name: true } },
      requirement: { select: { roleTitle: true } },
    },
    take: 100,
  });
  const chart = sumBy(placements, (placement) => placement.billingStatus, (placement) => placement.marginCents);

  return toReport(report, [
    metric("Placement revenue", sum(placements.map((item) => item.clientBillingRateCents)), "currency"),
    metric("Vendor cost", sum(placements.map((item) => item.vendorCostCents)), "currency"),
    metric("Margin", sum(placements.map((item) => item.marginCents)), "currency"),
  ], chart, placements.slice(0, 25).map((item) => ({
    candidate: `${item.candidate.firstName} ${item.candidate.lastName}`,
    requirement: item.requirement.roleTitle,
    vendor: item.vendor?.name ?? "Direct",
    billing: item.clientBillingRateCents,
    margin: item.marginCents,
  })));
}

async function buildAuditSecurityReport(
  report: (typeof reportCatalog)[number],
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<ReportPayload> {
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      ...tenantWhere,
      deletedAt: null,
      ...buildDateWhere("createdAt", query),
      ...(query.status === undefined ? {} : { action: { contains: query.status, mode: "insensitive" } }),
    },
    select: { action: true, entityType: true, ipAddress: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const chart = countBy(auditLogs, (item) => item.entityType);

  return toReport(report, [
    metric("Audit events", auditLogs.length),
    metric("Security events", auditLogs.filter((item) => item.action.includes("security")).length),
  ], chart, auditLogs.slice(0, 25).map((item) => ({
    action: item.action,
    entity: item.entityType,
    ip: item.ipAddress,
    createdAt: item.createdAt.toISOString(),
  })));
}

function getFilteredOpportunities(
  tenantWhere: TenantWhere,
  query: ReportQuery,
): Promise<Array<{
  name: string;
  stage: string;
  probability: number;
  valueCents: number;
  weightedForecastCents: number;
  expectedCloseDate: Date | null;
}>> {
  return prisma.opportunity.findMany({
    where: {
      ...tenantWhere,
      deletedAt: null,
      ...buildDateWhere("expectedCloseDate", query),
      ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
      ...enumWhere("stage", query.status, OpportunityStage),
    },
    select: {
      name: true,
      stage: true,
      probability: true,
      valueCents: true,
      weightedForecastCents: true,
      expectedCloseDate: true,
    },
    take: 100,
  });
}

type TenantWhere = { tenantId?: string };

function getTenantWhere(actor: ReportsActor): TenantWhere {
  if (actor.isSuperAdmin === true && actor.tenantId === null) {
    return {};
  }

  if (actor.tenantId === null) {
    throw new AppError("TENANT_001", "Tenant context is required", 403);
  }

  return { tenantId: actor.tenantId };
}

function canView(actor: ReportsActor, permission: string): boolean {
  return actor.isSuperAdmin === true || actor.permissions.includes(permission);
}

async function assertReportQueryAccess(actor: ReportsActor, query: ReportQuery): Promise<void> {
  if (query.ownerId === undefined || actor.isSuperAdmin === true) {
    return;
  }

  const tenantId = getTenantWhere(actor).tenantId;
  if (tenantId === undefined) {
    return;
  }

  const owner = await prisma.user.findFirst({
    where: {
      id: query.ownerId,
      tenantId,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (owner === null) {
    throw new AppError("TENANT_002", "Report owner filter must belong to the active tenant", 400);
  }
}

function assertDashboardRoleVisible(actor: ReportsActor, role: DashboardRole): void {
  if (actor.isSuperAdmin === true) {
    return;
  }

  const permissionsByRole: Record<DashboardRole, string[]> = {
    founder: [permissions.auditRead, permissions.opportunitiesRead, permissions.placementsRead],
    "tenant-admin": [
      permissions.adminSettingsManage,
      permissions.usersManage,
      permissions.rolesManage,
    ],
    "sales-manager": [permissions.leadsRead, permissions.opportunitiesRead],
    "sales-executive": [permissions.leadsRead, permissions.activitiesRead],
    "delivery-manager": [
      permissions.requirementsRead,
      permissions.submissionsRead,
      permissions.interviewsRead,
    ],
    "hr-recruiter": [permissions.candidatesRead, permissions.submissionsRead],
    finance: [permissions.placementsRead],
  };

  if (!permissionsByRole[role].some((permission) => canView(actor, permission))) {
    throw new AppError("AUTH_003", "Insufficient permissions for this dashboard role", 403);
  }
}

async function createReportAuditLog(
  actor: ReportsActor,
  action: string,
  entityId: string,
  metadata: Prisma.InputJsonValue,
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      tenantId: actor.tenantId,
      actorUserId: actor.sub,
      action,
      entityType: "report",
      entityId,
      metadata,
    },
  });
}

function summarizeReportQuery(query: ReportQuery): Prisma.InputJsonValue {
  return {
    from: query.from?.toISOString() ?? null,
    to: query.to?.toISOString() ?? null,
    ownerId: query.ownerId ?? null,
    team: query.team ?? null,
    status: query.status ?? null,
  };
}

function toReport(
  report: (typeof reportCatalog)[number],
  metrics: ReportMetric[],
  chart: ReportChartPoint[],
  rows: ReportTableRow[],
): ReportPayload {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    visible: true,
    metrics,
    chart,
    rows,
  };
}

function metric(label: string, value: number, format: ReportMetric["format"] = "number"): ReportMetric {
  return { label, value, format };
}

function countBy<TItem>(items: TItem[], getLabel: (item: TItem) => string): ReportChartPoint[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    const label = getLabel(item);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

function sumBy<TItem>(
  items: TItem[],
  getLabel: (item: TItem) => string,
  getValue: (item: TItem) => number,
): ReportChartPoint[] {
  const totals = new Map<string, number>();

  for (const item of items) {
    const label = getLabel(item);
    totals.set(label, (totals.get(label) ?? 0) + getValue(item));
  }

  return Array.from(totals.entries()).map(([label, value]) => ({ label, value }));
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(sum(values) / values.length);
}

function enumWhere<TEnum extends Record<string, string>>(
  field: string,
  value: string | undefined,
  values: TEnum,
): Record<string, string> {
  if (value === undefined || !Object.values(values).includes(value)) {
    return {};
  }

  return { [field]: value };
}

function pickDashboardCards(role: DashboardRole, metrics: ReportMetric[]): ReportMetric[] {
  const labelsByRole: Record<DashboardRole, string[]> = {
    founder: ["Pipeline value", "Weighted forecast", "Placement revenue", "Margin", "Open positions", "Audit events"],
    "tenant-admin": ["Activities", "Requirements", "Submissions", "Vendors", "Audit events", "Open deals"],
    "sales-manager": ["Pipeline value", "Weighted forecast", "Open deals", "Qualified", "Win rate", "Activities"],
    "sales-executive": ["Total leads", "Qualified", "Open deals", "Activities", "Open", "Completed"],
    "delivery-manager": ["Requirements", "Open positions", "Submissions", "Client submitted", "Activities", "Placements"],
    "hr-recruiter": ["Submissions", "Client submitted", "Requirements", "Open positions", "Activities", "Completed"],
    finance: ["Placement revenue", "Vendor cost", "Margin", "Audit events", "Vendors", "Portal ready"],
  };
  const preferred = labelsByRole[role]
    .map((label) => metrics.find((metricItem) => metricItem.label === label))
    .filter((item): item is ReportMetric => item !== undefined);

  return [...preferred, ...metrics].slice(0, 6);
}

function getDashboardTitle(role: DashboardRole): string {
  const titles: Record<DashboardRole, string> = {
    founder: "Founder / Super Admin dashboard",
    "tenant-admin": "Tenant Admin dashboard",
    "sales-manager": "Sales Manager dashboard",
    "sales-executive": "Sales Executive dashboard",
    "delivery-manager": "Delivery Manager dashboard",
    "hr-recruiter": "HR Recruiter dashboard",
    finance: "Finance dashboard",
  };

  return titles[role];
}
