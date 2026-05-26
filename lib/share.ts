import {
  drawInfestedShareCanvas,
  generateInfestationRoaches,
  loadCockroachSprite,
} from "@/lib/infestation";
import type { GalleryItem } from "@/lib/images";

const SHARE_WIDTH = 1200;
const SHARE_HEIGHT = 630;

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

export type SharePlatform = "x" | "facebook" | "whatsapp" | "native";

export type ShareImageResult =
  | { method: "native" }
  | {
      method: "manual";
      copied: boolean;
      platform: SharePlatform;
      hint?: "whatsapp-web" | "whatsapp-mobile";
    };

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
  // iPadOS 13+ may report as Mac with touch
  return (
    navigator.maxTouchPoints > 1 && /MacIntel|Macintosh/i.test(ua)
  );
}

export function getPageUrl(itemId?: string): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.searchParams.delete("card");
  if (itemId) url.searchParams.set("card", itemId);
  return url.toString();
}

export function buildShareCaption(item: GalleryItem): string {
  return `${item.title} · Cockroach-infested reveal 🪳 · The Cockroach Gallery`;
}

export function buildShareText(item: GalleryItem): string {
  const pageUrl = getPageUrl(item.id);
  return [
    item.title,
    "",
    `"${item.revealQuote}"`,
    `— ${item.revealAuthor}`,
    "",
    "Revealed at The Cockroach Gallery 🪳",
    pageUrl,
  ].join("\n");
}

export function getTwitterComposeUrl(): string {
  return "https://twitter.com/compose/tweet";
}

export function getFacebookComposeUrl(): string {
  return "https://www.facebook.com/";
}

/** Opens WhatsApp Web in the browser (desktop). */
export function getWhatsAppWebUrl(): string {
  return "https://web.whatsapp.com/";
}

/** Deep link for phone WhatsApp app. */
export function getWhatsAppMobileUrl(item: GalleryItem): string {
  const params = new URLSearchParams({ text: buildShareCaption(item) });
  return `https://wa.me/?${params}`;
}

function loadShareImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export function toShareFile(blob: Blob, item: GalleryItem): File {
  return new File([blob], `${item.id}-infested.png`, { type: "image/png" });
}

/** Cockroach-swarmed, partially devoured share card (portrait + quote). */
export async function createShareImageBlob(
  item: GalleryItem,
): Promise<Blob | null> {
  let photo: HTMLImageElement;
  let roachSprite: HTMLImageElement;
  try {
    [photo, roachSprite] = await Promise.all([
      loadShareImage(item.src),
      loadCockroachSprite(),
    ]);
  } catch {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = SHARE_WIDTH;
  canvas.height = SHARE_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const roaches = generateInfestationRoaches(item.id);
  const rand = seededRandom(`${item.id}-bites`);

  drawInfestedShareCanvas(
    ctx,
    SHARE_WIDTH,
    SHARE_HEIGHT,
    photo,
    roaches,
    roachSprite,
    {
      title: item.title,
      quote: item.revealQuote,
      author: item.revealAuthor,
    },
    rand,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.92);
  });
}

