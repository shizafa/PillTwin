export function cleanText(value) {
  return String(value ?? "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitIngredients(genericName) {
  return String(genericName ?? "")
    .split(/<br\s*\/?>/i)
    .flatMap((part) => part.split("+"))
    .map((part) => cleanText(part).toLowerCase())
    .filter(Boolean);
}

export function normalizeStrength(strength) {
  return cleanText(strength).toLowerCase().replace(/\s+/g, "");
}

export function normalizeDosageForm(dosageForm) {
  const cleaned = cleanText(dosageForm).toLowerCase();
  if (!cleaned) return "";
  return cleaned.replace(/s\b/g, "");
}

export function makeSaltKey(genericName, strength) {
  const ingredients = splitIngredients(genericName).sort();
  return `${ingredients.join("+")}|${normalizeStrength(strength)}`;
}

const STRENGTH_PATTERN =
  /(\d+(?:[.,]\d+)?)\s*(mg|mcg|µg|ug|g|ml|iu|%|meq)\b/gi;

export function extractStrength(text) {
  const source = cleanText(text).replace(/<br\s*\/?>/gi, " ");
  const matches = [...source.matchAll(STRENGTH_PATTERN)];
  if (matches.length === 0) return "";

  const parts = matches.map((match) => ({
    amount: match[1].replace(",", "."),
    unit: match[2].toLowerCase().replace("µg", "mcg").replace("ug", "mcg"),
  }));

  const deduped = [];
  for (const part of parts) {
    const last = deduped[deduped.length - 1];
    if (last && last.amount === part.amount && last.unit === part.unit) continue;
    deduped.push(part);
  }

  const allSameUnit = deduped.every((part) => part.unit === deduped[0].unit);
  if (allSameUnit) {
    return `${deduped.map((part) => part.amount).join("/")}${deduped[0].unit}`;
  }
  return deduped.map((part) => `${part.amount}${part.unit}`).join("/");
}

export function extractPackSize(text) {
  const match = cleanText(text).match(/(\d+)\s*(?:s\b|'s|tablets?|capsules?)?/i);
  if (!match) return null;
  const value = Number.parseInt(match[1], 10);
  return Number.isNaN(value) ? null : value;
}
