import type { Account, Activity, Campaign, Contact, CoverageStatus, Lead, LeadCampaign, Project, ServiceKey } from "@/lib/types";

// Internal demo records only. No private emails or phone numbers.
const cov = (o: Partial<Record<ServiceKey, CoverageStatus>>): Record<ServiceKey, CoverageStatus> => ({
  website: "Unknown", ecommerce: "Unknown", gbp: "Unknown", seo: "Unknown", ga4: "Unknown",
  gsc: "Unknown", social: "Unknown", ads: "Unknown", amc: "Unknown", ai: "Unknown", ...o,
});

export const seedContacts: Contact[] = [
  { id: "c1", name: "Vikrant Patkar", role: "Referral partner", isReferralPartner: true, tags: ["Partner", "Aviation network"] },
  { id: "c2", name: "Sunita Rebello", role: "Referral partner", isReferralPartner: true, tags: ["Partner", "Leadership network"] },
  { id: "c3", name: "Vivek Kapse", role: "Referral partner", isReferralPartner: true, tags: ["Partner", "Pharma network"] },
  { id: "c4", name: "Sampada Inamdar", role: "Contact", accountId: "a2", isReferralPartner: false, tags: ["Contact"] },
  { id: "c5", name: "Girish Lakhotiya", role: "Owner", accountId: "a8", isReferralPartner: false, tags: ["Decision maker"] },
  { id: "c6", name: "Sunil Deshpande", role: "Owner", accountId: "a9", isReferralPartner: false, tags: ["Decision maker"] },
  { id: "c7", name: "Nikhil Bhat", role: "Founder", accountId: "a6", isReferralPartner: false, tags: ["Founder"] },
];

