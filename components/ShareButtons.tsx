"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@heroui/react";

import type { GalleryItem } from "@/lib/images";
import {
  createShareImageBlob,
  getShareStatusMessage,
  isMobileDevice,
  openWhatsAppWeb,
  shareWithImage,
  type SharePlatform,
} from "@/lib/share";

type ShareButtonsProps = {
  item: GalleryItem;
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function ShareButtons({ item }: ShareButtonsProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const onDesktop = typeof window !== "undefined" && !isMobileDevice();

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    void createShareImageBlob(item).then((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPreviewUrl(null);
    };
  }, [item]);

  const handleShare = useCallback(
    async (platform: SharePlatform) => {
      setBusy(true);
      setStatus(null);
      try {
        const result = await shareWithImage(item, platform);
        setStatus(getShareStatusMessage(result));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setStatus(
          err instanceof Error
            ? err.message
            : "Could not prepare image. Try again.",
        );
      } finally {
        setBusy(false);
      }
    },
    [item],
  );

  return (
    <div className="flex w-full flex-col gap-3 border-t border-white/10 pt-3">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wider text-white/50">
          Share infested image
        </p>
        <p className="text-[11px] text-white/40">
          {onDesktop
            ? "Swarmed with cockroaches — drag into WhatsApp Web or paste with Ctrl+V."
            : "Cockroach-swarmed card — tap WhatsApp, then pick WhatsApp in the share menu."}
        </p>
      </div>

      {previewUrl && (
        <div className="flex flex-col gap-1.5">
          <img
            alt={`Share preview for ${item.title}`}
            className="w-full cursor-grab rounded-lg border border-white/15 object-cover shadow-lg active:cursor-grabbing"
            draggable
            src={previewUrl}
            title="Cockroach-infested — drag into WhatsApp Web"
          />
          {onDesktop && (
            <p className="text-[10px] text-white/35">
              Tip: drag this preview onto an open WhatsApp Web chat.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          aria-label={`Share ${item.title} image on X`}
          className="min-w-0 px-3"
          isDisabled={busy}
          size="sm"
          variant="secondary"
          onPress={() => handleShare("x")}
        >
          <XIcon className="size-4" />
          <span className="hidden sm:inline">X</span>
        </Button>
        <Button
          aria-label={`Share ${item.title} image on Facebook`}
          className="min-w-0 px-3"
          isDisabled={busy}
          size="sm"
          variant="secondary"
          onPress={() => handleShare("facebook")}
        >
          <FacebookIcon className="size-4" />
          <span className="hidden sm:inline">Facebook</span>
        </Button>
        <Button
          aria-label={`Share ${item.title} image on WhatsApp`}
          className="min-w-0 px-3"
          isDisabled={busy}
          size="sm"
          variant="secondary"
          onPress={() => handleShare("whatsapp")}
        >
          <WhatsAppIcon className="size-4" />
          <span className="hidden sm:inline">
            {onDesktop ? "WhatsApp Web" : "WhatsApp"}
          </span>
        </Button>
        {/* {onDesktop && (
          <Button
            className="min-w-0 px-3"
            isDisabled={busy}
            size="sm"
            variant="tertiary"
            onPress={() => {
              openWhatsAppWeb();
              setStatus(
                "WhatsApp Web opened — drag the preview above into a chat, or click WhatsApp Web again after using the green button to copy the image.",
              );
            }}
          >
            Open WA Web
          </Button>
        )} */}
        <Button
          className="min-w-0 flex-1 sm:flex-none"
          isDisabled={busy}
          size="sm"
          variant="primary"
          onPress={() => handleShare("native")}
        >
          {busy ? "Preparing image…" : "Share"}
        </Button>
      </div>
      {status && (
        <p className="text-[11px] leading-relaxed text-amber-200/80" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
