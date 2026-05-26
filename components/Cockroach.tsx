"use client";

import { Icon, loadIcon } from "@iconify/react";
import type { CSSProperties } from "react";

/**
 * Renders a high-quality cockroach SVG sourced from the
 * Microsoft Fluent Emoji Flat icon set via Iconify.
 *
 * Swap the `icon` string to try other styles:
 *   - "fluent-emoji-flat:cockroach"  (default — flat color)
 *   - "fluent-emoji:cockroach"       (3D color)
 *   - "noto:cockroach"               (Google Noto, glossy)
 *   - "twemoji:cockroach"            (Twitter Twemoji)
 *   - "openmoji:cockroach"           (OpenMoji)
 *
 * Icons are fetched once from api.iconify.design on first render
 * and then cached by the browser.
 */
type CockroachProps = {
  className?: string;
  style?: CSSProperties;
};

const COCKROACH_ICON = "fluent-emoji-flat:cockroach";

// Eagerly start fetching the icon JSON the moment this module loads, so the
// first cockroach the user summons appears instantly instead of after the
// API round-trip.
if (typeof window !== "undefined") {
  void loadIcon(COCKROACH_ICON).catch(() => {
    /* swallow — Icon falls back gracefully if the fetch fails */
  });
}

export function Cockroach({ className, style }: CockroachProps) {
  return (
    <Icon
      aria-hidden="true"
      className={className}
      icon={COCKROACH_ICON}
      style={style}
    />
  );
}
