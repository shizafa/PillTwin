"use client";

import SearchPill from "./SearchPill";
import { BODY_FONT } from "./resultsViewTheme";

export default function StickySearchBar({ lang, query, setQuery, onSearch, busy, fileInputRef }) {
  return (
    <div className={`sticky top-16 z-30 -mx-4 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md sm:-mx-6 sm:px-6 ${BODY_FONT}`}>
      <SearchPill
        lang={lang}
        query={query}
        setQuery={setQuery}
        onSearch={onSearch}
        busy={busy}
        fileInputRef={fileInputRef}
        size="sm"
        className="mx-auto max-w-xl"
      />
    </div>
  );
}
