import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

export type SectionTab = {
  id: string;
  label: string;
  badge?: ReactNode;
};

export type SectionTabsProps = {
  tabs: SectionTab[];
  activeTabId: string;
  onChange: (tabId: string) => void;
  className?: string;
};

export function SectionTabs({
  activeTabId,
  className,
  onChange,
  tabs,
}: SectionTabsProps): JSX.Element {
  return (
    <div className={cn("max-w-full overflow-x-auto border-b border-border", className)}>
      <div className="flex w-max min-w-full gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4",
                isActive
                  ? "border-vc-blue text-vc-navy"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge}
            </button>
          );
        })}
      </div>
    </div>
  );
}
