"use client";

import { useState } from "react";
import AlternativeCard from "./AlternativeCard";
import SearchedMedicineCard from "./SearchedMedicineCard";
import StickySearchBar from "./StickySearchBar";
import { t, warningText } from "@/lib/i18n";
import { BODY_FONT, HEADING_FONT } from "./resultsViewTheme";

// REGISTRATION_NOT_FOUND / STATUS_NOT_ACTIVE are now communicated calmly by
// RegistrationBadge on the medicine card itself, so they're not repeated
// here as a second, more alarming banner.
const BANNER_WARNING_CODES = new Set([
  "PRODUCT_NOT_FOUND",
  "LIVE_LOOKUP_UNAVAILABLE",
  "EXPIRED",
  "EXPIRING_SOON",
]);

const BANNER_TONE = {
  EXPIRED: "bg-red-50 text-red-900",
  EXPIRING_SOON: "bg-amber-50 text-amber-900",
};
const DEFAULT_BANNER_TONE = "bg-sky-50 text-sky-900";

const ALTERNATIVES_PAGE_SIZE = 5;

function AlternativesPager({ lang, page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t(lang, "paginationPrev")}
      </button>
      <p className="text-sm text-zinc-500">
        {t(lang, "paginationPage").replace("{current}", page).replace("{total}", totalPages)}
      </p>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t(lang, "paginationNext")}
      </button>
    </div>
  );
}

function PackDetails({ pack, lang }) {
  const rows = [
    ["brand", pack.brand],
    ["generic", pack.generic],
    ["strength", pack.strength],
    ["form", pack.dosage_form],
    ["regNo", pack.reg_no],
    ["printedPrice", pack.mrp === null ? null : `Rs. ${pack.mrp}`],
    ["packSize", pack.pack_size],
    ["expiry", pack.expiry],
    ["batch", pack.batch],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");

  if (rows.length === 0) return null;

  return (
    <div className={`rounded-2xl bg-zinc-50 p-5 ${BODY_FONT}`}>
      <h2 className={`text-sm font-semibold text-zinc-700 ${HEADING_FONT}`}>{t(lang, "whatWeRead")}</h2>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        {rows.map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs text-zinc-500">{t(lang, key)}</dt>
            <dd className="text-zinc-800">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ResultView({ result, lang, query, setQuery, onSearch, busy, fileInputRef }) {
  const { pack, product, alternatives = [], warnings = [] } = result;
  const bannerWarnings = warnings.filter((warning) => BANNER_WARNING_CODES.has(warning.code));
  const anyPriceMissing = alternatives.some(
    (alternative) => alternative.mrp === null || alternative.mrp === undefined
  );

  // Reset to page 1 whenever a new search/scan hands us a new alternatives
  // list, without a useEffect (React's recommended "adjust state during
  // render" pattern for resetting state when a prop changes).
  const [page, setPage] = useState(1);
  const [lastAlternatives, setLastAlternatives] = useState(alternatives);
  if (alternatives !== lastAlternatives) {
    setLastAlternatives(alternatives);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(alternatives.length / ALTERNATIVES_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedAlternatives = alternatives.slice(
    (currentPage - 1) * ALTERNATIVES_PAGE_SIZE,
    currentPage * ALTERNATIVES_PAGE_SIZE
  );

  return (
    <div className={BODY_FONT}>
      <StickySearchBar
        lang={lang}
        query={query}
        setQuery={setQuery}
        onSearch={onSearch}
        busy={busy}
        fileInputRef={fileInputRef}
      />

      <div className="mt-6 space-y-6">
        {pack ? <PackDetails pack={pack} lang={lang} /> : null}

        {bannerWarnings.length > 0 ? (
          <div className="space-y-2">
            {bannerWarnings.map((warning) => (
              <p
                key={warning.code}
                className={`rounded-2xl p-4 text-sm ${BANNER_TONE[warning.code] ?? DEFAULT_BANNER_TONE}`}
              >
                {warningText(lang, warning)}
              </p>
            ))}
          </div>
        ) : null}

        {product ? (
          <>
            <section>
              <h2 className={`mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 ${HEADING_FONT}`}>
                {t(lang, "yourMedicine")}
              </h2>
              <SearchedMedicineCard product={product} lang={lang} scannedRegNo={pack?.reg_no} />
            </section>

            <section>
              <h2 className={`mb-3 text-xl font-bold text-zinc-900 ${HEADING_FONT}`}>
                {t(lang, "sectionAlternatives")}
                {alternatives.length > 0 ? ` (${alternatives.length})` : ""}
              </h2>

              {alternatives.length > 0 ? (
                <div className="space-y-3">
                  {anyPriceMissing ? (
                    <p className="text-sm text-zinc-500">{t(lang, "pricesHelperNote")}</p>
                  ) : null}
                  {pagedAlternatives.map((alternative) => (
                    <AlternativeCard
                      key={alternative.id}
                      product={alternative}
                      searchedProduct={product}
                      lang={lang}
                    />
                  ))}
                  <AlternativesPager
                    lang={lang}
                    page={currentPage}
                    totalPages={totalPages}
                    onChange={setPage}
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-600">
                  {t(lang, "noAlternatives")}
                </div>
              )}
            </section>
          </>
        ) : null}

        <p className="rounded-2xl bg-zinc-100 p-4 text-sm font-medium text-zinc-800">
          {t(lang, "disclaimer")}
        </p>
        <p className="text-xs text-zinc-500">{t(lang, "dataNote")}</p>
      </div>
    </div>
  );
}
