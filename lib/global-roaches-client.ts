export type GlobalRoachCounts = Record<string, number>;

/** One request for all portraits (avoids N cards × polling). */
export async function fetchAllGlobalRoachCounts(): Promise<GlobalRoachCounts> {
  const res = await fetch("/api/gallery/roaches", { cache: "no-store" });
  if (!res.ok) return {};
  const data = (await res.json()) as { counts?: GlobalRoachCounts };
  return data.counts ?? {};
}

export async function incrementGlobalRoachCount(cardId: string): Promise<number> {
  const res = await fetch(`/api/cards/${cardId}/roaches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error("Failed to register cockroach");
  }
  const data = (await res.json()) as { count?: number };
  return typeof data.count === "number" ? data.count : 0;
}
