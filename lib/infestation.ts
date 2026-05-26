import { VANISH_THRESHOLD } from "@/lib/images";

export type InfestationRoach = {
  x: number;
  y: number;
  rotation: number;
  /** Pixel size on the share canvas */
  sizePx: number;
};

const COCKROACH_SPRITE_URL =
  "https://api.iconify.design/noto/cockroach.svg";

let cockroachSpriteCache: HTMLImageElement | null = null;

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 1 | h);
    h ^= h + Math.imul(h ^ (h >>> 7), 61 | h);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic swarm — same card always gets the same roach layout. */
export function generateInfestationRoaches(
  seed: string,
  count = VANISH_THRESHOLD,
): InfestationRoach[] {
  const rand = seededRandom(seed);
  const scattered: InfestationRoach[] = Array.from({ length: count }, () => ({
    x: 0.06 + rand() * 0.88,
    y: 0.1 + rand() * 0.78,
    rotation: rand() * 360,
    sizePx: 44 + rand() * 52,
  }));

  // Extra swarm converging on the center (eating phase).
  const centerSwarm: InfestationRoach[] = Array.from({ length: 6 }, () => ({
    x: 0.38 + rand() * 0.24,
    y: 0.32 + rand() * 0.28,
    rotation: rand() * 360,
    sizePx: 56 + rand() * 64,
  }));

  return [...scattered, ...centerSwarm];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export async function loadCockroachSprite(): Promise<HTMLImageElement> {
  if (cockroachSpriteCache) return cockroachSpriteCache;
  cockroachSpriteCache = await loadImage(COCKROACH_SPRITE_URL);
  return cockroachSpriteCache;
}

function drawPhotoCover(
  ctx: CanvasRenderingContext2D,
  photo: HTMLImageElement,
  width: number,
  height: number,
): void {
  const scale = Math.max(
    width / photo.naturalWidth,
    height / photo.naturalHeight,
  );
  const dw = photo.naturalWidth * scale;
  const dh = photo.naturalHeight * scale;
  ctx.drawImage(photo, (width - dw) / 2, (height - dh) / 2, dw, dh);
}

function drawEatenEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number,
): void {
  const cx = width * 0.5;
  const cy = height * 0.46;

  // Murky infestation tint over the whole frame.
  ctx.fillStyle = "rgba(18, 12, 8, 0.42)";
  ctx.fillRect(0, 0, width, height);

  // Center devoured zone — desaturated, dark, blurred bite.
  const eaten = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.55);
  eaten.addColorStop(0, "rgba(0, 0, 0, 0.72)");
  eaten.addColorStop(0.45, "rgba(40, 28, 18, 0.55)");
  eaten.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = eaten;
  ctx.fillRect(0, 0, width, height);

  // Irregular bite marks.
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  for (let i = 0; i < 14; i++) {
    const bx = width * (0.2 + rand() * 0.6);
    const by = height * (0.18 + rand() * 0.55);
    const br = 28 + rand() * 72;
    const bite = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    bite.addColorStop(0, "rgba(0, 0, 0, 0.85)");
    bite.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bite;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Sickly green-brown fringe (roach grime).
  const grime = ctx.createLinearGradient(0, 0, width, height);
  grime.addColorStop(0, "rgba(55, 45, 20, 0.2)");
  grime.addColorStop(0.5, "rgba(30, 50, 25, 0.28)");
  grime.addColorStop(1, "rgba(45, 25, 15, 0.25)");
  ctx.fillStyle = grime;
  ctx.fillRect(0, 0, width, height);
}

function drawRoach(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  roach: InfestationRoach,
  width: number,
  height: number,
): void {
  const x = roach.x * width;
  const y = roach.y * height;
  const s = roach.sizePx;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((roach.rotation * Math.PI) / 180);
  ctx.filter =
    "brightness(0.78) contrast(1.22) saturate(1.35) drop-shadow(0 2px 5px rgba(0,0,0,0.75))";
  ctx.drawImage(sprite, -s / 2, -s / 2, s, s);
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export type InfestationQuote = {
  title: string;
  quote: string;
  author: string;
};

export function drawInfestedShareCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photo: HTMLImageElement,
  roaches: InfestationRoach[],
  roachSprite: HTMLImageElement,
  copy: InfestationQuote,
  rand: () => number,
): void {
  drawPhotoCover(ctx, photo, width, height);
  drawEatenEffect(ctx, width, height, rand);

  for (const roach of roaches) {
    drawRoach(ctx, roachSprite, roach, width, height);
  }

  // Vignette so roaches pop.
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    height * 0.2,
    width / 2,
    height / 2,
    width * 0.72,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // Infestation badge.
  ctx.save();
  ctx.fillStyle = "rgba(120, 30, 30, 0.92)";
  ctx.strokeStyle = "rgba(255, 180, 80, 0.5)";
  ctx.lineWidth = 2;
  const badgeW = 340;
  const badgeH = 48;
  const badgeX = width - badgeW - 32;
  const badgeY = 32;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffe8c8";
  ctx.font = "700 22px system-ui, -apple-system, sans-serif";
  ctx.fillText("🪳 COCKROACH INFESTATION", badgeX + 16, badgeY + 32);
  ctx.restore();

  // Quote strip at bottom (partially devoured reveal).
  const pad = 48;
  const stripH = 220;
  const stripGrad = ctx.createLinearGradient(0, height - stripH, 0, height);
  stripGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
  stripGrad.addColorStop(0.35, "rgba(0, 0, 0, 0.82)");
  stripGrad.addColorStop(1, "rgba(0, 0, 0, 0.95)");
  ctx.fillStyle = stripGrad;
  ctx.fillRect(0, height - stripH, width, stripH);

  const maxText = width - pad * 2;
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 36px system-ui, -apple-system, sans-serif";
  ctx.fillText(copy.title, pad, height - 168);

  ctx.font = "italic 28px Georgia, 'Times New Roman', serif";
  const quoteLines = wrapText(ctx, `"${copy.quote}"`, maxText);
  let y = height - 118;
  for (const line of quoteLines.slice(0, 3)) {
    ctx.fillText(line, pad, y);
    y += 34;
  }

  ctx.font = "500 22px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.fillText(`— ${copy.author}`, pad, height - 36);

  ctx.font = "500 18px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255, 200, 120, 0.55)";
  ctx.fillText("The roaches devoured the image · Cockroach Gallery", pad, height - 10);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

if (typeof window !== "undefined") {
  void loadCockroachSprite().catch(() => {
    /* preview may load sprite later */
  });
}
