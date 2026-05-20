import { Filter, ListFilter, Search } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

export type DataTableColumn = {
  key: string;
  label: string;
};

export type DataTableRow = Record<string, string>;

export type DataTableShellProps = {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  title: string;
};

export function DataTableShell({ columns, rows, title }: DataTableShellProps): JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-vc-navy">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Saved views, filters, table controls, and bulk actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm">
            <ListFilter className="h-4 w-4" />
            Views
          </Button>
          <Button type="button" variant="secondary" size="sm">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative w-full sm:max-w-xs">
            <span className="sr-only">Search table</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search this view" />
          </label>
          <div className="flex flex-wrap gap-2">
            <Badge variant="muted">Bulk actions</Badge>
            <Badge variant="muted">Columns</Badge>
            <Badge variant="muted">Export</Badge>
          </div>
        </div>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-3 py-3 font-semibold">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-3 text-foreground">
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
