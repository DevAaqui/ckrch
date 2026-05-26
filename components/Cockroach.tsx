"use client";

import type { CSSProperties } from "react";

type CockroachProps = {
  className?: string;
  style?: CSSProperties;
};

export function Cockroach({ className, style }: CockroachProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      style={style}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#1a0a02" strokeLinecap="round" strokeWidth="1.4">
        <path d="M 13 22 L 4 17" />
        <path d="M 13 28 L 3 28" />
        <path d="M 13 34 L 4 39" />
        <path d="M 35 22 L 44 17" />
        <path d="M 35 28 L 45 28" />
        <path d="M 35 34 L 44 39" />
      </g>
      <ellipse cx="24" cy="26" fill="#5a3014" rx="11" ry="14" />
      <ellipse
        cx="20"
        cy="20"
        fill="#7a4422"
        opacity="0.55"
        rx="2.2"
        ry="4.5"
      />
      <line
        stroke="#1a0a02"
        strokeWidth="0.9"
        x1="13"
        x2="35"
        y1="22"
        y2="22"
      />
      <line
        stroke="#1a0a02"
        strokeWidth="0.9"
        x1="13"
        x2="35"
        y1="30"
        y2="30"
      />
      <ellipse cx="24" cy="14" fill="#3a1c08" rx="6.2" ry="5" />
      <g stroke="#1a0a02" strokeLinecap="round" strokeWidth="1.4">
        <path d="M 21 11 Q 15 4 11 1.5" fill="none" />
        <path d="M 27 11 Q 33 4 37 1.5" fill="none" />
      </g>
      <circle cx="21.7" cy="13.2" fill="#000" r="0.9" />
      <circle cx="26.3" cy="13.2" fill="#000" r="0.9" />
    </svg>
  );
}
