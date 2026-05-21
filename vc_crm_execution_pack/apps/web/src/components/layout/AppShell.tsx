import {
  Bell,
  ChevronRight,
  ChevronsUpDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import { type KeyboardEvent, type RefObject, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { routeGroups, type RouteItem } from "../../app/routes";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SlideoverPanel } from "../shared/SlideoverPanel";

export function AppShell(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  useEffect((): void => {
    setIsSidebarOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useKeyboardShortcuts({
    searchRef,
    onNewRecord: () => {
      setIsPanelOpen(true);
    },
    onClosePanel: () => {
      setIsPanelOpen(false);
      setIsSidebarOpen(false);
      setIsUserMenuOpen(false);
    },
  });

  return (
    <div className="min-h-screen bg-vc-bg text-foreground">
      <div
        className={cn(
          "fixed inset-0 z-30 bg-vc-navy/40 transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={() => {
          setIsSidebarOpen(false);
        }}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-card shadow-floating transition-all duration-200 lg:translate-x-0 lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarCollapsed ? "lg:w-20" : "lg:w-72",
        )}
        aria-label="Sidebar"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-control bg-vc-navy text-sm font-bold text-white shadow-card">
              VC
            </div>
            <div className={cn("min-w-0", isSidebarCollapsed && "lg:hidden")}>
              <p className="truncate text-sm font-bold text-vc-navy">VC CRM</p>
              <p className="truncate text-xs text-muted-foreground">Virtual Coders</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label={isSidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={() => {
              setIsSidebarCollapsed((current) => !current);
            }}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Close navigation"
            onClick={() => {
              setIsSidebarOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
          {routeGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p
                className={cn(
                  "mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                  isSidebarCollapsed && "lg:sr-only",
                )}
              >
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }): string =>
                        cn(
                          "flex h-10 items-center gap-3 rounded-control px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                          isActive && "bg-accent text-vc-navy shadow-flat",
                          isSidebarCollapsed && "lg:justify-center lg:px-2",
                        )
                      }
                      title={item.label}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className={cn("truncate", isSidebarCollapsed && "lg:hidden")}>
                        {item.label}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div
            className={cn(
              "rounded-card border border-border bg-vc-bg p-3",
              isSidebarCollapsed && "lg:p-2",
            )}
          >
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wide text-vc-blue",
                isSidebarCollapsed && "lg:hidden",
              )}
            >
              Workspace
            </p>
            <p
              className={cn(
                "mt-1 truncate text-sm font-semibold text-vc-navy",
                isSidebarCollapsed && "lg:hidden",
              )}
            >
              Tenant Admin
            </p>
            <div
              className={cn(
                "hidden h-9 w-9 place-items-center rounded-full bg-card text-xs font-bold text-vc-navy lg:hidden",
                isSidebarCollapsed && "lg:grid",
              )}
            >
              TA
            </div>
          </div>
        </div>
      </aside>
      <div
        className={cn("transition-all duration-200", isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72")}
      >
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 sm:px-5 lg:px-6">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => {
                setIsSidebarOpen(true);
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <nav className="min-w-0 flex-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <ol className="flex min-w-0 items-center gap-1">
                {breadcrumbs.map((breadcrumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <li key={`${breadcrumb}-${index}`} className="flex min-w-0 items-center gap-1">
                      {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                      <span
                        className={cn(
                          "truncate",
                          isLast ? "font-semibold text-vc-navy" : "hidden sm:inline",
                        )}
                      >
                        {breadcrumb}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </nav>
            <label className="relative order-2 w-full min-w-0 sm:order-none sm:max-w-xs lg:max-w-sm">
              <span className="sr-only">Search</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                className="h-10 rounded-control bg-vc-bg pl-9 shadow-flat"
                placeholder="Search records, reports, vendors"
                onKeyDown={handleSearchKeyDown}
              />
            </label>
            <Button
              type="button"
              variant="secondary"
              className="hidden max-w-48 md:inline-flex"
              aria-label="Tenant switcher"
            >
              <span className="truncate">Virtual Coders</span>
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              className="shrink-0"
              onClick={() => {
                setIsPanelOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="User menu"
                aria-expanded={isUserMenuOpen}
                onClick={() => {
                  setIsUserMenuOpen((current) => !current);
                }}
              >
                <UserCircle className="h-5 w-5" />
              </Button>
              <div
                className={cn(
                  "absolute right-0 mt-2 w-56 rounded-card border border-border bg-card p-2 shadow-floating",
                  isUserMenuOpen ? "block" : "hidden",
                )}
                role="menu"
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="text-sm font-semibold text-vc-navy">Tenant Admin</p>
                  <p className="text-xs text-muted-foreground">admin@virtualcoders.local</p>
                </div>
                <button
                  type="button"
                  className="mt-2 flex w-full items-center rounded-control px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  role="menuitem"
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center rounded-control px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1480px] px-4 py-5 sm:px-5 lg:px-8">
          <Outlet />
        </main>
      </div>
      <SlideoverPanel
        isOpen={isPanelOpen}
        title="New record"
        description="Shared create/edit panel foundation. Module forms will plug into this shell in later phases."
        onClose={() => {
          setIsPanelOpen(false);
        }}
      />
    </div>
  );
}

const routeItems = routeGroups.flatMap((group) => group.items);

function getBreadcrumbs(pathname: string): string[] {
  if (pathname === "/") {
    return ["Dashboard"];
  }

  const routeMatch = findRouteMatch(pathname);
  const segmentLabels = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => formatSegment(segment));

  if (routeMatch === undefined) {
    return segmentLabels.length > 0 ? segmentLabels : ["Dashboard"];
  }

  const group = routeGroups.find((candidate) =>
    candidate.items.some((item) => item.path === routeMatch.path),
  );

  if (pathname === routeMatch.path) {
    return group !== undefined && group.label !== routeMatch.label
      ? [group.label, routeMatch.label]
      : [routeMatch.label];
  }

  return group !== undefined && group.label !== routeMatch.label
    ? [group.label, routeMatch.label, "Detail"]
    : [routeMatch.label, "Detail"];
}

function findRouteMatch(pathname: string): RouteItem | undefined {
  return routeItems
    .filter((item) => item.path !== "/" && pathname.startsWith(item.path))
    .sort((first, second) => second.path.length - first.path.length)[0];
}

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function useKeyboardShortcuts(options: {
  searchRef: RefObject<HTMLInputElement>;
  onNewRecord: () => void;
  onClosePanel: () => void;
}): void {
  useEffect((): (() => void) => {
    function handleKeyDown(event: globalThis.KeyboardEvent): void {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        options.searchRef.current?.focus();
      }

      if ((event.key === "n" || event.key === "N") && !isTyping) {
        event.preventDefault();
        options.onNewRecord();
      }

      if (event.key === "Escape") {
        options.onClosePanel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [options]);
}

function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
  if (event.key === "Enter") {
    event.currentTarget.blur();
  }
}
