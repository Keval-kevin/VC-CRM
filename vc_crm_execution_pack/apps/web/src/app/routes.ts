import {
  Activity,
  BadgeIndianRupee,
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Contact,
  FileText,
  Flag,
  Gauge,
  Handshake,
  Import,
  Landmark,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type RouteItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  status: "ready" | "planned";
};

export type RouteGroup = {
  label: string;
  items: RouteItem[];
};

export const routeGroups = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard, status: "ready" }],
  },
  {
    label: "CRM",
    items: [
      { label: "Leads", path: "/leads", icon: Flag, status: "planned" },
      { label: "Accounts", path: "/accounts", icon: Building2, status: "planned" },
      { label: "Contacts", path: "/contacts", icon: Contact, status: "planned" },
      {
        label: "Opportunities",
        path: "/opportunities",
        icon: BriefcaseBusiness,
        status: "planned",
      },
      { label: "Proposals", path: "/proposals", icon: FileText, status: "planned" },
      { label: "Activities", path: "/activities", icon: Activity, status: "planned" },
      { label: "Tasks", path: "/tasks", icon: ListChecks, status: "planned" },
    ],
  },
  {
    label: "Delivery",
    items: [
      { label: "Requirements", path: "/requirements", icon: ClipboardList, status: "planned" },
      { label: "Candidates", path: "/candidates", icon: Users, status: "planned" },
      { label: "Submissions", path: "/submissions", icon: Network, status: "planned" },
      { label: "Interviews", path: "/interviews", icon: Bell, status: "planned" },
      { label: "Placements", path: "/placements", icon: Handshake, status: "planned" },
    ],
  },
  {
    label: "Partners",
    items: [
      { label: "Vendors", path: "/vendors", icon: Landmark, status: "planned" },
      { label: "Vendor Portal", path: "/vendor-portal", icon: ShieldCheck, status: "planned" },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Billing", path: "/billing", icon: BadgeIndianRupee, status: "planned" },
      { label: "Revenue", path: "/revenue", icon: BarChart3, status: "planned" },
      { label: "Vendor Costs", path: "/vendor-costs", icon: Gauge, status: "planned" },
    ],
  },
  {
    label: "Automation",
    items: [
      { label: "Rules", path: "/rules", icon: Sparkles, status: "planned" },
      { label: "Notifications", path: "/notifications", icon: Bell, status: "planned" },
      { label: "AI Parsing", path: "/ai-parsing", icon: Bot, status: "planned" },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Admin Dashboard", path: "/admin", icon: UserCog, status: "planned" },
      { label: "Users", path: "/admin/users", icon: UserCog, status: "planned" },
      { label: "Roles", path: "/admin/roles", icon: LockKeyhole, status: "planned" },
      {
        label: "Tenant Settings",
        path: "/admin/tenant-settings",
        icon: Building2,
        status: "planned",
      },
      { label: "Security", path: "/admin/security", icon: ShieldCheck, status: "planned" },
      { label: "AI Settings", path: "/admin/ai-settings", icon: Bot, status: "planned" },
      { label: "Imports", path: "/admin/imports", icon: Import, status: "planned" },
      { label: "Audit Logs", path: "/admin/audit-logs", icon: ShieldCheck, status: "planned" },
    ],
  },
] satisfies RouteGroup[];

export const placeholderRoutes = routeGroups.flatMap((group) =>
  group.items.filter(
    (item) =>
      item.path !== "/" &&
      ![
        "/admin",
        "/admin/users",
        "/admin/roles",
        "/admin/tenant-settings",
        "/admin/security",
        "/admin/ai-settings",
        "/admin/audit-logs",
        "/leads",
        "/accounts",
        "/contacts",
      ].includes(item.path),
  ),
);
