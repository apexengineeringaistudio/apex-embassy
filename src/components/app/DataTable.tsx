import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EmptyState } from "./bits";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sort?: (row: T) => string | number;
  className?: string;
}

export interface FilterDef<T> {
  label: string;
  options: string[];
  get: (row: T) => string;
}

export function DataTable<T extends { id: string }>({
  rows, columns, searchText, filters = [], onRowClick, toolbar, emptyHint,
}: {
  rows: T[];
  columns: Column<T>[];
  searchText: (row: T) => string;
  filters?: FilterDef<T>[];
  onRowClick?: (row: T) => void;
  toolbar?: ReactNode;
  emptyHint?: string;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);

  const data = useMemo(() => {
    let r = rows.filter((row) => searchText(row).toLowerCase().includes(q.toLowerCase()));
    filters.forEach((f) => { const v = sel[f.label]; if (v) r = r.filter((row) => f.get(row) === v); });
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sort) r = [...r].sort((a, b) => (col.sort!(a) > col.sort!(b) ? 1 : -1) * sort.dir);
    }
    return r;
  }, [rows, q, sel, sort, columns, filters, searchText]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-8 pl-7 text-[13px]" />
        </div>
        {filters.map((f) => (
          <select key={f.label} value={sel[f.label] ?? ""} onChange={(e) => setSel({ ...sel, [f.label]: e.target.value })}
            className="h-8 rounded-md border bg-card px-2 text-[13px]" aria-label={f.label}>
            <option value="">All {f.label}</option>
            {f.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{data.length} of {rows.length}</span>
          {toolbar}
        </div>
      </div>
      {data.length === 0 ? (
        <div className="p-4"><EmptyState title="No matching records" hint={emptyHint ?? "Adjust search or filters."} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={cn("whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", c.className)}>
                    {c.sort ? (
                      <button className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={() => setSort(sort?.key === c.key ? { key: c.key, dir: sort.dir === 1 ? -1 : 1 } : { key: c.key, dir: 1 })}>
                        {c.header}
                        {sort?.key === c.key ? (sort.dir === 1 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />) : <ArrowUpDown className="size-3 opacity-50" />}
                      </button>
                    ) : c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} onClick={() => onRowClick?.(row)}
                  className={cn("border-t", onRowClick && "cursor-pointer hover:bg-accent/50")}>
                  {columns.map((c) => <td key={c.key} className={cn("px-3 py-2 align-middle", c.className)}>{c.cell(row)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
