// Domain types for Apex Growth OS. Mirror these as tables when moving to Supabase.
export type Relationship = "Client" | "Prospect" | "Past Client" | "Partner";
export type AccountStage = "Prospecting" | "Discovery" | "Proposal" | "Negotiation" | "Active" | "Delivered" | "Dormant";
export type Priority = "High" | "Medium" | "Low";
export type LeadStage = "New" | "Qualified" | "Contacted" | "Discovery" | "Proposal" | "Negotiation" | "Won" | "Lost" | "Nurture";
export type ActivityType = "call" | "email" | "meeting" | "whatsapp" | "proposal" | "task" | "note" | "campaign";
export type CoverageStatus = "Active" | "Delivered" | "Needs Review" | "Opportunity" | "Not Relevant" | "Unknown";
export type ServiceKey = "website" | "ecommerce" | "gbp" | "seo" | "ga4" | "gsc" | "social" | "ads" | "amc" | "ai";

export interface AccountFile {
  title: string;
  kind: "Proposal" | "Presentation" | "Invoice" | "Audit" | "Document" | "Template" | "Sample";
  url: string;
  date?: string;
}

export interface Account {
  id: string;
  name: string;
  kind: "Company" | "Person";
  industry: string;
  city: string;
  relationship: Relationship;
  primaryContactId?: string;
  sourcePartnerId?: string;
  source: string;
  stage: AccountStage;
  priority: Priority;
  servicesDelivered: string[];
  servicesEvaluating: string[];
  estValue: number;
  recurringPotential: number;
  lastContact: string;
  nextAction: string;
  owner: string;
  notes: string;
  coverage: Record<ServiceKey, CoverageStatus>;
  folderUrl?: string;
  files?: AccountFile[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  accountId?: string | undefined;
  isReferralPartner: boolean;
  tags: string[];
}

export interface Lead {
  id: string;
  title: string;
  accountId: string;
  stage: LeadStage;
  value: number;
  source: string;
  partnerId?: string;
  owner: string;
  nextAction: string;
  due: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  accountId?: string | undefined;
  due: string;
  completed: boolean;
  owner: string;
  /** Operational priority order (lower = more urgent). */
  rank?: number;
  /** Operational bucket for Command Center Today/Next. */
  category?: "payment" | "waiting" | "outreach" | "blocker";
}

export type CampaignChannel = "Google Ads" | "SEO" | "Social" | "Launch/Publicity" | "Re-engagement" | "Lead Generation" | "Meta Ads";
export type CampaignStatus = "Draft" | "Planned" | "Active" | "Paused" | "Completed";

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  goal: string;
  audience: string;
  accountId?: string | undefined;
  budget?: number | undefined;
  status: CampaignStatus;
  tasks: { label: string; done: boolean }[];
  objective?: string;
  landingPage?: string;
  keywords?: string[];
}

export interface LeadCampaign {
  id: string;
  name: string;
  goal: "Business Leads" | "Talent Scout" | "Product-specific Leads";
  sources: string[];
  leadCount: number;
  qualified: number;
  status: "Draft" | "Running" | "Reviewing" | "Closed";
  nextAction: string;
}

export interface Project {
  id: string;
  accountId: string;
  name: string;
  status: "In Progress" | "Delivered" | "On Hold" | "Proposed";
  deliverables: string[];
  /** Delivery tracker fields — all optional; never fabricated. */
  priority?: Priority;
  /** Manually entered progress 0–100; undefined = not assessed. */
  progress?: number;
  nextAction?: string;
  devUrl?: string;
  liveUrl?: string;
  notes?: string;
  milestones?: { id: string; label: string; done: boolean }[];
  updatedAt?: string;
}
