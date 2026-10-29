"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";
import { CARD_COLORS } from "./cardColors";
import { BODY_FONT, HEADING_FONT } from "./resultsViewTheme";

const DRAWER_COLOR = CARD_COLORS[5]; // Electric purple

const DRAWER_LINKS = [
  { key: "navHowItWorks", href: "#how-it-works" },
  { key: "navAbout", href: "#about" },
];

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

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${BODY_FONT} ${
        scrolled
          ? "bg-white/80 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className={`text-xl font-bold text-zinc-900 ${HEADING_FONT}`}>
          PillTwin
        </a>

        <div className="hidden items-center gap-6 sm:flex">
          <a href="#how-it-works" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
            {t(lang, "navHowItWorks")}
          </a>
          <a href="#about" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
            {t(lang, "navAbout")}
          </a>
          <LanguageToggle lang={lang} onChange={onChangeLanguage} />
        </div>

        <button
          type="button"
          aria-label={t(lang, "navMenu")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-900 sm:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </nav>

      {/* Backdrop — stays mounted so it can fade out on close, not just pop away. */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out sm:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Side drawer — slides in/out via transform, always mounted for a smooth close. */}
      <div
        role="dialog"
        aria-modal="true"
        style={{ backgroundColor: DRAWER_COLOR.bg, color: DRAWER_COLOR.text }}
        className={`fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-xs flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className={`text-xl font-bold ${HEADING_FONT}`}>PillTwin</span>
          <button
            type="button"
            aria-label={t(lang, "navMenu")}
            onClick={() => setMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/10"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className={`flex flex-1 flex-col px-2 py-4 ${BODY_FONT}`}>
          {DRAWER_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-4 text-lg font-semibold transition-colors hover:bg-black/10"
            >
              {t(lang, link.key)}
            </a>
          ))}

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-current/20 px-4 pt-6">
            <span className="text-sm font-medium opacity-80">{t(lang, "switchLanguage")}</span>
            <LanguageToggle lang={lang} onChange={onChangeLanguage} />
          </div>
        </div>
      </div>
    </header>
  );
}
