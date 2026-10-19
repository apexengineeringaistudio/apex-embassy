/** Project tracker rules: URL validation and transparent progress. */

/** Accepts empty (optional) or an absolute http(s) URL. */
export function isValidUrl(v: string | undefined): boolean {
  if (!v || !v.trim()) return true;
  try {
    const u = new URL(v.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Manual progress clamped to 0–100; blank stays unassessed (undefined). */
export function parseProgress(v: string): number | undefined {
  if (!v.trim()) return undefined;
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return undefined;
  return Math.min(100, Math.max(0, n));
}

/** Milestone completion ratio for display only — never replaces manual progress. */
export function milestoneSummary(m: { done: boolean }[] = []): string {
  if (!m.length) return "No milestones";
  return `${m.filter((x) => x.done).length}/${m.length} milestones done`;
}
