"use client";

import { useMemo, useState } from "react";
import { Button, Card, Chip, Label, ProgressBar } from "@heroui/react";
import {
  ArrowRotateLeft,
  Eye,
  MagicWand,
  Sparkles,
} from "@gravity-ui/icons";

import type { GalleryItem } from "@/lib/images";
import { VANISH_THRESHOLD } from "@/lib/images";

type ImageCardProps = {
  item: GalleryItem;
};

export function ImageCard({ item }: ImageCardProps) {
  const [clicks, setClicks] = useState(0);

  const hasVanished = clicks >= VANISH_THRESHOLD;
  const remaining = Math.max(VANISH_THRESHOLD - clicks, 0);
  const percent = useMemo(
    () => Math.min((clicks / VANISH_THRESHOLD) * 100, 100),
    [clicks],
  );

  const handleTap = () => {
    if (hasVanished) return;
    setClicks((value) => value + 1);
  };

  const handleReset = () => {
    setClicks(0);
  };

  return (
    <Card
      className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-white/[0.04] p-0 backdrop-blur-sm transition-shadow hover:shadow-xl"
      variant="transparent"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {!hasVanished ? (
          <img
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            src={item.src}
            style={{
              filter: `saturate(${1 - percent / 200}) brightness(${1 - percent / 400})`,
              opacity: 1 - percent / 140,
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-fuchsia-500/30 via-indigo-500/20 to-cyan-400/25 p-6 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-lg backdrop-blur">
              <Sparkles className="size-6" />
            </div>
            <p className="text-balance text-base font-medium leading-snug text-white sm:text-lg">
              &ldquo;{item.revealQuote}&rdquo;
            </p>
            <p className="text-xs uppercase tracking-wider text-white/70">
              — {item.revealAuthor}
            </p>
          </div>
        )}

        {!hasVanished && (
          <div className="absolute left-3 top-3 z-10">
            <Chip
              color={remaining <= 3 ? "warning" : "accent"}
              size="sm"
              variant="soft"
            >
              <Chip.Label>
                {remaining} {remaining === 1 ? "tap" : "taps"} left
              </Chip.Label>
            </Chip>
          </div>
        )}

        {hasVanished && (
          <div className="absolute right-3 top-3 z-10">
            <Chip color="success" size="sm" variant="soft">
              <Eye className="size-3" />
              <Chip.Label>Revealed</Chip.Label>
            </Chip>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          <Card.Title className="text-base text-white sm:text-lg">
            {item.title}
          </Card.Title>
          <Card.Description className="text-xs text-white/60 sm:text-sm">
            {item.subtitle}
          </Card.Description>
        </div>

        <ProgressBar
          aria-label={`Vanish progress for ${item.title}`}
          className="w-full"
          color={hasVanished ? "success" : "accent"}
          maxValue={VANISH_THRESHOLD}
          size="sm"
          value={Math.min(clicks, VANISH_THRESHOLD)}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs text-white/60">
              {hasVanished ? "Vanished" : "Vanish progress"}
            </Label>
            <span className="text-xs tabular-nums text-white/60">
              {Math.min(clicks, VANISH_THRESHOLD)} / {VANISH_THRESHOLD}
            </span>
          </div>
          <ProgressBar.Track className="bg-white/10">
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>

        <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
          {!hasVanished ? (
            <Button
              className="w-full sm:w-auto"
              size="md"
              onPress={handleTap}
            >
              <MagicWand />
              Tap to vanish
            </Button>
          ) : (
            <Button
              className="w-full sm:w-auto"
              size="md"
              variant="secondary"
              onPress={handleReset}
            >
              <ArrowRotateLeft />
              Bring it back
            </Button>
          )}
          <span className="text-xs text-white/50">
            {hasVanished
              ? "Image cleared — context revealed."
              : `Threshold: ${VANISH_THRESHOLD} taps`}
          </span>
        </div>
      </div>
    </Card>
  );
}
