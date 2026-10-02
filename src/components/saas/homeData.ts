// Data for the three Home panels. Running and GitHub are sample data
// for now: swap getRunDays and getCommitDays for real fetches (a
// build-time pull or a small API route) and the panels draw whatever
// they return. Both return the last `n` days, oldest first.

export const RANGES = [7, 30, 60] as const;
export type Range = (typeof RANGES)[number];

// A small seeded generator, so the sample series is identical on the
// server and the client and on every load.
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RUN_HISTORY = 60;
// Twenty-six full weeks, the shape GitHub's contribution graph draws.
export const COMMIT_WEEKS = 26;
const COMMIT_HISTORY = COMMIT_WEEKS * 7;

const RUN_SERIES: number[] = (() => {
  const rand = seeded(11);
  const distances = [3.1, 4, 5, 5, 6.2, 6.2, 8, 9.3];
  return Array.from({ length: RUN_HISTORY }, () => (rand() < 0.62 ? distances[Math.floor(rand() * distances.length)] : 0));
})();

const COMMIT_SERIES: number[] = (() => {
  const rand = seeded(2026);
  return Array.from({ length: COMMIT_HISTORY }, (_, i) => {
    // Busy and quiet stretches, so it reads like real work.
    const surge = 0.5 + 0.5 * Math.sin(i / 4.1) ** 2;
    return rand() < 0.78 * surge + 0.1 ? Math.round(1 + rand() * rand() * 12) : 0;
  });
})();

export function getRunDays(n: number): number[] {
  return RUN_SERIES.slice(RUN_HISTORY - n);
}

// All 26 weeks of commits, oldest first (the last entry is today).
export function getCommitHistory(): number[] {
  return COMMIT_SERIES;
}

// 0 (none) to 4 (heaviest), the usual contribution-graph shading.
export function commitLevel(count: number) {
  return count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 8 ? 3 : 4;
}

// "Today", "Yesterday", "5 days ago" for the day at `index` of `n`.
export function daysAgo(index: number, n: number) {
  const ago = n - 1 - index;
  return ago === 0 ? "Today" : ago === 1 ? "Yesterday" : `${ago} days ago`;
}
