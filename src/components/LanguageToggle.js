"use client";

import { useId } from "react";
import { t } from "@/lib/i18n";

const TRACK_WIDTH = 108;
const KNOB_SIZE = 32;
const TRACK_PAD = 4;
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - TRACK_PAD;

function UKFlag({ className }) {
  const clipId = useId();
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <circle cx="20" cy="20" r="20" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="40" height="40" fill="#012169" />
        <path d="M0 0L40 40M40 0L0 40" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M0 0L40 40M40 0L0 40" stroke="#C8102E" strokeWidth="3" />
        <path d="M20 0V40M0 20H40" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M20 0V40M0 20H40" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

function PakistanFlag({ className }) {
  const clipId = useId();
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <circle cx="20" cy="20" r="20" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="40" height="40" fill="#01411C" />
        <rect width="10" height="40" fill="#FFFFFF" />
        <circle cx="25" cy="20" r="7" fill="#FFFFFF" />
        <circle cx="28" cy="20" r="7" fill="#01411C" />
        <polygon
          points="29,10 30.3,13.8 34.3,13.8 31,16.1 32.3,19.9 29,17.6 25.7,19.9 27,16.1 23.7,13.8 27.7,13.8"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}

const FLAGS = { en: UKFlag, ur: PakistanFlag };
const LABELS = { en: "EN", ur: "اردو" };

// Single sliding neumorphic switch (not two buttons) — the flag knob docks
// to whichever end matches the active language, and the code label sits in
// the space left over on the other side.
export default function LanguageToggle({ lang, onChange, className = "" }) {
  const isUr = lang === "ur";
  const other = isUr ? "en" : "ur";
  const Flag = FLAGS[lang];

  return (
    <button
      type="button"
      onClick={() => onChange(other)}
      aria-label={t(lang, "switchLanguage")}
      style={{ width: TRACK_WIDTH }}
      className={`relative flex h-10 shrink-0 items-center rounded-full bg-zinc-100 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.12),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${className}`}
    >
      <span
        className={`block w-full text-sm font-bold text-zinc-600 ${
          isUr ? "pl-3 pr-10 text-left" : "pl-10 pr-3 text-right"
        }`}
      >
        {LABELS[lang]}
      </span>
      <span
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          top: TRACK_PAD,
          left: isUr ? KNOB_TRAVEL : TRACK_PAD,
          transition: "left 300ms ease-out",
        }}
        className="absolute overflow-hidden rounded-full shadow-[1px_2px_4px_rgba(0,0,0,0.3)]"
      >
        <Flag className="h-full w-full" />
      </span>
    </button>
  );
}
