import type { StoredRoach } from "@/lib/card-progress";

const MAX_VISIBLE_ROACHES = 30;

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 1 | h);
    h ^= h + Math.imul(h ^ (h >>> 7), 61 | h);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable roach positions from global tap count (same on every device). */
export function roachesForGlobalCount(
  cardId: string,
  count: number,
): StoredRoach[] {
  const total = Math.min(Math.max(0, count), MAX_VISIBLE_ROACHES);

  return Array.from({ length: total }, (_, id) => {
    const rand = seededRandom(`${cardId}:roach:${id}`);
    // Spread roaches in a ring so low counts (1–3) stay visibly separate.
    const angle = (id / Math.max(total, 1)) * Math.PI * 2 + 0.6;
    const ring = 14 + (id % 4) * 9;
    const baseX = 50 + Math.cos(angle) * ring;
    const baseY = 48 + Math.sin(angle) * ring * 0.75;

    return {
      id,
      x: Math.min(92, Math.max(8, baseX + (rand() - 0.5) * 8)),
      y: Math.min(88, Math.max(12, baseY + (rand() - 0.5) * 8)),
      rotation: rand() * 360,
      size: 1.55 + rand() * 1.05,
      scuttleDelay: rand() * 1.2,
    };
  });
}

export { MAX_VISIBLE_ROACHES };
