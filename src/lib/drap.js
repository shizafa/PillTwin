import {
  cleanText,
  extractPackSize,
  extractStrength,
  makeSaltKey,
  normalizeDosageForm,
} from "./saltKey.js";

const BASE_URL = "https://eapp.dra.gov.pk";
const PRODUCT_VIEW_URL = `${BASE_URL}/productView.php`;
const DEFAULT_TIMEOUT_MS = 8000;

const REQUEST_HEADERS = {
  Referer: `${BASE_URL}/WebProductIndex.php`,
  "X-Requested-With": "XMLHttpRequest",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
};

async function drapRequest(url, { method = "GET", body, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      body,
      signal: controller.signal,
      headers: body
        ? { ...REQUEST_HEADERS, "Content-Type": "application/x-www-form-urlencoded" }
        : REQUEST_HEADERS,
    });
    if (!response.ok) {
      throw new Error(`DRAP responded with HTTP ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`DRAP did not respond within ${timeoutMs}ms`);
    }
    const code = error.cause?.code || error.code;
    throw new Error(code ? `${error.message} (${code})` : error.message);
  } finally {
    clearTimeout(timer);
  }
}

export async function findGenerics(term, options) {
  const url = `${PRODUCT_VIEW_URL}?searchGeneric=${encodeURIComponent(term)}&_type=${encodeURIComponent("generic name")}`;
  const raw = await drapRequest(url, options);
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed?.results) ? parsed.results : [];
}

export async function listProductsByGeneric(masterId, options) {
  const body = new URLSearchParams({ masterID: masterId }).toString();
  const raw = await drapRequest(PRODUCT_VIEW_URL, { ...options, method: "POST", body });
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function fetchProductDetailHtml(regNo, options) {
  const body = new URLSearchParams({ webRegNo: regNo }).toString();
  return drapRequest(PRODUCT_VIEW_URL, { ...options, method: "POST", body });
}

const DETAIL_LABELS = {
  "product name": "productName",
  "registration no": "regNo",
  "registration no.": "regNo",
  "registration date": "registrationDate",
  "company name": "companyName",
  "registration status": "status",
  "route of admin": "routeOfAdmin",
  "route of administration": "routeOfAdmin",
  "dosage form": "dosageForm",
  "label claim": "labelClaim",
  composition: "composition",
  "pack size": "packSize",
  "pack size(s)": "packSize",
  "pack sizes": "packSize",
};

function normalizeLabel(value) {
  return cleanText(value).toLowerCase().replace(/[:：]\s*$/, "");
}

export function parseProductDetailHtml(html) {
  const withoutScripts = String(html ?? "").replace(
    /<(script|style)[\s\S]*?<\/\1>/gi,
    " "
  );
  const cells = withoutScripts
    .split(/<[^>]+>/)
    .map((cell) => cleanText(cell))
    .filter(Boolean);

  const fields = {};
  for (let i = 0; i < cells.length - 1; i++) {
    const label = normalizeLabel(cells[i]);
    const key = DETAIL_LABELS[label];
    if (!key || key in fields) continue;

    const next = cells[i + 1];
    if (DETAIL_LABELS[normalizeLabel(next)]) continue;
    fields[key] = next;
  }
  return fields;
}

export function buildProductRecord({ listItem, detailFields, source = "drap_scrape" }) {
  const generic = cleanText(listItem?.genericName ?? detailFields?.composition ?? "");
  const strength = extractStrength(
    detailFields?.labelClaim || detailFields?.composition || ""
  );

  return {
    reg_no: cleanText(detailFields?.regNo || listItem?.registrationNo || "") || null,
    brand: cleanText(listItem?.approvedName || detailFields?.productName || ""),
    generic,
    strength: strength || null,
    dosage_form: normalizeDosageForm(detailFields?.dosageForm || "") || null,
    salt_key: makeSaltKey(listItem?.genericName ?? generic, strength),
    manufacturer: cleanText(listItem?.companyName || detailFields?.companyName || "") || null,
    composition: cleanText(detailFields?.composition || "") || null,
    status: cleanText(detailFields?.status || "") || null,
    pack_size: extractPackSize(detailFields?.packSize || ""),
    mrp: null,
    source,
  };
}

export function matchesWholeWord(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(cleanText(text));
}