export const seedAccounts: Account[] = [
  { id: "a1", name: "Flight Path Aviation Consulting", kind: "Company", industry: "Aviation consulting", city: "Pune", relationship: "Client", sourcePartnerId: "c1", source: "Referral", stage: "Active", priority: "High",
    servicesDelivered: ["Website", "Content", "SEO"], servicesEvaluating: ["GA4 / Search Console"], estValue: 180000, recurringPotential: 15000, lastContact: "2026-10-03", nextAction: "Monthly SEO review call", owner: "Amar",
    notes: "Website, content and SEO-related work delivered. Reporting setup not yet verified.",
    coverage: cov({ website: "Delivered", seo: "Active", ecommerce: "Not Relevant", gbp: "Needs Review", ga4: "Needs Review", gsc: "Needs Review", social: "Opportunity", ads: "Unknown", amc: "Opportunity", ai: "Unknown" }) },
  { id: "a2", name: "Trikaya Leadership", kind: "Company", industry: "Leadership training", city: "Mumbai", relationship: "Client", primaryContactId: "c4", sourcePartnerId: "c2", source: "Referral", stage: "Active", priority: "High",
    servicesDelivered: ["Website", "Content", "Presentation"], servicesEvaluating: ["Social Media Marketing"], estValue: 140000, recurringPotential: 12000, lastContact: "2026-10-07", nextAction: "Share social content samples", owner: "Amar",
    notes: "Website, content and presentation work. Interested in thought-leadership content.",
    coverage: cov({ website: "Delivered", ecommerce: "Not Relevant", social: "Needs Review", seo: "Opportunity", gbp: "Unknown", amc: "Needs Review" }) },
  { id: "a3", name: "GreenThoughts Horti and Agro", kind: "Company", industry: "Horticulture & agro", city: "Nashik", relationship: "Client", source: "Direct", stage: "Delivered", priority: "Medium",
    servicesDelivered: ["Website"], servicesEvaluating: [], estValue: 60000, recurringPotential: 5000, lastContact: "2026-08-22", nextAction: "Check-in on site performance", owner: "Team Apex",
    notes: "Website delivered. Local presence not yet reviewed.",
    coverage: cov({ website: "Delivered", gbp: "Needs Review", seo: "Unknown", amc: "Opportunity", ecommerce: "Unknown" }) },
  { id: "a4", name: "MaaOm Logistics", kind: "Company", industry: "Logistics", city: "Pune", relationship: "Prospect", sourcePartnerId: "c1", source: "Referral", stage: "Discovery", priority: "High",
    servicesDelivered: [], servicesEvaluating: ["Technical audit"], estValue: 90000, recurringPotential: 8000, lastContact: "2026-10-01", nextAction: "Send technical audit findings", owner: "Amar",
    notes: "Service engagement — technical audit with follow-up.",
    coverage: cov({ website: "Needs Review", seo: "Needs Review", ecommerce: "Not Relevant" }) },
  { id: "a5", name: "Huvepharma", kind: "Company", industry: "Animal health / pharma", city: "Pune", relationship: "Prospect", sourcePartnerId: "c3", source: "Referral", stage: "Proposal", priority: "High",
    servicesDelivered: [], servicesEvaluating: ["Social Media Marketing", "Digital communication"], estValue: 240000, recurringPotential: 25000, lastContact: "2026-10-06", nextAction: "Follow up on social/digital proposal", owner: "Amar",
    notes: "Social / digital communication proposal submitted.",
    coverage: cov({ social: "Opportunity", ecommerce: "Not Relevant" }) },
  { id: "a6", name: "Nikhil Bhat Chocolate Brand", kind: "Company", industry: "Food / D2C", city: "Bengaluru", relationship: "Prospect", primaryContactId: "c7", source: "Direct", stage: "Discovery", priority: "Medium",
    servicesDelivered: [], servicesEvaluating: ["Ecommerce"], estValue: 120000, recurringPotential: 10000, lastContact: "2026-09-28", nextAction: "Ecommerce scope call", owner: "Amar",
    notes: "Ecommerce store discussion.",
    coverage: cov({ ecommerce: "Opportunity", social: "Needs Review" }) },
  { id: "a7", name: "Lalita Flour Mill", kind: "Company", industry: "Food manufacturing", city: "Satara", relationship: "Prospect", sourcePartnerId: "c2", source: "Referral", stage: "Prospecting", priority: "Medium",
    servicesDelivered: [], servicesEvaluating: ["Ecommerce", "Google Business Profile"], estValue: 75000, recurringPotential: 6000, lastContact: "2026-09-18", nextAction: "Visit / local presence review", owner: "Team Apex",
    notes: "Ecommerce and local digital presence.",
    coverage: cov({ ecommerce: "Opportunity", gbp: "Needs Review" }) },
  { id: "a8", name: "Girish Lakhotiya", kind: "Person", industry: "Professional services", city: "Pune", relationship: "Prospect", primaryContactId: "c5", source: "Direct", stage: "Proposal", priority: "High",
    servicesDelivered: [], servicesEvaluating: ["Websites"], estValue: 55000, recurringPotential: 3000, lastContact: "2026-10-02", nextAction: "Follow up on website proposal", owner: "Amar",
    notes: "Website proposal shared.",
    coverage: cov({ website: "Opportunity" }) },
  { id: "a9", name: "Sunil Deshpande", kind: "Person", industry: "Business owner", city: "Pune", relationship: "Prospect", primaryContactId: "c6", source: "Direct", stage: "Discovery", priority: "Medium",
    servicesDelivered: [], servicesEvaluating: ["AI & Automation"], estValue: 85000, recurringPotential: 7000, lastContact: "2026-09-30", nextAction: "Map reporting workflow", owner: "Amar",
    notes: "Reporting / automation requirement.",
    coverage: cov({ ai: "Opportunity", ga4: "Unknown" }) },
];

