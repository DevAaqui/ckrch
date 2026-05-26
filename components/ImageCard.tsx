"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import { Button, Card, Chip, Label, ProgressBar } from "@heroui/react";
import { Eye, Sparkles } from "@gravity-ui/icons";

import { Cockroach } from "@/components/Cockroach";
import { ShareButtons } from "@/components/ShareButtons";
import {
  hasUsedTap,
  loadCardProgress,
  MAX_TAPS_PER_USER,
  saveCardProgress,
  type CardPhase,
  type StoredRoach,
} from "@/lib/card-progress";
import { roachesForGlobalCount } from "@/lib/display-roaches";
import type { CardPlayStatus } from "@/lib/gallery-progress";
import { incrementGlobalRoachCount } from "@/lib/global-roaches-client";
import type { GalleryItem } from "@/lib/images";
import { VANISH_THRESHOLD } from "@/lib/images";

type ImageCardProps = {
  item: GalleryItem;
  playStatus: CardPlayStatus;
  globalCount: number;
  onGlobalCountChange?: (cardId: string, count: number) => void;
  onInfested?: () => void;
};

type Roach = StoredRoach;

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

function resolvePhaseFromStorage(storedPhase: CardPhase): CardPhase {
  if (storedPhase === "vanished" || storedPhase === "eating") return storedPhase;
  return "intact";
}

function scheduleVanish(
  onDone: () => void,
  eatingTimeoutRef: MutableRefObject<number | null>,
) {
  if (eatingTimeoutRef.current !== null) {
    window.clearTimeout(eatingTimeoutRef.current);
  }
  eatingTimeoutRef.current = window.setTimeout(() => {
    onDone();
    eatingTimeoutRef.current = null;
  }, EATING_DURATION_MS);
}

