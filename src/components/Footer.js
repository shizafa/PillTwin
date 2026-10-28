"use client";

import { LANGUAGES, t } from "@/lib/i18n";

export default function Footer({ lang, onChangeLanguage }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-start">
          <div>
            <p className="text-lg font-bold text-zinc-900">PillTwin</p>
            <p className="mt-1 max-w-xs text-sm text-zinc-600">{t(lang, "footerDescription")}</p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:items-end">
            <div className="flex gap-5 text-sm font-medium text-zinc-700">
              <a href="#how-it-works" className="hover:text-zinc-900">
                {t(lang, "navHowItWorks")}
              </a>
              <a href="#about" className="hover:text-zinc-900">
                {t(lang, "navAbout")}
              </a>
              <a href="#contact" className="hover:text-zinc-900">
                {t(lang, "footerContact")}
              </a>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-zinc-300">
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => onChangeLanguage(language.code)}
                  className={`px-3 py-1.5 text-sm ${
                    lang === language.code
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {language.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-2 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 sm:text-start">
          <p className="font-medium text-zinc-700">{t(lang, "footerSafetyNote")}</p>
          <p>{t(lang, "dataNote")}</p>
          <p>
            © {year} PillTwin. {t(lang, "footerRights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
