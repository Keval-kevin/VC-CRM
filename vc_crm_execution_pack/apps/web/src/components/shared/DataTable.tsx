import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { SurfaceCard } from "./SurfaceCard";

export type DataTableColumn<Row> = {
  id: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  className?: string;
};

export type DataTableProps<Row> = {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  emptyState?: ReactNode;
  onRowClick?: (row: Row) => void;
  className?: string;
};

export function DataTable<Row>({
  actions,
  className,
  columns,
  description,
  emptyState,
  getRowId,
  onRowClick,
  rows,
  title,
  toolbar,
}: DataTableProps<Row>): JSX.Element {
  return (
    <SurfaceCard padding="none" className={cn("overflow-hidden", className)}>
      {(title !== undefined || description !== undefined || actions !== undefined) && (
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title !== undefined && (
              <h2 className="text-base font-semibold text-vc-navy">{title}</h2>
            )}
            {description !== undefined && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions !== undefined && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {toolbar !== undefined && <div className="border-b border-border p-4">{toolbar}</div>}
      {rows.length === 0 && emptyState !== undefined ? (
        <div className="p-4">{emptyState}</div>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm sm:min-w-[680px]">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn("whitespace-nowrap px-3 py-3 font-semibold sm:px-4", column.className)}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {rows.map((row) => (
                <tr
                  key={getRowId(row)}
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    onRowClick !== undefined && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "max-w-[18rem] break-words px-3 py-3 text-foreground sm:px-4",
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SurfaceCard>
  );
}
