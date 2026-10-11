import type { DB } from "@/data/repository";
import { SERVICE_COLUMNS } from "@/lib/constants";
import { daysFromToday, money } from "@/lib/format";
import { nextBestServices } from "@/lib/insights";

/**
 * Copilot service contract. Today: local mock engine.
 * Later: replace `askCopilot` body with a call to the Apex backend AI endpoint
 * returning the same CopilotReply shape.
 */
export interface CopilotAction { label: string; external: boolean; detail?: string }
export interface CopilotCard {
  title: string;
  kind: "list" | "draft" | "plan";
  items?: { primary: string; secondary?: string; tag?: string; href?: string }[];
  body?: string;
  actions?: CopilotAction[];
}
export interface CopilotReply { text: string; cards: CopilotCard[] }

export const SUGGESTIONS = [
  "Who needs a follow-up today?",
  "Show clients who may need SEO.",
  "Prepare a re-engagement plan for past clients.",
  "What should I pitch Flight Path next?",
  "Draft a follow-up for Girish.",
];

export async function askCopilot(prompt: string, db: DB): Promise<CopilotReply> {
  await new Promise((r) => setTimeout(r, 450));
  const p = prompt.toLowerCase();
  const name = (id?: string) => db.accounts.find((a) => a.id === id)?.name ?? "Internal";

  if (p.includes("follow")  && !p.includes("draft")) {
    const due = db.activities.filter((a) => !a.completed && daysFromToday(a.due) <= 0);
    return { text: `${due.length} follow-ups are due today or overdue.`, cards: [{
      title: "Due today / overdue", kind: "list",
      items: due.map((a) => ({ primary: a.subject, secondary: name(a.accountId), tag: daysFromToday(a.due) < 0 ? "Overdue" : "Today" })),
      actions: [{ label: "Draft reminders (internal)", external: false }, { label: "Send WhatsApp reminders", external: true, detail: "Would message contacts on WhatsApp." }],
    }] };
  }
  if (p.includes("seo")) {
    const list = db.accounts.filter((a) => ["Opportunity", "Needs Review", "Unknown"].includes(a.coverage.seo) && a.relationship === "Client");
    return { text: "These clients have SEO coverage that is unverified. Treat as Needs Review, not confirmed need.", cards: [{
      title: "Clients — SEO Needs Review", kind: "list",
      items: list.map((a) => ({ primary: a.name, secondary: `SEO: ${a.coverage.seo}`, tag: "Needs Review" })),
      actions: [{ label: "Create review tasks", external: false }],
    }] };
  }
  if (p.includes("re-engage") || p.includes("past client")) {
    const list = db.accounts.filter((a) => a.relationship === "Past Client" || a.stage === "Delivered" || daysFromToday(a.lastContact) < -30);
    return { text: "Draft re-engagement plan based on delivered/quiet accounts.", cards: [
      { title: "Target accounts", kind: "list", items: list.map((a) => ({ primary: a.name, secondary: `Last contact ${a.lastContact}` })) },
      { title: "Plan (draft)", kind: "plan", body: "1. Personal check-in on delivered work\n2. Offer a free site health review\n3. Share one relevant case study\n4. Propose AMC / care plan where appropriate", actions: [{ label: "Create campaign draft", external: false }, { label: "Email all via Apex Gmail", external: true, detail: "Would send emails to each account." }] },
    ] };
  }
  if (p.includes("pitch") || p.includes("flight path")) {
    const a = db.accounts.find((x) => p.includes((x.name.split(" ")[0] ?? "").toLowerCase())) ?? db.accounts[0]!;
    const nbs = nextBestServices(a);
    return { text: `Possible next conversations for ${a.name}. These are hypotheses — validate before pitching.`, cards: [{
      title: `Next-best services — ${a.name}`, kind: "list",
      items: nbs.map((n) => ({ primary: n.label, secondary: n.reason, tag: "Needs Review" })),
      actions: [{ label: "Add opportunity", external: false }],
    }] };
  }
  if (p.includes("draft") || p.includes("girish")) {
    const a = db.accounts.find((x) => p.includes((x.name.split(" ")[0] ?? "").toLowerCase())) ?? db.accounts.find((x) => x.id === "a8")!;
    return { text: `Here's a draft follow-up for ${a.name}. Nothing will be sent.`, cards: [{
      title: "Email draft", kind: "draft",
      body: `Hi ${a.name.split(" ")[0]},\n\nHope you're doing well. Following up on the ${a.servicesEvaluating[0]?.toLowerCase() ?? "proposal"} we shared — happy to walk through any questions or adjust scope.\n\nWould a short call this week work?\n\nRegards,\nApex Engineering`,
      actions: [{ label: "Copy draft", external: false }, { label: "Send via Apex Gmail", external: true, detail: `Would email ${a.name}.` }],
    }] };
  }
  const pipeline = db.leads.filter((l) => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  return { text: `I can help with follow-ups, pitches, coverage gaps and drafts. Current open pipeline: ${money(pipeline)} across ${SERVICE_COLUMNS.length} tracked services.`, cards: [] };
}
