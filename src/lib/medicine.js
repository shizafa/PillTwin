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

export function buildWarnings({ product, regNo, liveLookupUnavailable = false } = {}) {
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

  if (liveLookupUnavailable) {
    warnings.push({
      code: "LIVE_LOOKUP_UNAVAILABLE",
      message: "Live DRAP lookup is unavailable right now, so these results come from our saved data only.",
    });
  }

  return warnings;
}
