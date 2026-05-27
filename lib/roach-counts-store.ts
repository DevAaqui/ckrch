import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { kv } from "@vercel/kv";

import { galleryItems } from "@/lib/images";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "cockroach-counts.json");
const KV_HASH_KEY = "cockroach-counts";

type CountStore = Record<string, number>;

const validCardIds = new Set(galleryItems.map((item) => item.id));

function useKvStore(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export function isValidCardId(cardId: string): boolean {
  return validCardIds.has(cardId);
}

function normalizeCount(value: unknown): number {
  return typeof value === "number" && value >= 0 ? value : 0;
}

function normalizeStore(raw: CountStore | null | undefined): CountStore {
  const result: CountStore = {};
  for (const id of validCardIds) {
    result[id] = normalizeCount(raw?.[id]);
  }
  return result;
}

async function readFileStore(): Promise<CountStore> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as CountStore;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

async function writeFileStore(store: CountStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

async function readKvStore(): Promise<CountStore> {
  const raw = await kv.hgetall<CountStore>(KV_HASH_KEY);
  return normalizeStore(raw ?? undefined);
}

export async function getGlobalRoachCount(cardId: string): Promise<number> {
  if (!isValidCardId(cardId)) return 0;

  if (useKvStore()) {
    const count = await kv.hget<number>(KV_HASH_KEY, cardId);
    return normalizeCount(count);
  }

  const store = await readFileStore();
  return normalizeCount(store[cardId]);
}

export async function incrementGlobalRoachCount(cardId: string): Promise<number> {
  if (!isValidCardId(cardId)) {
    throw new Error("Invalid card id");
  }

  if (useKvStore()) {
    return kv.hincrby(KV_HASH_KEY, cardId, 1);
  }

  const store = await readFileStore();
  const next = (store[cardId] ?? 0) + 1;
  store[cardId] = next;
  await writeFileStore(store);
  return next;
}

export async function getAllGlobalRoachCounts(): Promise<CountStore> {
  if (useKvStore()) {
    return readKvStore();
  }

  return normalizeStore(await readFileStore());
}
