import { t } from "@/lib/i18n";

// Shared price formatting for the results view (SearchedMedicineCard,
// AlternativeCard) so the "Rs. X (Rs. Y per unit)" shape stays consistent.
export function formatPrice(product, lang) {
  if (product.mrp === null || product.mrp === undefined) return null;
  const perUnit = product.price_per_unit
    ? ` (Rs. ${Number(product.price_per_unit).toFixed(2)} ${t(lang, "perUnit")})`
    : "";
  return `Rs. ${Number(product.mrp).toFixed(2)}${perUnit}`;
}

// Savings are only shown when both prices are real numbers and the
// alternative is actually cheaper — never inferred or estimated.
export function savingsAmount(searchedProduct, alternative) {
  if (searchedProduct?.mrp === null || searchedProduct?.mrp === undefined) return null;
  if (alternative?.mrp === null || alternative?.mrp === undefined) return null;
  const base = Number(searchedProduct.mrp);
  const candidate = Number(alternative.mrp);
  if (!Number.isFinite(base) || !Number.isFinite(candidate)) return null;
  const diff = Math.round(base - candidate);
  return diff > 0 ? diff : null;
}
