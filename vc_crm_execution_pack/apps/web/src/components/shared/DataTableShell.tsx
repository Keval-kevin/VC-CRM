import { Filter, ListFilter, Search } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { DataTable } from "./DataTable";

export type DataTableColumn = {
  key: string;
  label: string;
};

export type DataTableRow = { id: string } & Record<string, string>;

export type DataTableShellProps = {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  title: string;
};

export function DataTableShell({ columns, rows, title }: DataTableShellProps): JSX.Element {
  return (
    <DataTable<DataTableRow>
      title={title}
      description="Saved views, filters, table controls, and bulk actions."
      columns={columns.map((column) => ({
        id: column.key,
        header: column.label,
        cell: (row) => row[column.key] ?? "",
      }))}
      rows={rows}
      getRowId={(row) => row.id}
      actions={
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
      }
      toolbar={<DataTableShellToolbar />}
    />
  );
}

export function DataTableShellToolbar(): JSX.Element {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
  );
}
