import { ReactElement, ReactNode, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

type NavGroup = {
  label: string;
  icon: ReactNode;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    items: [{ label: "Overview", href: "/dashboard" }]
  },
  {
    label: "Sales",
    icon: <BriefcaseBusiness className="h-4 w-4" />,
    items: [
      { label: "Leads", href: "/leads" },
      { label: "Accounts", href: "/accounts" },
      { label: "Contacts", href: "/contacts" },
      { label: "Opportunities", href: "/opportunities" },
      { label: "Proposals", href: "/proposals" },
      { label: "Activities", href: "/activities" }
    ]
  },
  {
    label: "Delivery",
    icon: <Users className="h-4 w-4" />,
    items: [
      { label: "Requirements", href: "/requirements" },
      { label: "Candidates", href: "/candidates" },
      { label: "Submissions", href: "/submissions" },
      { label: "Interviews", href: "/interviews" },
      { label: "Placements", href: "/placements" }
    ]
  },
  {
    label: "Partners",
    icon: <Building2 className="h-4 w-4" />,
    items: [
      { label: "Vendors", href: "/vendors" },
      { label: "Scorecards", href: "/vendor-scorecards" }
    ]
  },
  {
    label: "Reports",
    icon: <BarChart3 className="h-4 w-4" />,
    items: [
      { label: "Sales Reports", href: "/reports/sales" },
      { label: "Delivery Reports", href: "/reports/delivery" },
      { label: "Finance Reports", href: "/reports/finance" }
    ]
  },
  {
    label: "Admin",
    icon: <Settings className="h-4 w-4" />,
    items: [
      { label: "Users", href: "/admin/users" },
      { label: "Roles", href: "/admin/roles" },
      { label: "Tenant Settings", href: "/admin/settings" },
      { label: "AI Settings", href: "/admin/ai" },
      { label: "Security", href: "/admin/security" },
      { label: "Audit Logs", href: "/admin/audit-logs" }
    ]
  }
];

type AppShellProps = {
  children: ReactNode;
  title?: string;
};

export function AppShell({ children, title = "VC CRM" }: AppShellProps): ReactElement {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-200 bg-white lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden">
          <div className="h-full w-80 bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
              <span className="text-sm font-semibold text-slate-950">VC CRM</span>
              <button
                type="button"
                aria-label="Close navigation"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
          <button
            type="button"
            aria-label="Open navigation"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500">Virtual Coders</p>
            <h1 className="truncate text-base font-semibold text-slate-950">{title}</h1>
          </div>

          <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              aria-label="Global search"
              placeholder="Search leads, candidates, vendors..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <button className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:block">
            + Create
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span className="hidden sm:inline">Admin</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1480px] px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent(): ReactElement {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
          VC
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">VC CRM</p>
          <p className="text-xs text-slate-500">Sales and Delivery OS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {group.icon}
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">System Health</p>
          <p className="mt-1 text-xs text-slate-500">All modules active</p>
        </div>
      </div>
    </div>
  );
}
