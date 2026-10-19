import { describe, expect, it } from "vitest";
import { isValidUrl, parseProgress, milestoneSummary } from "@/lib/projects";

describe("project tracker rules", () => {
  it("allows only http(s) URLs or blank", () => {
    expect(isValidUrl("")).toBe(true);
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("example.com")).toBe(false);
  });
  it("keeps blank progress unassessed and clamps to 0-100", () => {
    expect(parseProgress("")).toBeUndefined();
    expect(parseProgress("150")).toBe(100);
    expect(parseProgress("-5")).toBe(0);
  });
  it("summarises milestones", () => {
    expect(milestoneSummary([{ done: true }, { done: false }])).toBe("1/2 milestones done");
  });
});
