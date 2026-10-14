import type { CoverageStatus, LeadStage, ServiceKey } from "./types";

/** Fixed operational snapshot date (avoids SSR/client mismatch until backend sync). */
export const TODAY = "2026-10-14";

export const LEAD_STAGES: LeadStage[] = ["New", "Qualified", "Contacted", "Discovery", "Proposal", "Negotiation", "Won", "Lost", "Nurture"];

export const SERVICE_COLUMNS: { key: ServiceKey; label: string; short: string }[] = [
  { key: "website", label: "Website", short: "Web" },
  { key: "ecommerce", label: "Ecommerce", short: "Ecom" },
  { key: "gbp", label: "Google Business Profile", short: "GBP" },
  { key: "seo", label: "SEO", short: "SEO" },
  { key: "ga4", label: "GA4", short: "GA4" },
  { key: "gsc", label: "Search Console", short: "GSC" },
  { key: "social", label: "Social", short: "Social" },
  { key: "ads", label: "Ads", short: "Ads" },
  { key: "amc", label: "AMC", short: "AMC" },
  { key: "ai", label: "AI/Automation", short: "AI" },
];

export const COVERAGE_STATUSES: CoverageStatus[] = ["Active", "Delivered", "Needs Review", "Opportunity", "Not Relevant", "Unknown"];

export const SERVICE_CATALOG = [
  { name: "Business Launch", desc: "Brand, domain, email, launch kit" },
  { name: "Websites", desc: "Corporate & portfolio sites" },
  { name: "Ecommerce", desc: "Online stores, catalog, payments" },
  { name: "Google Business Profile", desc: "Setup, optimisation, reviews" },
  { name: "SEO", desc: "On-page, content, local SEO" },
  { name: "GA4 / Search Console", desc: "Tracking, reporting setup" },
  { name: "Social Media Marketing", desc: "Content calendar & posting" },
  { name: "Google / Meta Ads", desc: "Paid campaigns & landing pages" },
  { name: "Lead Generation", desc: "Lead-finding & qualification" },
  { name: "AI & Automation", desc: "Workflows, reporting, assistants" },
  { name: "AMC / Website Care", desc: "Annual maintenance & updates" },
  { name: "Custom Packages", desc: "Tailored bundles" },
];

export const PACKAGES = [
  { name: "Basic", price: "₹ — /month", items: ["GBP upkeep", "8 social posts", "Monthly report"] },
  { name: "Growth", price: "₹ — /month", items: ["Basic +", "SEO essentials", "12 social posts", "Ads management (1 platform)"] },
  { name: "Pro", price: "₹ — /month", items: ["Growth +", "Content SEO", "Multi-platform ads", "AI automation add-on"] },
];

export const OWNERS = ["Amar", "Team Apex"];