export function ImageCard({
  item,
  playStatus,
  globalCount,
  onGlobalCountChange,
  onInfested,
}: ImageCardProps) {
  const [clicks, setClicks] = useState(0);
  const [localRoaches, setLocalRoaches] = useState<Roach[]>([]);
  const [phase, setPhase] = useState<CardPhase>("intact");
  const [hydrated, setHydrated] = useState(false);
  const eatingTimeoutRef = useRef<number | null>(null);
  const nextRoachId = useRef(0);
  const tappingRef = useRef(false);

  const persist = (
    nextClicks: number,
    nextRoaches: Roach[],
    nextPhase: CardPhase,
    nextRoachIdValue: number,
  ) => {
    saveCardProgress(item.id, {
      clickUsed: nextClicks >= MAX_TAPS_PER_USER,
      clicks: nextClicks,
      phase: nextPhase,
      roaches: nextRoaches,
      nextRoachId: nextRoachIdValue,
    });
  };

  const tapConsumed =
    clicks >= MAX_TAPS_PER_USER || (hydrated && hasUsedTap(item.id));

  useEffect(() => {
    if (playStatus === "locked") {
      setClicks(0);
      setLocalRoaches([]);
      setPhase("intact");
      nextRoachId.current = 0;
      setHydrated(true);
      return;
    }

    const stored = loadCardProgress(item.id);
    if (stored) {
      const restoredPhase = resolvePhaseFromStorage(stored.phase);
      setClicks(stored.clicks);
      setLocalRoaches(restoredPhase === "vanished" ? [] : stored.roaches);
      setPhase(playStatus === "infested" ? "vanished" : restoredPhase);
      nextRoachId.current = stored.nextRoachId;

      if (playStatus === "active" && restoredPhase === "eating") {
        scheduleVanish(() => {
          setPhase("vanished");
          persist(stored.clicks, [], "vanished", nextRoachId.current);
          onInfested?.();
        }, eatingTimeoutRef);
      }
    } else if (playStatus === "infested") {
      setPhase("vanished");
    }
    setHydrated(true);

    return () => {
      if (eatingTimeoutRef.current !== null) {
        window.clearTimeout(eatingTimeoutRef.current);
      }
    };
  }, [item.id, playStatus, onInfested]);

  const handleTap = async () => {
    if (
      !hydrated ||
      playStatus !== "active" ||
      phase !== "intact" ||
      tappingRef.current ||
      tapConsumed ||
      hasUsedTap(item.id)
    ) {
      return;
    }

    tappingRef.current = true;

    try {
      const nextGlobal = await incrementGlobalRoachCount(item.id);
      onGlobalCountChange?.(item.id, nextGlobal);
    } catch {
      /* still run local feast if API fails */
    }

    const nextCount = clicks + 1;
    const newRoach = spawnRoach(nextRoachId.current++);
    const nextRoaches = [...localRoaches, newRoach];

    setClicks(nextCount);
    setLocalRoaches(nextRoaches);
    persist(nextCount, nextRoaches, "intact", nextRoachId.current);

    if (nextCount >= VANISH_THRESHOLD) {
      window.setTimeout(() => {
        setPhase("eating");
        persist(nextCount, nextRoaches, "eating", nextRoachId.current);
        scheduleVanish(() => {
          setPhase("vanished");
          persist(nextCount, [], "vanished", nextRoachId.current);
          onInfested?.();
        }, eatingTimeoutRef);
      }, 450);
    }
  };

  const imageStageClass = useMemo(() => {
    if (phase === "eating") return "is-eating";
    if (phase === "vanished") return "is-vanished";
    return "";
  }, [phase]);

  const hasVanished = playStatus === "infested" || phase === "vanished";
  const isLocked = playStatus === "locked";
  const isActive = playStatus === "active";

  const displayRoaches = useMemo(
    () => roachesForGlobalCount(item.id, globalCount),
    [item.id, globalCount],
  );

  const showRoaches = !hasVanished && displayRoaches.length > 0;

  const cardRingClass =
    playStatus === "active"
      ? "ring-2 ring-amber-400/70 shadow-amber-900/20"
      : playStatus === "infested"
        ? "ring-2 ring-emerald-500/40"
        : "opacity-55 saturate-[0.65]";

  return (
    <Card
      id={item.id}
      className={`group relative flex w-full flex-col overflow-hidden border border-white/10 bg-white/[0.04] p-0 backdrop-blur-sm transition-all hover:shadow-xl ${cardRingClass}`}
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
          displayRoaches.map((roach) => {
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
                key={`${item.id}-roach-${roach.id}`}
                className="roach-anchor"
                style={anchorStyle}
              >
                <span className="roach-wiggle" style={wiggleStyle}>
                  <Cockroach className="roach-glyph" style={glyphStyle} />
                </span>
              </span>
            );
          })}

        {isLocked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/55 p-4 text-center backdrop-blur-[2px]">
            <Chip color="default" size="sm" variant="soft">
              <Chip.Label>Locked</Chip.Label>
            </Chip>
            <p className="max-w-[14rem] text-xs text-white/75">
              Infest the previous portrait first.
            </p>
          </div>
        )}

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
          {isActive && phase === "intact" && !tapConsumed && (
            <Chip color="warning" size="sm" variant="primary">
              <Chip.Label>Active — one tap only</Chip.Label>
            </Chip>
          )}
          {globalCount > 0 && (
            <Chip color="danger" size="sm" variant="soft">
              <Chip.Label>
                {globalCount} 🪳 worldwide
              </Chip.Label>
            </Chip>
          )}
        </div>

        {phase !== "vanished" && (clicks > 0 || globalCount > 0) && (
          <div className="absolute right-3 top-3 z-10">
            <Chip color="danger" size="sm" variant="soft">
              <Chip.Label>
                {phase === "eating"
                  ? "Feasting…"
                  : `${Math.max(globalCount, clicks)} 🪳 on photo`}
              </Chip.Label>
            </Chip>
          </div>
        )}

        {hasVanished && (
          <div className="absolute right-3 top-3 z-10">
            <Chip color="success" size="sm" variant="soft">
              <Eye className="size-3" />
              <Chip.Label>
                {playStatus === "infested" ? "Infested" : "Revealed"}
              </Chip.Label>
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
                  : "Your tap on this device"}
            </Label>
            <span className="text-xs tabular-nums text-white/60">
              {globalCount} global · {Math.min(clicks, VANISH_THRESHOLD)} you
            </span>
          </div>
          <ProgressBar.Track className="bg-white/10">
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>

        {hasVanished && <ShareButtons item={item} />}

        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
          {isActive && phase === "intact" && !tapConsumed && (
            <Button
              className="w-full sm:w-auto"
              isDisabled={!hydrated}
              size="md"
              onPress={() => void handleTap()}
            >
              <span className="text-base leading-none">🪳</span>
              Summon the swarm (1 tap)
            </Button>
          )}

          {isActive && phase === "eating" && (
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

          {isLocked && (
            <Button isDisabled className="w-full sm:w-auto" size="md" variant="secondary">
              <span className="text-base leading-none">🪳</span>
              Locked
            </Button>
          )}

          <span className="text-xs text-white/50">
            {isLocked && "Complete earlier portraits to unlock."}
            {isActive &&
              phase === "intact" &&
              !tapConsumed &&
              "One tap adds 1 roach for everyone — synced across devices."}
            {isActive && phase === "eating" && "Hold on — the swarm is eating…"}
            {hasVanished &&
              playStatus === "infested" &&
              "Infested — next portrait unlocked."}
          </span>
        </div>
      </div>
    </Card>
  );
}
