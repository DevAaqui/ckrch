"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ImageCard } from "@/components/ImageCard";
import { getCardPlayStatus } from "@/lib/gallery-progress";
import {
  fetchAllGlobalRoachCounts,
  type GlobalRoachCounts,
} from "@/lib/global-roaches-client";
import { galleryItems } from "@/lib/images";

const GLOBAL_COUNT_POLL_MS = 8000;

export function GalleryGrid() {
  const [progressVersion, setProgressVersion] = useState(0);
  const [globalCounts, setGlobalCounts] = useState<GlobalRoachCounts>({});

  const cardIds = useMemo(
    () => galleryItems.map((item) => item.id),
    [],
  );

  const refreshGlobalCounts = useCallback(async () => {
    const counts = await fetchAllGlobalRoachCounts();
    setGlobalCounts(counts);
  }, []);

  useEffect(() => {
    void refreshGlobalCounts();
    const poll = window.setInterval(() => {
      void refreshGlobalCounts();
    }, GLOBAL_COUNT_POLL_MS);
    return () => window.clearInterval(poll);
  }, [refreshGlobalCounts]);

  const handleInfested = useCallback(() => {
    setProgressVersion((v) => v + 1);
    void refreshGlobalCounts();
  }, [refreshGlobalCounts]);

  const handleGlobalCountChange = useCallback(
    (cardId: string, count: number) => {
      setGlobalCounts((prev) => ({ ...prev, [cardId]: count }));
    },
    [],
  );

  const playStatuses = useMemo(
    () =>
      galleryItems.map((item, index) =>
        getCardPlayStatus(item.id, index, cardIds),
      ),
    [cardIds, progressVersion],
  );

  return galleryItems.map((item, index) => (
    <ImageCard
      key={item.id}
      globalCount={globalCounts[item.id] ?? 0}
      item={item}
      playStatus={playStatuses[index]}
      onGlobalCountChange={handleGlobalCountChange}
      onInfested={handleInfested}
    />
  ));
}
