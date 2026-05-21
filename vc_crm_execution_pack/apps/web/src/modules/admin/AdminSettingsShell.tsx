import {
  Bot,
  Building2,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { SettingsPageTemplate } from "../../components/templates";
import { cn } from "../../lib/utils";

type AdminSettingsShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  primaryAction?: ReactNode;
};

type SettingsNavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

const adminSettingsNav: SettingsNavItem[] = [
  { label: "Users", path: "/admin/users", icon: UserCog },
  { label: "Roles", path: "/admin/roles", icon: LockKeyhole },
  { label: "Tenant Settings", path: "/admin/tenant-settings", icon: Building2 },
  { label: "AI Settings", path: "/admin/ai-settings", icon: Bot },
  { label: "Security", path: "/admin/security", icon: ShieldCheck },
  { label: "Audit Logs", path: "/admin/audit-logs", icon: SlidersHorizontal },
];

export function AdminSettingsShell({
  children,
  description,
  primaryAction,
  title,
}: AdminSettingsShellProps): JSX.Element {
  return (
    <SettingsPageTemplate
      eyebrow="Admin settings"
      title={title}
      description={description}
      primaryAction={primaryAction}
      sideNavigation={<AdminSettingsNav />}
    >
      <div className="space-y-5">{children}</div>
    </SettingsPageTemplate>
  );
}

function AdminSettingsNav(): JSX.Element {
  return (
    <nav
      aria-label="Admin settings navigation"
      className="sticky top-20 rounded-card border border-border bg-card p-2 shadow-card"
    >
      {adminSettingsNav.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={`Settings ${item.label}`}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive && "bg-accent text-vc-navy",
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
