"use client";

import { Icon, loadIcon } from "@iconify/react";
import type { CSSProperties } from "react";

/**
 * Renders a glossy cockroach SVG via Iconify (Noto emoji set).
 * Darkening / shine tweaks live on `.roach-glyph` in globals.css.
 *
 * Swap the `icon` string to try other styles:
 *   - "noto:cockroach"               (default — glossy)
 *   - "fluent-emoji:cockroach"       (3D color)
 *   - "fluent-emoji-flat:cockroach"  (flat, low gloss)
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

const COCKROACH_ICON = "noto:cockroach";

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
