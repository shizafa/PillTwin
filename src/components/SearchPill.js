"use client";

import { t } from "@/lib/i18n";

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

const SIZES = {
  sm: { height: "h-12", button: "h-9 w-9", text: "text-sm" },
  lg: { height: "h-14", button: "h-11 w-11", text: "text-base" },
};

// Shared with StickySearchBar (results view) and the Footer's closing CTA —
// both reskinned with the teal accent from the redesign. Hero.js keeps its
// own inline version so it stays untouched outside the scope of that work.
export default function SearchPill({ lang, query, setQuery, onSearch, busy, fileInputRef, size = "sm", className = "" }) {
  const tokens = SIZES[size] ?? SIZES.sm;

  return (
    <form
      onSubmit={onSearch}
      className={`flex ${tokens.height} items-center rounded-full border border-zinc-200 bg-white ps-4 pe-1.5 shadow-sm transition-colors focus-within:border-teal-500 ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t(lang, "searchPlaceholder")}
        aria-label={t(lang, "searchPlaceholder")}
        className={`h-full flex-1 bg-transparent text-zinc-900 placeholder:text-zinc-400 focus:outline-none ${tokens.text}`}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label={t(lang, "scanButton")}
        className={`flex shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${tokens.button}`}
      >
        <CameraIcon />
      </button>
      <button
        type="submit"
        disabled={busy !== ""}
        aria-label={t(lang, "searchButton")}
        className={`ms-1 flex shrink-0 items-center justify-center rounded-full bg-teal-600 text-white disabled:bg-zinc-300 ${tokens.button}`}
      >
        <SearchIcon />
      </button>
    </form>
  );
}
