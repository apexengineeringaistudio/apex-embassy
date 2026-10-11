import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDB } from "@/data/repository";
import { daysFromToday } from "@/lib/format";
import type { Activity } from "@/lib/types";
import { ActivityList } from "./ActivityList";
import { PageHeader, Panel } from "./bits";
import { useQuickCreate } from "./QuickCreate";

export function ActivitiesPage({ title, subtitle, filter }: { title: string; subtitle: string; filter: (a: Activity) => boolean }) {
  const db = useDB();
  const create = useQuickCreate();
  const [tab, setTab] = useState<"open" | "done">("open");
  const all = db.activities.filter(filter).sort((a, b) => a.due.localeCompare(b.due));
  const open = all.filter((a) => !a.completed);
  const groups = [
    { label: "Overdue", items: open.filter((a) => daysFromToday(a.due) < 0) },
    { label: "Today", items: open.filter((a) => daysFromToday(a.due) === 0) },
    { label: "Upcoming", items: open.filter((a) => daysFromToday(a.due) > 0) },
  ];
  return (
    <>
      <PageHeader eyebrow="Activities" title={title} subtitle={subtitle}
        actions={<Button size="sm" onClick={() => create("activity")}><Plus /> Log activity</Button>} />
      <div className="mb-3 inline-flex rounded-md border bg-card p-0.5 text-[13px]">
        {(["open", "done"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded px-3 py-1 ${tab === t ? "bg-secondary font-medium" : "text-muted-foreground"}`}>
            {t === "open" ? `Open (${open.length})` : `Completed (${all.length - open.length})`}
          </button>
        ))}
      </div>
      {tab === "open" ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {groups.map((g) => (
            <Panel key={g.label} title={`${g.label} · ${g.items.length}`}>
              <ActivityList items={g.items} emptyTitle={`No ${g.label.toLowerCase()} items`} />
            </Panel>
          ))}
        </div>
      ) : (
        <Panel title="Completed"><ActivityList items={all.filter((a) => a.completed)} emptyTitle="Nothing completed yet" /></Panel>
      )}
    </>
  );
}
