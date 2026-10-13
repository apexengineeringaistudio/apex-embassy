import { describe, expect, it } from "vitest";
import { seedAccounts, seedActivities, seedLeads, seedProjects } from "@/data/seed";
import { TODAY } from "@/lib/constants";
import { fmtDate, relDay } from "@/lib/format";

describe("13 Oct operational snapshot", () => {
  it("shows 14 Oct as tomorrow and unknown contact dates honestly", () => {
    expect(TODAY).toBe("2026-10-13");
    expect(relDay("2026-10-14")).toBe("Tomorrow");
    expect(fmtDate("")).toBe("TBD");
  });
  it("keeps Mansi warm with no invented value and a two-week follow-up", () => {
    const lead = seedLeads.find((l) => l.accountId === "a14");
    expect(lead).toMatchObject({ stage: "Nurture", value: 0, due: "2026-10-27" });
    expect(seedAccounts.find((a) => a.id === "a14")?.notes).toContain("Autonoma");
  });
  it("moves MaaOm to presentation-only Teams and Rohan to evening discovery", () => {
    expect(seedActivities.find((a) => a.id === "ac1")).toMatchObject({ due: "2026-10-14" });
    expect(seedActivities.find((a) => a.id === "ac1")?.subject).toContain("11:00 AM, presentation only");
    expect(seedActivities.find((a) => a.id === "ac6")?.subject).toContain("11:00 AM reminder");
    expect(seedActivities.find((a) => a.id === "ac14")?.subject).toContain("exact time pending");
    expect(seedAccounts.find((a) => a.id === "a4")?.notes).toContain("exact date/time pending");
  });
  it("preserves Nikhil's historical win without claiming kickoff", () => {
    expect(seedLeads.find((l) => l.id === "l2")).toMatchObject({ stage: "Won", value: 22500, due: "2026-10-14" });
    expect(seedProjects.find((p) => p.id === "p6")?.status).toBe("Proposed");
    expect(seedAccounts.find((a) => a.id === "a6")?.nextAction).toContain("No start confirmed");
  });
});