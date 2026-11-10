export const CATEGORIES = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const THRESHOLD = 0.95;

export function median(values: number[]): number {
  if (values.length === 0) throw new Error("median of an empty list");
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function pagePath(url: string): string {
  const path = new URL(url).pathname;
  return path === "/" ? "/" : path.replace(/\/$/, "") || "/";
}
