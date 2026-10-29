"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollStage from "@/components/ScrollStage";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import ResultView from "@/components/ResultView";
import ResultSkeleton from "@/components/ResultSkeleton";
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
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
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
    <div id="top" dir={dir} lang={lang}>
      <Navbar lang={lang} onChangeLanguage={changeLanguage} />

      <Hero
        lang={lang}
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        fileInputRef={fileInputRef}
        onChooseFile={chooseFile}
        preview={preview}
        onScan={handleScan}
        onClearPhoto={clearPhoto}
        busy={busy}
      />

      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        {error ? (
          <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        {(busy === "search" || busy === "scan") && !result ? <ResultSkeleton lang={lang} /> : null}

        {result ? (
          <ResultView
            result={result}
            lang={lang}
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            busy={busy}
            fileInputRef={fileInputRef}
          />
        ) : null}
      </main>

      <ScrollStage lang={lang} />

      <HowItWorks lang={lang} />

      <Footer
        lang={lang}
        onChangeLanguage={changeLanguage}
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        busy={busy}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}
