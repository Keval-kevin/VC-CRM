import type { AccessTokenPayload } from "../../shared/auth/jwt.js";
import type { DashboardRole, ReportId } from "./reports.schema.js";

export type ReportsActor = AccessTokenPayload;

export type ReportMetric = {
  label: string;
  value: number;
  format?: "currency" | "number" | "percent";
};

export type ReportChartPoint = {
  label: string;
  value: number;
  secondaryValue?: number;
};

export type ReportTableRow = Record<string, string | number | null>;

export type ReportPayload = {
  id: ReportId;
  title: string;
  description: string;
  visible: boolean;
  metrics: ReportMetric[];
  chart: ReportChartPoint[];
  rows: ReportTableRow[];
};

export type DashboardPayload = {
  role: DashboardRole;
  title: string;
  description: string;
  visibleReports: ReportId[];
  cards: ReportMetric[];
  charts: {
    title: string;
    points: ReportChartPoint[];
  }[];
  actionQueue: ReportTableRow[];
};
