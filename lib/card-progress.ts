/** Per-card tap progress stored in the browser (survives server restarts). */

const STORAGE_KEY = "ckrch:gallery-progress";
const SCHEMA_VERSION = 2;

/** Each visitor gets exactly one tap per portrait (while it is active). */
export const MAX_TAPS_PER_USER = 1;

export type CardPhase = "intact" | "eating" | "vanished";

export type StoredRoach = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  scuttleDelay: number;
};

export type CardProgress = {
  clickUsed: boolean;
  clicks: number;
  phase: CardPhase;
  roaches: StoredRoach[];
  nextRoachId: number;
};

type ProgressStore = {
  v: number;
  cards: Record<string, CardProgress>;
};

function emptyStore(): ProgressStore {
  return { v: SCHEMA_VERSION, cards: {} };
}

function readStore(): ProgressStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as ProgressStore;
    if (parsed?.v !== SCHEMA_VERSION || typeof parsed.cards !== "object") {
      return emptyStore();
    }
    return parsed;
  } catch {
    return emptyStore();
  }
}

function writeStore(store: ProgressStore): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* quota exceeded or private mode — ignore */
  }
}

function normalizeProgress(entry: CardProgress): CardProgress {
  const clickUsed =
    entry.clickUsed === true || entry.clicks >= MAX_TAPS_PER_USER;
  return { ...entry, clickUsed };
}

export function hasUsedTap(cardId: string): boolean {
  return loadCardProgress(cardId)?.clickUsed === true;
}

export function loadCardProgress(cardId: string): CardProgress | null {
  const store = readStore();
  const entry = store.cards[cardId];
  if (!entry || typeof entry.clicks !== "number") return null;
  return normalizeProgress({
    clickUsed: entry.clickUsed === true,
    clicks: entry.clicks,
    phase: entry.phase,
    roaches: entry.roaches ?? [],
    nextRoachId: entry.nextRoachId ?? 0,
  });
}

export function saveCardProgress(
  cardId: string,
  progress: CardProgress,
): void {
  const store = readStore();
  store.cards[cardId] = normalizeProgress(progress);
  writeStore(store);
}

export function clearCardProgress(cardId: string): void {
  const store = readStore();
  delete store.cards[cardId];
  writeStore(store);
}
