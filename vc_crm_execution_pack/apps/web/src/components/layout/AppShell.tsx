import { Menu, Search, X } from "lucide-react";
import { type KeyboardEvent, type RefObject, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { routeGroups } from "../../app/routes";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SlideoverPanel } from "../shared/SlideoverPanel";

export function AppShell(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect((): void => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useKeyboardShortcuts({
    searchRef,
    onNewRecord: () => {
      setIsPanelOpen(true);
    },
    onClosePanel: () => {
      setIsPanelOpen(false);
      setIsSidebarOpen(false);
    },
  });

  return (
    <div className="min-h-screen bg-vc-bg text-foreground">
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/40 transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={() => {
          setIsSidebarOpen(false);
        }}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Sidebar"
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-vc-blue">Virtual Coders</p>
            <p className="text-sm font-semibold text-vc-navy">VC CRM</p>
          </div>
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
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                          "flex h-9 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                          isActive && "bg-accent text-vc-navy",
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-3 backdrop-blur sm:px-4">
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
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              className="pl-9"
              placeholder="Search records, reports, vendors"
              onKeyDown={handleSearchKeyDown}
            />
          </label>
          <Button
            type="button"
            className="hidden sm:inline-flex"
            onClick={() => {
              setIsPanelOpen(true);
            }}
          >
            New
          </Button>
          <div className="hidden min-w-0 items-center gap-3 border-l border-border pl-3 sm:flex">
            <div className="text-right">
              <p className="truncate text-sm font-semibold text-vc-navy">Virtual Coders</p>
              <p className="truncate text-xs text-muted-foreground">Tenant Admin</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-vc-navy text-sm font-bold text-white">
              TA
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 lg:px-6">
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
