import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { repo, useDB } from "@/data/repository";
import { LEAD_STAGES, SERVICE_COLUMNS, TODAY } from "@/lib/constants";
import type { ActivityType, CampaignChannel, CoverageStatus, LeadStage, Relationship, ServiceKey } from "@/lib/types";

export type CreateKind = "lead" | "account" | "activity" | "campaign";
const Ctx = createContext<(k: CreateKind) => void>(() => {});
export const useQuickCreate = () => useContext(Ctx);

const sel = "h-9 w-full rounded-md border bg-card px-2 text-sm";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-1"><Label className="text-xs">{label}</Label>{children}</div>;
}

export function QuickCreateProvider({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<CreateKind | null>(null);
  const db = useDB();
  const close = () => setKind(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<"name" | "industry" | "relationship" | "value" | "next" | "notes" | "account" | "stage" | "source" | "due" | "type" | "channel" | "goal" | "audience", string>;
    if (!f.name?.trim()) { toast.error("Name is required"); return; }
    if (kind === "account") {
      repo.addAccount({
        name: f.name, kind: "Company", industry: f.industry || "—", city: "—", relationship: f.relationship as Relationship,
        source: "Direct", stage: "Prospecting", priority: "Medium", servicesDelivered: [], servicesEvaluating: [],
        estValue: Number(f.value) || 0, recurringPotential: 0, lastContact: TODAY, nextAction: f.next || "Intro call", owner: "Amar", notes: f.notes || "",
        coverage: Object.fromEntries(SERVICE_COLUMNS.map((c) => [c.key, "Unknown"])) as Record<ServiceKey, CoverageStatus>,
      });
    } else if (kind === "lead") {
      repo.addLead({ title: f.name, accountId: f.account, stage: f.stage as LeadStage, value: Number(f.value) || 0, source: f.source || "Direct", owner: "Amar", nextAction: f.next || "Qualify", due: f.due || TODAY });
    } else if (kind === "activity") {
      repo.addActivity({ subject: f.name, type: f.type as ActivityType, accountId: f.account || undefined, due: f.due || TODAY, completed: false, owner: "Amar" });
    } else if (kind === "campaign") {
      repo.addCampaign({ name: f.name, channel: f.channel as CampaignChannel, goal: f.goal || "—", audience: f.audience || "—", accountId: f.account || undefined, budget: Number(f.value) || undefined, status: "Draft", tasks: [] });
    }
    toast.success(`${kind ?? ""} saved`.replace(/^./, (c) => c.toUpperCase()), { description: "Saved to demo data (mock store, not persisted)." });
    close();
  };

  const accountSelect = (required = false) => (
    <Field label="Account">
      <select name="account" className={sel} required={required} defaultValue="">
        <option value="">{required ? "Select account…" : "None"}</option>
        {db.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
    </Field>
  );

  const titles: Record<CreateKind, string> = { lead: "New lead", account: "New account", activity: "Log activity", campaign: "New campaign draft" };

  return (
    <Ctx.Provider value={setKind}>
      {children}
      <Dialog open={!!kind} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-lg">
          {kind && (
            <form onSubmit={submit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{titles[kind]}</DialogTitle>
                <DialogDescription>Demo mode — saves to in-memory mock data only.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label={kind === "activity" ? "Subject" : kind === "lead" ? "Opportunity title" : "Name"}><Input name="name" autoFocus /></Field>
                </div>
                {kind === "account" && <>
                  <Field label="Relationship"><select name="relationship" className={sel}>{["Prospect", "Client", "Past Client", "Partner"].map((o) => <option key={o}>{o}</option>)}</select></Field>
                  <Field label="Industry"><Input name="industry" /></Field>
                  <Field label="Estimated value (₹)"><Input name="value" type="number" /></Field>
                  <Field label="Next action"><Input name="next" /></Field>
                  <div className="sm:col-span-2"><Field label="Notes"><Textarea name="notes" rows={2} /></Field></div>
                </>}
                {kind === "lead" && <>
                  {accountSelect(true)}
                  <Field label="Stage"><select name="stage" className={sel}>{LEAD_STAGES.map((o) => <option key={o}>{o}</option>)}</select></Field>
                  <Field label="Value (₹)"><Input name="value" type="number" /></Field>
                  <Field label="Source"><Input name="source" placeholder="Referral, Direct…" /></Field>
                  <Field label="Next action"><Input name="next" /></Field>
                  <Field label="Due"><Input name="due" type="date" defaultValue={TODAY} /></Field>
                </>}
                {kind === "activity" && <>
                  <Field label="Type"><select name="type" className={sel}>{["call", "email", "meeting", "whatsapp", "proposal", "task", "note", "campaign"].map((o) => <option key={o}>{o}</option>)}</select></Field>
                  <Field label="Due"><Input name="due" type="date" defaultValue={TODAY} /></Field>
                  <div className="sm:col-span-2">{accountSelect()}</div>
                </>}
                {kind === "campaign" && <>
                  <Field label="Channel"><select name="channel" className={sel}>{["Google Ads", "Meta Ads", "SEO", "Social", "Launch/Publicity", "Re-engagement", "Lead Generation"].map((o) => <option key={o}>{o}</option>)}</select></Field>
                  <Field label="Budget placeholder (₹)"><Input name="value" type="number" /></Field>
                  <Field label="Goal"><Input name="goal" /></Field>
                  <Field label="Audience"><Input name="audience" /></Field>
                  <div className="sm:col-span-2">{accountSelect()}</div>
                </>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={close}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}
