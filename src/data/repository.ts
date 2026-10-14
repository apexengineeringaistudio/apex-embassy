import { useSyncExternalStore } from "react";
import type { Account, Activity, Campaign, Contact, Lead, LeadCampaign, LeadStage, Project } from "@/lib/types";
import { seedAccounts, seedActivities, seedCampaigns, seedContacts, seedLeadCampaigns, seedLeads, seedProjects } from "./seed";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

/**
 * Repository abstraction. Source of truth: the Lovable Cloud database (owner-only RLS).
 * The bundled seed is only used (a) to show something before sign-in loads, and
 * (b) as the one-time import when the database is empty. UI uses only `repo` + `useDB`.
 */
export interface DB {
  accounts: Account[];
  contacts: Contact[];
  leads: Lead[];
  activities: Activity[];
  campaigns: Campaign[];
  leadCampaigns: LeadCampaign[];
  projects: Project[];
}

type Key = keyof DB;
const TABLES = {
  accounts: "accounts", contacts: "contacts", leads: "leads", activities: "activities",
  campaigns: "campaigns", leadCampaigns: "lead_campaigns", projects: "projects",
} as const satisfies Record<Key, string>;

export type RepoStatus =
  | { source: "snapshot"; detail?: string }
  | { source: "loading" }
  | { source: "database"; loadedAt: string; imported: boolean }
  | { source: "error"; detail: string };

const seed: DB = {
  accounts: seedAccounts, contacts: seedContacts, leads: seedLeads, activities: seedActivities,
  campaigns: seedCampaigns, leadCampaigns: seedLeadCampaigns, projects: seedProjects,
};

let db: DB = seed;
let status: RepoStatus = { source: "snapshot" };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<DB>) => { db = { ...db, ...patch }; emit(); };
const setStatus = (s: RepoStatus) => { status = s; emit(); };
const uid = (p: string) => `${p}${Math.random().toString(36).slice(2, 8)}`;

const toRows = (list: { id: string }[]) => list.map((r) => ({ id: r.id, data: JSON.parse(JSON.stringify(r)) as Json }));

async function persist<K extends Key>(key: K, rows: { id: string }[]) {
  if (status.source !== "database") return;
  const { error } = await supabase.from(TABLES[key]).upsert(toRows(rows));
  if (error) {
    const { toast } = await import("sonner");
    toast.error("Not saved to database", { description: error.message });
  }
}

let loading: Promise<void> | null = null;

export const repo = {
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  snapshot: () => db,
  serverSnapshot: () => seed,
  status: () => status,

  /** Load everything from the database; import the snapshot once if the database is empty. */
  load: () => {
    if (loading) return loading;
    setStatus({ source: "loading" });
    loading = (async () => {
      try {
        const keys = Object.keys(TABLES) as Key[];
        const results = await Promise.all(keys.map((k) => supabase.from(TABLES[k]).select("data")));
        const err = results.find((r) => r.error)?.error;
        if (err) throw err;
        let imported = false;
        if ((results[0].data ?? []).length === 0) {
          for (const k of keys) {
            const { error } = await supabase.from(TABLES[k]).upsert(toRows(seed[k]), { onConflict: "id", ignoreDuplicates: true });
            if (error) throw error;
          }
          imported = true;
          db = seed;
        } else {
          const next = {} as Record<Key, unknown[]>;
          keys.forEach((k, i) => { next[k] = (results[i].data ?? []).map((r) => r.data); });
          db = next as unknown as DB;
        }
        setStatus({ source: "database", loadedAt: new Date().toISOString(), imported });
      } catch (e) {
        db = seed;
        setStatus({ source: "error", detail: e instanceof Error ? e.message : String(e) });
      } finally {
        loading = null;
      }
    })();
    return loading;
  },
  reset: () => { db = seed; setStatus({ source: "snapshot" }); },

  addAccount: (a: Omit<Account, "id">) => { const r = { ...a, id: uid("a") }; set({ accounts: [r, ...db.accounts] }); void persist("accounts", [r]); return r; },
  addLead: (l: Omit<Lead, "id">) => { const r = { ...l, id: uid("l") }; set({ leads: [r, ...db.leads] }); void persist("leads", [r]); return r; },
  moveLead: (id: string, stage: LeadStage) => {
    set({ leads: db.leads.map((l) => (l.id === id ? { ...l, stage } : l)) });
    void persist("leads", db.leads.filter((l) => l.id === id));
  },
  addActivity: (a: Omit<Activity, "id">) => { const r = { ...a, id: uid("ac") }; set({ activities: [r, ...db.activities] }); void persist("activities", [r]); return r; },
  toggleActivity: (id: string) => {
    set({ activities: db.activities.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)) });
    void persist("activities", db.activities.filter((a) => a.id === id));
  },
  addCampaign: (c: Omit<Campaign, "id">) => { const r = { ...c, id: uid("cp") }; set({ campaigns: [r, ...db.campaigns] }); void persist("campaigns", [r]); return r; },
  addLeadCampaign: (c: Omit<LeadCampaign, "id">) => { const r = { ...c, id: uid("lc") }; set({ leadCampaigns: [r, ...db.leadCampaigns] }); void persist("leadCampaigns", [r]); return r; },
};

export function useDB(): DB {
  return useSyncExternalStore(repo.subscribe, repo.snapshot, repo.serverSnapshot);
}

const serverStatus: RepoStatus = { source: "snapshot" };
export function useRepoStatus(): RepoStatus {
  return useSyncExternalStore(repo.subscribe, repo.status, () => serverStatus);
}

export const byId = <T extends { id: string }>(list: T[], id?: string) => list.find((x) => x.id === id);