export const seedLeads: Lead[] = [
  { id: "l1", title: "GA4 + Search Console setup", accountId: "a1", stage: "Qualified", value: 25000, source: "Existing client", owner: "Amar", nextAction: "Confirm access", due: "2026-10-14" },
  { id: "l2", title: "Social content retainer", accountId: "a2", stage: "Discovery", value: 72000, source: "Existing client", owner: "Amar", nextAction: "Share samples", due: "2026-10-11" },
  { id: "l3", title: "Technical audit & fixes", accountId: "a4", stage: "Contacted", value: 90000, source: "Referral", partnerId: "c1", owner: "Amar", nextAction: "Send findings", due: "2026-10-09" },
  { id: "l4", title: "Social / digital communication", accountId: "a5", stage: "Proposal", value: 240000, source: "Referral", partnerId: "c3", owner: "Amar", nextAction: "Proposal follow-up", due: "2026-10-10" },
  { id: "l5", title: "Chocolate D2C store", accountId: "a6", stage: "Discovery", value: 120000, source: "Direct", owner: "Amar", nextAction: "Scope call", due: "2026-10-13" },
  { id: "l6", title: "Ecommerce + local presence", accountId: "a7", stage: "New", value: 75000, source: "Referral", partnerId: "c2", owner: "Team Apex", nextAction: "Initial visit", due: "2026-10-16" },
  { id: "l7", title: "Personal website", accountId: "a8", stage: "Negotiation", value: 55000, source: "Direct", owner: "Amar", nextAction: "Follow up on proposal", due: "2026-10-11" },
  { id: "l8", title: "Reporting automation", accountId: "a9", stage: "Qualified", value: 85000, source: "Direct", owner: "Amar", nextAction: "Workflow mapping", due: "2026-10-12" },
  { id: "l9", title: "Website care AMC", accountId: "a3", stage: "Nurture", value: 30000, source: "Existing client", owner: "Team Apex", nextAction: "Check-in", due: "2026-10-20" },
  { id: "l10", title: "Flight Path website & SEO", accountId: "a1", stage: "Won", value: 180000, source: "Referral", partnerId: "c1", owner: "Amar", nextAction: "—", due: "2026-06-01" },
  { id: "l11", title: "Trikaya website & content", accountId: "a2", stage: "Won", value: 140000, source: "Referral", partnerId: "c2", owner: "Amar", nextAction: "—", due: "2026-05-10" },
];

export const seedActivities: Activity[] = [
  { id: "ac1", type: "call", subject: "Follow up on website proposal", accountId: "a8", due: "2026-10-11", completed: false, owner: "Amar" },
  { id: "ac2", type: "email", subject: "Proposal follow-up — social/digital", accountId: "a5", due: "2026-10-10", completed: false, owner: "Amar" },
  { id: "ac3", type: "proposal", subject: "Send technical audit findings", accountId: "a4", due: "2026-10-09", completed: false, owner: "Amar" },
  { id: "ac4", type: "meeting", subject: "Monthly SEO review", accountId: "a1", due: "2026-10-13", completed: false, owner: "Amar" },
  { id: "ac5", type: "whatsapp", subject: "Share social content samples", accountId: "a2", due: "2026-10-11", completed: false, owner: "Amar" },
  { id: "ac6", type: "meeting", subject: "Ecommerce scope call", accountId: "a6", due: "2026-10-14", completed: false, owner: "Amar" },
  { id: "ac7", type: "task", subject: "Prepare reporting workflow map", accountId: "a9", due: "2026-10-12", completed: false, owner: "Amar" },
  { id: "ac8", type: "task", subject: "Verify GA4 access for Flight Path", accountId: "a1", due: "2026-10-15", completed: false, owner: "Team Apex" },
  { id: "ac9", type: "note", subject: "Lalita — interested in local listing", accountId: "a7", due: "2026-09-18", completed: true, owner: "Team Apex" },
  { id: "ac10", type: "call", subject: "Check-in on site performance", accountId: "a3", due: "2026-10-08", completed: false, owner: "Team Apex" },
  { id: "ac11", type: "meeting", subject: "Discovery — reporting needs", accountId: "a9", due: "2026-09-30", completed: true, owner: "Amar" },
  { id: "ac12", type: "email", subject: "Sent website proposal", accountId: "a8", due: "2026-10-02", completed: true, owner: "Amar" },
  { id: "ac13", type: "campaign", subject: "Re-engagement wave planning", due: "2026-10-16", completed: false, owner: "Amar" },
  { id: "ac14", type: "meeting", subject: "Content review with Trikaya", accountId: "a2", due: "2026-10-07", completed: true, owner: "Amar" },
];

