"use client";

import { useEffect, useState } from "react";
import { LANGUAGES, t } from "@/lib/i18n";

export default function Navbar({ lang, onChangeLanguage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "bg-white/80 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="text-xl font-bold text-zinc-900">
          PillTwin
        </a>

        <div className="hidden items-center gap-6 sm:flex">
          <a href="#how-it-works" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
            {t(lang, "navHowItWorks")}
          </a>
          <a href="#about" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
            {t(lang, "navAbout")}
          </a>
          <div className="flex overflow-hidden rounded-lg border border-zinc-300">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => onChangeLanguage(language.code)}
                className={`px-3 py-1.5 text-sm ${
                  lang === language.code
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label={t(lang, "navMenu")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-900 sm:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen ? (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-3">
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-zinc-800"
            >
              {t(lang, "navHowItWorks")}
            </a>
            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-zinc-800"
            >
              {t(lang, "navAbout")}
            </a>
            <div className="flex overflow-hidden self-start rounded-lg border border-zinc-300">
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => onChangeLanguage(language.code)}
                  className={`px-3 py-1.5 text-sm ${
                    lang === language.code
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-700"
                  }`}
                >
                  {language.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
