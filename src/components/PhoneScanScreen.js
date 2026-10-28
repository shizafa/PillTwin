import { t } from "@/lib/i18n";

export default function PhoneScanScreen({ lang }) {
  return (
    <div className="flex h-full w-full flex-col bg-zinc-900">
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800" />

        {/* The "medicine box" being scanned */}
        <div className="absolute left-1/2 top-1/2 h-24 w-32 -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-100/90 shadow-lg">
          <div className="m-2 h-2 w-14 rounded-full bg-teal-500/70" />
          <div className="mx-2 mt-2 h-1.5 w-10 rounded-full bg-zinc-300" />
          <div className="mx-2 mt-1.5 h-1.5 w-16 rounded-full bg-zinc-300" />
        </div>

        {/* Corner brackets */}
        <div className="absolute left-10 top-14 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-teal-400" />
        <div className="absolute right-10 top-14 h-8 w-8 rounded-tr-lg border-r-2 border-t-2 border-teal-400" />
        <div className="absolute bottom-20 left-10 h-8 w-8 rounded-bl-lg border-b-2 border-l-2 border-teal-400" />
        <div className="absolute bottom-20 right-10 h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-teal-400" />

        {/* Sweeping scan line */}
        <div className="absolute inset-x-10 top-14 bottom-20 overflow-hidden">
          <div className="h-0.5 w-full origin-center animate-[scanline_2.2s_ease-in-out_infinite] bg-teal-400/90 shadow-[0_0_8px_2px_rgba(45,212,191,0.6)] motion-reduce:animate-none" />
        </div>
      </div>

      <div className="px-3 pb-4 pt-3">
        <div className="flex h-9 items-center justify-between rounded-full bg-white/95 ps-3 pe-1 shadow">
          <span className="truncate text-[11px] text-zinc-400">{t(lang, "searchPlaceholder")}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
