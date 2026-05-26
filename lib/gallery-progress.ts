import { loadCardProgress } from "@/lib/card-progress";

export type CardPlayStatus = "active" | "infested" | "locked";

/** True only after the feast finishes (per-browser progress in localStorage). */
export function isCardInfested(cardId: string): boolean {
  const stored = loadCardProgress(cardId);
  return stored?.phase === "vanished";
}

/** Index of the next portrait the visitor may tap; all before are infested. */
export function getActiveGalleryIndex(cardIds: readonly string[]): number {
  for (let i = 0; i < cardIds.length; i++) {
    if (!isCardInfested(cardIds[i])) return i;
  }
  return cardIds.length;
}

export function getCardPlayStatus(
  cardId: string,
  index: number,
  cardIds: readonly string[],
): CardPlayStatus {
  if (isCardInfested(cardId)) return "infested";
  if (index === getActiveGalleryIndex(cardIds)) return "active";
  return "locked";
}