export const seedCampaigns: Campaign[] = [
  { id: "cp1", name: "Chocolate brand launch", channel: "Launch/Publicity", goal: "Pre-launch awareness", audience: "Gift buyers, Bengaluru", accountId: "a6", status: "Draft", tasks: [{ label: "Brand story", done: false }, { label: "Launch calendar", done: false }] },
  { id: "cp2", name: "Flight Path local SEO push", channel: "SEO", goal: "Rank for consulting queries", audience: "Aviation startups", accountId: "a1", status: "Planned", tasks: [{ label: "Keyword map", done: true }, { label: "Content briefs", done: false }], keywords: ["aviation consulting india", "dgca consultant"] },
  { id: "cp3", name: "Past client re-engagement", channel: "Re-engagement", goal: "Reopen 3 conversations", audience: "Delivered / dormant clients", status: "Draft", tasks: [{ label: "List accounts", done: true }, { label: "Draft message", done: false }] },
  { id: "cp4", name: "Apex — website leads (Pune)", channel: "Google Ads", goal: "Inbound website enquiries", audience: "SMB owners, Pune", budget: 15000, status: "Draft", objective: "Leads", landingPage: "apex/websites", keywords: ["website design pune", "ecommerce website"], tasks: [{ label: "Landing page", done: false }] },
  { id: "cp5", name: "Trikaya thought leadership", channel: "Social", goal: "Consistent LinkedIn presence", audience: "HR & L&D heads", accountId: "a2", status: "Planned", tasks: [{ label: "Content pillars", done: true }] },
  { id: "cp6", name: "Local food brands outreach", channel: "Lead Generation", goal: "20 qualified leads", audience: "Food manufacturers, Maharashtra", status: "Draft", tasks: [] },
  { id: "cp7", name: "Ecommerce retargeting", channel: "Meta Ads", goal: "Store visits", audience: "Site visitors", accountId: "a6", budget: 10000, status: "Draft", objective: "Traffic", landingPage: "TBD", tasks: [] },
];

export const seedLeadCampaigns: LeadCampaign[] = [
  { id: "lc1", name: "Pune SMB websites", goal: "Business Leads", sources: ["Referrals", "Local directories (planned)"], leadCount: 14, qualified: 4, status: "Running", nextAction: "Qualify 5 new entries" },
  { id: "lc2", name: "Food & agro ecommerce", goal: "Product-specific Leads", sources: ["Partner intros", "Trade lists (placeholder)"], leadCount: 8, qualified: 2, status: "Reviewing", nextAction: "Verify evidence" },
  { id: "lc3", name: "Content writers pool", goal: "Talent Scout", sources: ["Placeholder"], leadCount: 0, qualified: 0, status: "Draft", nextAction: "Define criteria" },
];

export const seedProjects: Project[] = [
  { id: "p1", accountId: "a1", name: "Website & content", status: "Delivered", deliverables: ["Site build", "Service pages", "Blog content"] },
  { id: "p2", accountId: "a1", name: "SEO programme", status: "In Progress", deliverables: ["On-page SEO", "Monthly content"] },
  { id: "p3", accountId: "a2", name: "Website & presentations", status: "Delivered", deliverables: ["Website", "Content", "Presentation deck"] },
  { id: "p4", accountId: "a3", name: "Website", status: "Delivered", deliverables: ["Website build"] },
  { id: "p5", accountId: "a4", name: "Technical audit", status: "In Progress", deliverables: ["Audit report", "Fix list"] },
  { id: "p6", accountId: "a5", name: "Social/digital proposal", status: "Proposed", deliverables: ["Proposal"] },
  { id: "p7", accountId: "a8", name: "Website proposal", status: "Proposed", deliverables: ["Proposal"] },
];
