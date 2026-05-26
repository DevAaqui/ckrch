/** Per-card tap progress stored in the browser (survives server restarts). */

const STORAGE_KEY = "ckrch:gallery-progress";
const SCHEMA_VERSION = 1;

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

export function loadCardProgress(cardId: string): CardProgress | null {
  const store = readStore();
  const entry = store.cards[cardId];
  if (!entry || typeof entry.clicks !== "number") return null;
  return entry;
}

export function saveCardProgress(
  cardId: string,
  progress: CardProgress,
): void {
  const store = readStore();
  store.cards[cardId] = progress;
  writeStore(store);
}

export function clearCardProgress(cardId: string): void {
  const store = readStore();
  delete store.cards[cardId];
  writeStore(store);
}
