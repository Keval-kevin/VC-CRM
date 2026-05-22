import { z } from "zod";

export const dashboardRoleSchema = z.enum([
  "founder",
  "tenant-admin",
  "sales-manager",
  "sales-executive",
  "delivery-manager",
  "hr-recruiter",
  "finance",
]);

export const reportIdSchema = z.enum([
  "lead-source-performance",
  "sales-pipeline",
  "weighted-forecast",
  "win-loss",
  "team-activity",
  "vendor-performance",
  "candidate-submissions",
  "requirement-status",
  "placement-revenue",
  "audit-security",
]);

export const reportQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  ownerId: z.string().uuid().optional(),
  team: z.string().trim().max(80).optional(),
  status: z.string().trim().max(80).optional(),
});

export type DashboardRole = z.infer<typeof dashboardRoleSchema>;
export type ReportId = z.infer<typeof reportIdSchema>;
export type ReportQuery = z.infer<typeof reportQuerySchema>;
