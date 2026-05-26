"use client";

import { useCallback, useMemo, useState } from "react";

import { ImageCard } from "@/components/ImageCard";
import { getCardPlayStatus } from "@/lib/gallery-progress";
import { galleryItems } from "@/lib/images";

export function GalleryGrid() {
  const [progressVersion, setProgressVersion] = useState(0);

  const cardIds = useMemo(
    () => galleryItems.map((item) => item.id),
    [],
  );

  const handleInfested = useCallback(() => {
    setProgressVersion((v) => v + 1);
  }, []);

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
      item={item}
      playStatus={playStatuses[index]}
      onInfested={handleInfested}
    />
  ));
}
