import { getSupabase } from "./supabase.js";
import { cleanText, normalizeStrength } from "./saltKey.js";

export const DISCLAIMER = "Always ask your doctor or pharmacist before switching medicines.";
export const DATA_NOTE = "Data from DRAP's provisional registry; may contain errors.";

const PRODUCT_COLUMNS =
  "id, reg_no, brand, generic, strength, dosage_form, salt_key, manufacturer, composition, status, pack_size, mrp, price_per_unit, source, fetched_at";

export async function findProductByRegNo(regNo) {
  const value = cleanText(regNo);
  if (!value) return null;

  const { data, error } = await getSupabase().from("products")
    .select(PRODUCT_COLUMNS)
    .eq("reg_no", value)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function searchProducts(query, { limit = 50 } = {}) {
  const term = cleanText(query);
  if (!term) return [];

  const pattern = `%${term}%`;
  const [byBrand, byGeneric] = await Promise.all([
    getSupabase().from("products").select(PRODUCT_COLUMNS).ilike("brand", pattern).limit(limit),
    getSupabase().from("products").select(PRODUCT_COLUMNS).ilike("generic", pattern).limit(limit),
  ]);

  if (byBrand.error) throw new Error(byBrand.error.message);
  if (byGeneric.error) throw new Error(byGeneric.error.message);

  const merged = new Map();
  for (const row of [...(byBrand.data ?? []), ...(byGeneric.data ?? [])]) {
    merged.set(row.id, row);
  }
  return [...merged.values()];
}

export function pickBestMatch(products, query, strength) {
  const term = cleanText(query).toLowerCase();
  if (!term || products.length === 0) return null;

  const wantedStrength = normalizeStrength(strength);

  const scored = products.map((product) => {
    const brand = cleanText(product.brand).toLowerCase();
    const generic = cleanText(product.generic).toLowerCase();

    let score = 0;
    if (brand === term) score = 5;
    else if (brand.startsWith(term)) score = 4;
    else if (generic === term) score = 3;
    else if (generic.startsWith(term)) score = 2;
    else if (brand.includes(term) || generic.includes(term)) score = 1;

    if (wantedStrength && normalizeStrength(product.strength) === wantedStrength) {
      score += 2;
    }
    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].score > 0 ? scored[0].product : null;
}

export async function findAlternatives(product) {
  if (!product?.salt_key) return [];

  let query = getSupabase().from("products")
    .select(PRODUCT_COLUMNS)
    .eq("salt_key", product.salt_key)
    .neq("id", product.id);

  if (product.dosage_form) {
    query = query.eq("dosage_form", product.dosage_form);
  }

  const { data, error } = await query.order("price_per_unit", {
    ascending: true,
    nullsFirst: false,
  });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function findProductFromPack(pack) {
  if (pack?.reg_no) {
    const byRegNo = await findProductByRegNo(pack.reg_no);
    if (byRegNo) return byRegNo;
  }

  for (const name of [pack?.brand, pack?.generic]) {
    if (!name) continue;
    const match = pickBestMatch(await searchProducts(name), name, pack?.strength);
    if (match) return match;
  }

  return null;
}

const EXPIRY_WARNING_DAYS = 90;

const MONTH_NAMES = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7,
  sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

function toFullYear(year) {
  if (year >= 100) return year;
  return year >= 70 ? 1900 + year : 2000 + year;
}

// Boxes only print a month (and sometimes a day) of expiry, so we treat the
// pack as good through the last moment of the printed month/day.
export function parseExpiryDate(text) {
  const value = cleanText(text);
  if (!value) return null;

  const monthName = value.match(/([a-zA-Z]+)[.\s]+(\d{4}|\d{2})/);
  if (monthName) {
    const month = MONTH_NAMES[monthName[1].toLowerCase()];
    if (month !== undefined) {
      return new Date(toFullYear(Number.parseInt(monthName[2], 10)), month + 1, 0, 23, 59, 59);
    }
  }

  const parts = value.split(/[/\-.]/).map((part) => part.trim()).filter(Boolean);
  if (parts.length === 2) {
    const [a, b] = parts.map(Number);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    const [month, year] = a > 12 ? [b, a] : [a, b];
    if (month < 1 || month > 12) return null;
    return new Date(toFullYear(year), month, 0, 23, 59, 59);
  }
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    if (![day, month, year].every(Number.isFinite)) return null;
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return new Date(toFullYear(year), month - 1, day, 23, 59, 59);
  }

  return null;
}

// Returns "EXPIRED", "EXPIRING_SOON", or null (unreadable or far from expiry
// — never guess at a format we don't recognize).
export function checkExpiry(expiryText) {
  const expiryDate = parseExpiryDate(expiryText);
  if (!expiryDate) return null;

  const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return "EXPIRED";
  if (daysLeft <= EXPIRY_WARNING_DAYS) return "EXPIRING_SOON";
  return null;
}

export function buildWarnings({ product, regNo, liveLookupUnavailable = false, expiry = null } = {}) {
  const warnings = [];

  if (!product) {
    warnings.push({
      code: "PRODUCT_NOT_FOUND",
      message: "We could not find this medicine in our records. Please verify with your pharmacist.",
    });
  }

  if (regNo && cleanText(product?.reg_no).toLowerCase() !== cleanText(regNo).toLowerCase()) {
    warnings.push({
      code: "REGISTRATION_NOT_FOUND",
      message: `Registration number ${cleanText(regNo)} was not found in DRAP's registry. Please verify this pack with your pharmacist.`,
      params: { regNo: cleanText(regNo) },
    });
  }

  const status = cleanText(product?.status);
  if (status && status.toLowerCase() !== "active") {
    warnings.push({
      code: "STATUS_NOT_ACTIVE",
      message: `DRAP lists this medicine's registration as "${status}", not Active. Please verify with your pharmacist.`,
      params: { status },
    });
  }

  const expiryStatus = checkExpiry(expiry);
  if (expiryStatus === "EXPIRED") {
    warnings.push({
      code: "EXPIRED",
      message: `This pack's printed expiry date (${cleanText(expiry)}) has passed. Please do not use it — ask your pharmacist for a replacement.`,
      params: { expiry: cleanText(expiry) },
    });
  } else if (expiryStatus === "EXPIRING_SOON") {
    warnings.push({
      code: "EXPIRING_SOON",
      message: `This pack is close to its printed expiry date (${cleanText(expiry)}). Please check the date before using it.`,
      params: { expiry: cleanText(expiry) },
    });
  }

  if (liveLookupUnavailable) {
    warnings.push({
      code: "LIVE_LOOKUP_UNAVAILABLE",
      message: "Live DRAP lookup is unavailable right now, so these results come from our saved data only.",
    });
  }

  return warnings;
}
