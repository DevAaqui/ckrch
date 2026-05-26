"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Button, Card, Chip, Label, ProgressBar } from "@heroui/react";
import { ArrowRotateLeft, Eye, Sparkles } from "@gravity-ui/icons";

import { Cockroach } from "@/components/Cockroach";
import { ShareButtons } from "@/components/ShareButtons";
import type { GalleryItem } from "@/lib/images";
import { VANISH_THRESHOLD } from "@/lib/images";

type ImageCardProps = {
  item: GalleryItem;
};

type Roach = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  scuttleDelay: number;
};

type Phase = "intact" | "eating" | "vanished";

const EATING_DURATION_MS = 1300;

function spawnRoach(id: number): Roach {
  return {
    id,
    x: 8 + Math.random() * 84,
    y: 12 + Math.random() * 76,
    rotation: Math.random() * 360,
    size: 1.6 + Math.random() * 1.1,
    scuttleDelay: Math.random() * 1.2,
  };
}

export function ImageCard({ item }: ImageCardProps) {
  const [clicks, setClicks] = useState(0);
  const [roaches, setRoaches] = useState<Roach[]>([]);
  const [phase, setPhase] = useState<Phase>("intact");
  const eatingTimeoutRef = useRef<number | null>(null);
  const nextRoachId = useRef(0);

  useEffect(() => {
    return () => {
      if (eatingTimeoutRef.current !== null) {
        window.clearTimeout(eatingTimeoutRef.current);
      }
    };
  }, []);

  const remaining = Math.max(VANISH_THRESHOLD - clicks, 0);

  const handleTap = () => {
    if (phase !== "intact") return;

    const nextCount = clicks + 1;
    setClicks(nextCount);
    setRoaches((prev) => [
      ...prev,
      spawnRoach(nextRoachId.current++),
    ]);

    if (nextCount >= VANISH_THRESHOLD) {
      setPhase("eating");
      eatingTimeoutRef.current = window.setTimeout(() => {
        setPhase("vanished");
        eatingTimeoutRef.current = null;
      }, EATING_DURATION_MS);
    }
  };

  const handleReset = () => {
    if (eatingTimeoutRef.current !== null) {
      window.clearTimeout(eatingTimeoutRef.current);
      eatingTimeoutRef.current = null;
    }
    setClicks(0);
    setRoaches([]);
    setPhase("intact");
    nextRoachId.current = 0;
  };

  const imageStageClass = useMemo(() => {
    if (phase === "eating") return "is-eating";
    if (phase === "vanished") return "is-vanished";
    return "";
  }, [phase]);

  const hasVanished = phase === "vanished";
  const showRoaches = phase !== "vanished";

  return (
    <Card
      id={item.id}
      className="group relative flex w-full flex-col overflow-hidden border border-white/10 bg-white/[0.04] p-0 backdrop-blur-sm transition-shadow hover:shadow-xl"
      variant="transparent"
    >
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden ${imageStageClass}`}
      >
        {!hasVanished ? (
          <img
            alt={item.title}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
              phase === "eating" ? "image-eaten" : ""
            }`}
            draggable={false}
            loading="lazy"
            src={item.src}
          />
        ) : (
          <div className="reveal-pane absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-amber-900/50 via-zinc-900/70 to-stone-900/80 p-6 text-center">
            <div className="rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-lg backdrop-blur">
              <Sparkles className="size-6" />
            </div>
            <p className="text-balance text-base font-medium leading-snug text-white sm:text-lg">
              &ldquo;{item.revealQuote}&rdquo;
            </p>
            <p className="text-xs uppercase tracking-wider text-white/70">
              — {item.revealAuthor}
            </p>
            <p className="mt-2 text-[11px] text-white/50">
              The roaches devoured the image whole.
            </p>
          </div>
        )}

        {showRoaches &&
          roaches.map((roach) => {
            const anchorStyle = {
              "--x": `${roach.x}%`,
              "--y": `${roach.y}%`,
            } as CSSProperties;
            const wiggleStyle = {
              "--scuttle-delay": `${roach.scuttleDelay}s`,
            } as CSSProperties;
            const glyphStyle = {
              "--rot": `${roach.rotation}deg`,
              "--size": `${roach.size}rem`,
            } as CSSProperties;

            return (
              <span
                key={roach.id}
                className="roach-anchor"
                style={anchorStyle}
              >
                <span className="roach-wiggle" style={wiggleStyle}>
                  <Cockroach className="roach-glyph" style={glyphStyle} />
                </span>
              </span>
            );
          })}

        {phase === "intact" && (
          <div className="absolute left-3 top-3 z-10">
            <Chip
              color={remaining <= 3 ? "warning" : "accent"}
              size="sm"
              variant="soft"
            >
              <Chip.Label>
                {remaining === 0
                  ? "Threshold reached"
                  : `${remaining} tap${remaining === 1 ? "" : "s"} to feast`}
              </Chip.Label>
            </Chip>
          </div>
        )}

        {phase === "intact" && clicks > 0 && (
          <div className="absolute right-3 top-3 z-10">
            <Chip color="danger" size="sm" variant="soft">
              <Chip.Label>
                {clicks} 🪳 {clicks === 1 ? "summoned" : "swarming"}
              </Chip.Label>
            </Chip>
          </div>
        )}

        {phase === "eating" && (
          <div className="absolute right-3 top-3 z-10">
            <Chip color="danger" size="sm" variant="primary">
              <Chip.Label>Feasting…</Chip.Label>
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

      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          <Card.Title className="text-base text-white sm:text-lg">
            {item.title}
          </Card.Title>
          <Card.Description className="text-xs text-white/60 sm:text-sm">
            {item.subtitle}
          </Card.Description>
        </div>

        <ProgressBar
          aria-label={`Cockroach swarm progress for ${item.title}`}
          className="w-full"
          color={hasVanished ? "success" : phase === "eating" ? "danger" : "accent"}
          maxValue={VANISH_THRESHOLD}
          size="sm"
          value={Math.min(clicks, VANISH_THRESHOLD)}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs text-white/60">
              {hasVanished
                ? "Image consumed"
                : phase === "eating"
                  ? "Feasting in progress"
                  : "Cockroaches summoned"}
            </Label>
            <span className="text-xs tabular-nums text-white/60">
              {Math.min(clicks, VANISH_THRESHOLD)} / {VANISH_THRESHOLD}
            </span>
          </div>
          <ProgressBar.Track className="bg-white/10">
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>

        {hasVanished && <ShareButtons item={item} />}

        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
          {phase === "intact" && (
            <Button
              className="w-full sm:w-auto"
              size="md"
              onPress={handleTap}
            >
              <span className="text-base leading-none">🪳</span>
              Summon a cockroach
            </Button>
          )}

          {phase === "eating" && (
            <Button
              isDisabled
              className="w-full sm:w-auto"
              size="md"
              variant="danger"
            >
              <span className="text-base leading-none">🪳</span>
              Being devoured…
            </Button>
          )}

          {hasVanished && (
            <Button
              className="w-full sm:w-auto"
              size="md"
              variant="secondary"
              onPress={handleReset}
            >
              <ArrowRotateLeft />
              Shoo them away
            </Button>
          )}

          <span className="text-xs text-white/50">
            {phase === "intact" &&
              `Threshold: ${VANISH_THRESHOLD} taps before they feast`}
            {phase === "eating" && "Hold on — the swarm is eating…"}
            {hasVanished && "Image cleared — context revealed."}
          </span>
        </div>
      </div>
    </Card>
  );
}
