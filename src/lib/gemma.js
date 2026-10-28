import { GoogleGenAI } from "@google/genai";
import { cleanText } from "./saltKey.js";

// gemma-4-31b-it fails with a 500 on roughly 3 of 4 image requests; the A4B
// variant answered 4 of 4 in the same test, so it is the one we ship.
export const GEMMA_MODEL = "gemma-4-26b-a4b-it";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;
const REQUEST_TIMEOUT_MS = 45000;

const PACK_FIELDS = [
  "brand",
  "generic",
  "strength",
  "dosage_form",
  "reg_no",
  "mrp",
  "pack_size",
  "expiry",
  "batch",
];

const PACK_PROMPT = `You are reading a photograph of a medicine box from Pakistan.
Return ONLY a JSON object, with no explanation and no extra text, containing exactly these keys:
brand, generic, strength, dosage_form, reg_no, mrp, pack_size, expiry, batch

Rules:
- Use null for any value you cannot clearly read. Never guess.
- brand: the product name printed largest on the box.
- generic: the active ingredient or ingredients, for example "Paracetamol" or "Amoxicillin + Clavulanic Acid".
- strength: for example "500mg" or "500/125mg".
- dosage_form: for example "tablet", "capsule", "syrup", "injection".
- reg_no: the DRAP registration number printed on the box.
- mrp: the printed maximum retail price as a number only, with no currency symbol.
- pack_size: how many units are in the pack, as a number.
- expiry: the expiry date as printed, for example "06/2027".
- batch: the batch number as printed.`;

const NULL_WORDS = new Set(["null", "n/a", "na", "none", "unknown", "not visible", "-"]);

let client = null;

function getClient() {
  if (client) return client;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in .env.local");
  }

  client = new GoogleGenAI({ apiKey });
  return client;
}

export function extractJsonObject(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;

  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

// Gemma returns its reasoning as a part flagged `thought`; only the plain
// text parts are the answer.
function answerText(response) {
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((part) => !part.thought && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}

function toText(value) {
  if (value === null || value === undefined) return null;
  const text = cleanText(value);
  if (!text || NULL_WORDS.has(text.toLowerCase())) return null;
  return text;
}

function toNumber(value) {
  const text = toText(value);
  if (text === null) return null;
  // Match the first number rather than stripping characters: "Rs. 150.00"
  // would otherwise keep the dot from "Rs." and parse as 0.15.
  const match = text.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const number = Number.parseFloat(match[0]);
  return Number.isFinite(number) ? number : null;
}

export function normalizePack(raw) {
  const pack = {};
  for (const field of PACK_FIELDS) {
    pack[field] = toText(raw?.[field]);
  }
  pack.mrp = toNumber(raw?.mrp);
  pack.pack_size = toNumber(raw?.pack_size);
  return pack;
}

function isTransient(error) {
  const message = String(error?.message ?? "");
  return /\b(500|503|429)\b|INTERNAL|UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(message);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function readPack(base64Image, mimeType = "image/jpeg") {
  if (!base64Image) {
    throw new Error("No image data was provided.");
  }

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await getClient().models.generateContent({
        model: GEMMA_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              { text: PACK_PROMPT },
              { inlineData: { data: base64Image, mimeType } },
            ],
          },
        ],
        config: { httpOptions: { timeout: REQUEST_TIMEOUT_MS } },
      });

      const text = answerText(response);
      const parsed = extractJsonObject(text);

      if (!parsed) {
        throw new Error("Gemma did not return readable JSON.");
      }
      return normalizePack(parsed);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS && isTransient(error)) {
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }
      break;
    }
  }

  throw new Error(`Could not read the medicine box: ${lastError?.message ?? "unknown error"}`);
}
