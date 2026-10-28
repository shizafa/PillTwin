"use client";

import { useRef, useState } from "react";
import ResultView from "@/components/ResultView";

const MAX_WIDTH = 1024;

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
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

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
      setError("Please type at least 2 characters.");
      return;
    }

    setBusy("search");
    setError("");
    setResult(null);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Search failed. Please try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setBusy("");
    }
  }

  async function handleScan() {
    if (!file) {
      setError("Please choose a photo of your medicine box first.");
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
        setError(data.error ?? "We could not read that photo. Please try a clearer picture.");
        return;
      }
      setResult(data);
    } catch {
      setError("Could not reach the server. Please check your connection.");
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

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">PillTwin</h1>
        <p className="mt-1 text-zinc-600">Find your medicine&apos;s twin.</p>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Scan your medicine box
        </h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={chooseFile}
          className="mt-2 block w-full cursor-pointer rounded-lg border border-zinc-300 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-white"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Choose a photo from your computer, or take one with your phone camera.
        </p>

        {preview ? (
          <div className="mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Selected medicine box"
              className="max-h-56 rounded-lg border border-zinc-200"
            />
            <button
              type="button"
              onClick={clearPhoto}
              className="mt-2 text-sm text-zinc-600 underline"
            >
              Remove photo
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleScan}
          disabled={busy !== "" || !file}
          className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white disabled:bg-zinc-300"
        >
          {busy === "scan" ? "Reading your box…" : "Scan medicine"}
        </button>

        {busy === "scan" ? (
          <p className="mt-2 text-sm text-zinc-600">
            This can take up to a minute. Please keep this page open.
          </p>
        ) : null}
      </section>

      <div className="my-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs uppercase tracking-wide text-zinc-400">or</span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Search by name
        </h2>
        <form onSubmit={handleSearch} className="mt-2 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Panadol or Paracetamol"
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 placeholder:text-zinc-400"
          />
          <button
            type="submit"
            disabled={busy !== ""}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white disabled:bg-zinc-300"
          >
            {busy === "search" ? "Searching…" : "Search"}
          </button>
        </form>
      </section>

      {error ? (
        <p className="mt-6 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {result ? <ResultView result={result} /> : null}
    </main>
  );
}