export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  if (!navigator.clipboard?.write) return false;
  try {
    const png =
      blob.type === "image/png"
        ? blob
        : new Blob([blob], { type: "image/png" });
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": png }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export function downloadShareImage(item: GalleryItem, blob: Blob): void {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${item.id}-infested.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

export function openShareWindow(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openWhatsAppWeb(): void {
  window.open(getWhatsAppWebUrl(), "_blank", "noopener,noreferrer");
}

function openPlatformComposer(platform: SharePlatform, item: GalleryItem): void {
  switch (platform) {
    case "x":
      openShareWindow(getTwitterComposeUrl());
      break;
    case "facebook":
      openShareWindow(getFacebookComposeUrl());
      break;
    case "whatsapp":
      if (isMobileDevice()) {
        openShareWindow(getWhatsAppMobileUrl(item));
      } else {
        openWhatsAppWeb();
      }
      break;
    default:
      break;
  }
}

async function shareToWhatsAppDesktop(
  item: GalleryItem,
  blob: Blob,
): Promise<ShareImageResult> {
  const copied = await copyImageToClipboard(blob);
  downloadShareImage(item, blob);

  // Brief pause so clipboard is ready before WhatsApp Web takes focus.
  await new Promise((resolve) => setTimeout(resolve, 200));
  openWhatsAppWeb();

  return { method: "manual", copied, platform: "whatsapp", hint: "whatsapp-web" };
}

/** Opens the OS share sheet with the image — pick WhatsApp to attach directly. */
async function shareToWhatsAppMobile(
  item: GalleryItem,
  file: File,
  caption: string,
): Promise<ShareImageResult> {
  if (typeof navigator === "undefined" || !navigator.share) {
    throw new Error(
      "Sharing is not supported here. Open this page in Chrome or Safari on your phone.",
    );
  }

  // WhatsApp on mobile accepts the image best with a files-only payload first.
  const payloads: ShareData[] = [
    { files: [file] },
    { files: [file], text: caption },
    { files: [file], title: item.title, text: caption },
  ];

  for (const payload of payloads) {
    if (navigator.canShare && !navigator.canShare(payload)) continue;
    try {
      await navigator.share(payload);
      return { method: "native" };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw err;
    }
  }

  try {
    await navigator.share({ files: [file] });
    return { method: "native" };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new Error(
      "Could not open the share menu. Use Chrome or Safari, then tap WhatsApp again.",
    );
  }
}

export async function shareWithImage(
  item: GalleryItem,
  platform: SharePlatform,
): Promise<ShareImageResult> {
  const blob = await createShareImageBlob(item);
  if (!blob) {
    throw new Error("Could not build share image");
  }

  const file = toShareFile(blob, item);
  const caption = buildShareCaption(item);

  if (platform === "whatsapp" && isMobileDevice()) {
    return shareToWhatsAppMobile(item, file, caption);
  }

  if (platform === "whatsapp" && !isMobileDevice()) {
    return shareToWhatsAppDesktop(item, blob);
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    const withFiles = { files: [file], title: item.title, text: caption };
    if (navigator.canShare?.(withFiles)) {
      try {
        await navigator.share(withFiles);
        return { method: "native" };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") throw err;
      }
    }
  }

  const copied = await copyImageToClipboard(blob);
  downloadShareImage(item, blob);

  if (platform !== "native") {
    await new Promise((resolve) => setTimeout(resolve, 150));
    openPlatformComposer(platform, item);
  }

  return { method: "manual", copied, platform };
}

export function getShareStatusMessage(result: ShareImageResult): string {
  if (result.method === "native") {
    return isMobileDevice()
      ? "Choose WhatsApp in the share menu — the image will attach to your chat."
      : "Image shared!";
  }

  if (result.hint === "whatsapp-web") {
    if (result.copied) {
      return [
        "WhatsApp Web opened.",
        "Pick a chat, click the message box, then press Ctrl+V (⌘V on Mac) to paste the image.",
        "Or drag the preview image above straight into the chat.",
      ].join(" ");
    }
    return [
      "WhatsApp Web opened.",
      "Attach the downloaded PNG using the 📎 button,",
      "or drag the preview image above into your chat.",
    ].join(" ");
  }

  const pasteHint = result.copied
    ? "Paste with Ctrl+V (or ⌘V) in the composer."
    : "Use the downloaded PNG from your Downloads folder.";

  switch (result.platform) {
    case "x":
      return `Image ready — click the photo icon or ${pasteHint}`;
    case "facebook":
      return `Image saved — create a post and upload the file. ${pasteHint}`;
    case "whatsapp":
      return `Image saved — attach it in WhatsApp. ${pasteHint}`;
    default:
      return result.copied
        ? "Image copied to clipboard and saved to Downloads."
        : "Image saved to Downloads.";
  }
}
