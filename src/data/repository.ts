import { useSyncExternalStore } from "react";
import type { Account, Activity, Campaign, Contact, Lead, LeadCampaign, LeadStage, Project } from "@/lib/types";
import { seedAccounts, seedActivities, seedCampaigns, seedContacts, seedLeadCampaigns, seedLeads, seedProjects } from "./seed";

/**
 * Repository abstraction. Today: in-memory mock store.
 * Later: replace method bodies with external Supabase calls; UI uses only `repo` + `useDB`.
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

const seed: DB = {
  accounts: seedAccounts, contacts: seedContacts, leads: seedLeads, activities: seedActivities,
  campaigns: seedCampaigns, leadCampaigns: seedLeadCampaigns, projects: seedProjects,
};

let db: DB = seed;
const listeners = new Set<() => void>();
const set = (patch: Partial<DB>) => { db = { ...db, ...patch }; listeners.forEach((l) => l()); };
const uid = (p: string) => `${p}${Math.random().toString(36).slice(2, 8)}`;

export const repo = {
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  snapshot: () => db,
  serverSnapshot: () => seed,
  addAccount: (a: Omit<Account, "id">) => { const r = { ...a, id: uid("a") }; set({ accounts: [r, ...db.accounts] }); return r; },
  addLead: (l: Omit<Lead, "id">) => { const r = { ...l, id: uid("l") }; set({ leads: [r, ...db.leads] }); return r; },
  moveLead: (id: string, stage: LeadStage) => set({ leads: db.leads.map((l) => (l.id === id ? { ...l, stage } : l)) }),
  addActivity: (a: Omit<Activity, "id">) => { const r = { ...a, id: uid("ac") }; set({ activities: [r, ...db.activities] }); return r; },
  toggleActivity: (id: string) => set({ activities: db.activities.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)) }),
  addCampaign: (c: Omit<Campaign, "id">) => { const r = { ...c, id: uid("cp") }; set({ campaigns: [r, ...db.campaigns] }); return r; },
  addLeadCampaign: (c: Omit<LeadCampaign, "id">) => { const r = { ...c, id: uid("lc") }; set({ leadCampaigns: [r, ...db.leadCampaigns] }); return r; },
};

export function useDB(): DB {
  return useSyncExternalStore(repo.subscribe, repo.snapshot, repo.serverSnapshot);
}

export const byId = <T extends { id: string }>(list: T[], id?: string) => list.find((x) => x.id === id);
