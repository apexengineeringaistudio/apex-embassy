import type { Account, ServiceKey } from "./types";
import { SERVICE_COLUMNS } from "./constants";

/** Next-best-service hypotheses. These are NOT facts — always present as "to validate". */
export function nextBestServices(a: Account) {
  const reasons: Partial<Record<ServiceKey, string>> = {
    website: "No confirmed website delivery on record",
    ecommerce: "Product-led business — online store may fit",
    gbp: "Local presence not verified",
    seo: "Search visibility not reviewed",
    ga4: "Analytics tracking not confirmed",
    gsc: "Search Console ownership not confirmed",
    social: "Social presence not reviewed",
    ads: "Paid acquisition not discussed",
    amc: "Delivered site with no care plan on record",
    ai: "Manual reporting / workflow mentioned",
  };
  return SERVICE_COLUMNS.filter((c) => a.coverage[c.key] === "Opportunity" || a.coverage[c.key] === "Needs Review")
    .map((c) => ({ key: c.key, label: c.label, status: a.coverage[c.key], reason: reasons[c.key] ?? "" }));
}
