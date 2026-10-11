import { Link } from "@tanstack/react-router";
import { Phone, Mail, Users, MessageCircle, FileText, ListTodo, StickyNote, Megaphone } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { byId, repo, useDB } from "@/data/repository";
import { fmtDate, relDay, daysFromToday } from "@/lib/format";
import type { Activity, ActivityType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "./bits";

export const activityIcon: Record<ActivityType, typeof Phone> = {
  call: Phone, email: Mail, meeting: Users, whatsapp: MessageCircle, proposal: FileText, task: ListTodo, note: StickyNote, campaign: Megaphone,
};

export function ActivityList({ items, compact, emptyTitle = "Nothing here" }: { items: Activity[]; compact?: boolean; emptyTitle?: string }) {
  const db = useDB();
  if (!items.length) return <EmptyState title={emptyTitle} hint="Log an activity from the Create menu." />;
  return (
    <ul className="divide-y">
      {items.map((a) => {
        const Icon = activityIcon[a.type];
        const acc = byId(db.accounts, a.accountId);
        const overdue = !a.completed && daysFromToday(a.due) < 0;
        return (
          <li key={a.id} className={cn("flex items-center gap-2.5", compact ? "py-1.5" : "py-2")}>
            <Checkbox checked={a.completed} aria-label="Mark complete"
              onCheckedChange={() => { repo.toggleActivity(a.id); toast.success(a.completed ? "Reopened" : "Marked complete"); }} />
            <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted"><Icon className="size-3.5 text-muted-foreground" /></span>
            <div className="min-w-0 flex-1">
              <div className={cn("truncate text-[13px]", a.completed && "text-muted-foreground line-through")}>{a.subject}</div>
              {acc && <Link to="/accounts/$id" params={{ id: acc.id }} className="truncate text-[11px] text-muted-foreground hover:text-primary">{acc.name}</Link>}
            </div>
            <span className={cn("num shrink-0 text-[11px]", overdue ? "font-semibold text-destructive" : "text-muted-foreground")}>
              {a.completed ? fmtDate(a.due) : relDay(a.due)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
