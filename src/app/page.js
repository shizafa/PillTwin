"use client";

import { useEffect, useRef, useState } from "react";
import ResultView from "@/components/ResultView";
import { LANGUAGES, dirFor, t } from "@/lib/i18n";

const MAX_WIDTH = 1024;
const LANG_STORAGE_KEY = "pilltwin-lang";

async function shrinkImage(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    return blob ?? file;
  } catch {
    // Formats the browser cannot decode (some HEIC photos) go up as they are.
    return file;
  }
}

export default function Home() {
  const [lang, setLang] = useState("en");
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved && LANGUAGES.some((language) => language.code === saved)) setLang(saved);
    } catch {
      // Private browsing or blocked storage: English is fine.
    }
  }, []);

  function changeLanguage(code) {
    setLang(code);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, code);
    } catch {
      // Not being able to remember the choice is not worth an error.
    }
  }

  function chooseFile(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
    setResult(null);
  }

  async function handleSearch(event) {
    event.preventDefault();
    const term = query.trim();
    if (term.length < 2) {
      setError(t(lang, "errTooShort"));
      return;
    }

    setBusy("search");
    setError("");
    setResult(null);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      if (!response.ok) {
        setError(t(lang, "errSearch"));
        return;
      }
      setResult(data);
    } catch {
      setError(t(lang, "errNetwork"));
    } finally {
      setBusy("");
    }
  }

  async function handleScan() {
    if (!file) {
      setError(t(lang, "errNoPhoto"));
      return;
    }

    setBusy("scan");
    setError("");
    setResult(null);
    try {
      const shrunk = await shrinkImage(file);
      const formData = new FormData();
      formData.append("image", shrunk, "box.jpg");

      const response = await fetch("/api/scan", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) {
        setError(t(lang, "errScan"));
        return;
      }
      setResult(data);
    } catch {
      setError(t(lang, "errNetwork"));
    } finally {
      setBusy("");
    }
  }

  function clearPhoto() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const dir = dirFor(lang);

  return (
    <main dir={dir} lang={lang} className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">PillTwin</h1>
          <p className="mt-1 text-zinc-600">{t(lang, "tagline")}</p>
        </div>
        <div className="flex shrink-0 overflow-hidden rounded-lg border border-zinc-300">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => changeLanguage(language.code)}
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
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {t(lang, "scanHeading")}
        </h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={chooseFile}
          className="mt-2 block w-full cursor-pointer rounded-lg border border-zinc-300 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-white"
        />
        <p className="mt-1 text-xs text-zinc-500">{t(lang, "fileHint")}</p>

        {preview ? (
          <div className="mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt=""
              className="max-h-56 rounded-lg border border-zinc-200"
            />
            <button
              type="button"
              onClick={clearPhoto}
              className="mt-2 text-sm text-zinc-600 underline"
            >
              {t(lang, "removePhoto")}
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleScan}
          disabled={busy !== "" || !file}
          className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white disabled:bg-zinc-300"
        >
          {busy === "scan" ? t(lang, "scanning") : t(lang, "scanButton")}
        </button>

        {busy === "scan" ? (
          <p className="mt-2 text-sm text-zinc-600">{t(lang, "scanWait")}</p>
        ) : null}
      </section>

      <div className="my-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs uppercase tracking-wide text-zinc-400">{t(lang, "or")}</span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {t(lang, "searchHeading")}
        </h2>
        <form onSubmit={handleSearch} className="mt-2 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(lang, "searchPlaceholder")}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 placeholder:text-zinc-400"
          />
          <button
            type="submit"
            disabled={busy !== ""}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white disabled:bg-zinc-300"
          >
            {busy === "search" ? t(lang, "searching") : t(lang, "searchButton")}
          </button>
        </form>
      </section>

      {error ? (
        <p className="mt-6 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {result ? <ResultView result={result} lang={lang} /> : null}
    </main>
  );
}
