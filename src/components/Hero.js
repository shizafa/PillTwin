"use client";

import { t } from "@/lib/i18n";

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export default function Hero({
  lang,
  query,
  setQuery,
  onSearch,
  fileInputRef,
  onChooseFile,
  preview,
  onScan,
  onClearPhoto,
  busy,
}) {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col px-4 pb-14 pt-32 sm:min-h-[680px] sm:px-6 sm:pb-20">
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover motion-reduce:hidden"
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <h1 className="relative z-10 max-w-xs text-balance text-start text-2xl font-bold text-zinc-900 sm:max-w-md sm:text-4xl">
          {t(lang, "tagline")}
        </h1>

        <div className="relative z-10 mx-auto mt-auto w-full max-w-xl">
          <form
            onSubmit={onSearch}
            className="flex h-14 items-center rounded-full border border-zinc-200 bg-white ps-5 pe-2 shadow-lg transition-colors focus-within:border-blue-500"
          >
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t(lang, "searchPlaceholder")}
              aria-label={t(lang, "searchPlaceholder")}
              className="h-full flex-1 bg-transparent text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label={t(lang, "scanButton")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <CameraIcon />
            </button>
            <button
              type="submit"
              disabled={busy !== ""}
              aria-label={t(lang, "searchButton")}
              className="ms-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white disabled:bg-zinc-300"
            >
              <SearchIcon />
            </button>
          </form>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onChooseFile}
            className="hidden"
          />

          <p className="mt-3 text-center text-sm text-zinc-600">{t(lang, "heroHelper")}</p>

          {preview ? (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onScan}
                  disabled={busy !== ""}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:bg-zinc-300"
                >
                  {busy === "scan" ? t(lang, "scanning") : t(lang, "scanButton")}
                </button>
                <button type="button" onClick={onClearPhoto} className="text-xs text-zinc-500 underline">
                  {t(lang, "removePhoto")}
                </button>
              </div>
            </div>
          ) : null}

          {busy === "scan" ? (
            <p className="mt-2 text-center text-sm text-zinc-600">{t(lang, "scanWait")}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
