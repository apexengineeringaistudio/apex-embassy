import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { repo, useDB } from "@/data/repository";
import { EmptyState, PageHeader, Pill } from "@/components/app/bits";
import { pageHead } from "@/lib/seo";
import type { LeadCampaign } from "@/lib/types";

export const Route = createFileRoute("/lead-campaigns")({
  head: pageHead("Lead Campaigns", "Lead-finding campaigns with sources and qualification."),
  component: LeadCampaigns,
});

function LeadCampaigns() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<"name" | "industry" | "relationship" | "value" | "next" | "notes" | "account" | "stage" | "source" | "due" | "type" | "channel" | "goal" | "audience", string>;
    if (!f.name) { toast.error("Name required"); return; }
    repo.addLeadCampaign({ name: f.name, goal: f.goal as LeadCampaign["goal"], sources: [f.source || "Placeholder"], leadCount: 0, qualified: 0, status: "Draft", nextAction: "Define criteria" });
    toast.success("Lead campaign created", { description: "Demo data only." });
    setOpen(false);
  };
  return (
    <>
      <PageHeader eyebrow="Acquisition" title="Lead Campaigns" subtitle="Find and qualify new business, talent or product-specific leads."
        actions={<Button size="sm" onClick={() => setOpen(true)}><Plus /> New lead campaign</Button>} />
      {db.leadCampaigns.length === 0 ? <EmptyState title="No lead campaigns" /> : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {db.leadCampaigns.map((c) => (
            <div key={c.id} className="panel p-3">
              <div className="flex items-start justify-between"><div><div className="text-[11px] font-medium text-primary">{c.goal}</div><div className="font-semibold">{c.name}</div></div><Pill>{c.status}</Pill></div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded bg-muted p-2"><div className="num text-lg font-semibold">{c.leadCount}</div><div className="text-[11px] text-muted-foreground">Leads found</div></div>
                <div className="rounded bg-muted p-2"><div className="num text-lg font-semibold">{c.qualified}</div><div className="text-[11px] text-muted-foreground">Qualified</div></div>
              </div>
              <Progress value={c.leadCount ? (c.qualified / c.leadCount) * 100 : 0} className="mt-2 h-1.5" />
              <div className="mt-2 text-[12px]"><span className="text-muted-foreground">Sources / evidence: </span>{c.sources.join(", ")}</div>
              <div className="mt-1 text-[12px]"><span className="text-muted-foreground">Next: </span>{c.nextAction}</div>
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => toast.info("Lead review queue arrives with the database", { description: "Demo mode." })}>Review leads</Button>
            </div>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={submit} className="space-y-3">
            <DialogHeader><DialogTitle>New lead campaign</DialogTitle><DialogDescription>Demo mode — saved to mock data only.</DialogDescription></DialogHeader>
            <div className="space-y-1"><Label className="text-xs">Name</Label><Input name="name" autoFocus /></div>
            <div className="space-y-1"><Label className="text-xs">Goal</Label>
              <select name="goal" className="h-9 w-full rounded-md border bg-card px-2 text-sm">{["Business Leads", "Talent Scout", "Product-specific Leads"].map((g) => <option key={g}>{g}</option>)}</select></div>
            <div className="space-y-1"><Label className="text-xs">Source / evidence</Label><Input name="source" placeholder="e.g. Partner intros" /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Create</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
