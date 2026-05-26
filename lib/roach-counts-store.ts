import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { galleryItems } from "@/lib/images";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "cockroach-counts.json");

type CountStore = Record<string, number>;

const validCardIds = new Set(galleryItems.map((item) => item.id));

export function isValidCardId(cardId: string): boolean {
  return validCardIds.has(cardId);
}

async function readStore(): Promise<CountStore> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as CountStore;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

async function writeStore(store: CountStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getGlobalRoachCount(cardId: string): Promise<number> {
  if (!isValidCardId(cardId)) return 0;
  const store = await readStore();
  const count = store[cardId];
  return typeof count === "number" && count >= 0 ? count : 0;
}

export async function incrementGlobalRoachCount(cardId: string): Promise<number> {
  if (!isValidCardId(cardId)) {
    throw new Error("Invalid card id");
  }
  const store = await readStore();
  const next = (store[cardId] ?? 0) + 1;
  store[cardId] = next;
  await writeStore(store);
  return next;
}

export async function getAllGlobalRoachCounts(): Promise<CountStore> {
  const store = await readStore();
  const result: CountStore = {};
  for (const id of validCardIds) {
    result[id] = typeof store[id] === "number" ? store[id] : 0;
  }
  return result;
}
