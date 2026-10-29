"use client";

import SearchPill from "./SearchPill";
import { LANGUAGES, t } from "@/lib/i18n";
import { BODY_FONT, HEADING_FONT } from "./resultsViewTheme";

function ShieldIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const LINKS = [
  { key: "navHowItWorks", href: "#how-it-works" },
  { key: "navAbout", href: "#about" },
  { key: "footerContact", href: "#contact" },
];

export default function Footer({ lang, onChangeLanguage, query, setQuery, onSearch, busy, fileInputRef }) {
  const year = new Date().getFullYear();

  return (
    <footer className={`relative overflow-hidden bg-zinc-50 ${BODY_FONT}`}>
      <div className="mx-auto flex max-w-7xl justify-end px-4 pt-6 sm:px-6">
        <div className="flex overflow-hidden rounded-full border border-zinc-300 bg-white">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => onChangeLanguage(language.code)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                lang === language.code ? "bg-teal-700 text-white" : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {language.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-14 pt-6 text-center sm:px-6">
        <h2 className={`text-3xl font-bold text-zinc-900 sm:text-4xl ${HEADING_FONT}`}>{t(lang, "tagline")}</h2>
        <p className="mt-3 text-zinc-600">{t(lang, "footerCtaSubtext")}</p>
        <div className="mt-6">
          <SearchPill
            lang={lang}
            query={query}
            setQuery={setQuery}
            onSearch={onSearch}
            busy={busy}
            fileInputRef={fileInputRef}
            size="lg"
            className="mx-auto max-w-xl"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className={`text-xl font-bold text-zinc-900 ${HEADING_FONT}`}>PillTwin</p>
            <p className="mt-1 max-w-xs text-sm text-zinc-600">{t(lang, "footerDescription")}</p>
          </div>

          <nav aria-label={t(lang, "footerLinksLabel")}>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1 sm:flex sm:gap-8">
              {LINKS.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="flex min-h-11 items-center text-sm font-medium text-zinc-700 underline-offset-4 hover:text-teal-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                  >
                    {t(lang, link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-teal-50 p-5">
          <ShieldIcon className="mt-0.5 h-6 w-6 shrink-0 text-teal-700" />
          <p className="text-base leading-relaxed text-teal-900">{t(lang, "footerSafetyNote")}</p>
        </div>
      </div>

      <div className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{t(lang, "dataNote")}</p>
          <p>
            © {year} PillTwin. {t(lang, "footerRights")}
          </p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className={`pointer-events-none -mb-8 hidden select-none whitespace-nowrap text-center text-[6rem] font-black leading-none text-zinc-900/5 sm:block sm:text-[8rem] lg:text-[11rem] ${HEADING_FONT}`}
      >
        PillTwin
      </p>
    </footer>
  );
}
