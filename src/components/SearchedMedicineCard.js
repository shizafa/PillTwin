import Chip from "./Chip";
import RegistrationBadge from "./RegistrationBadge";
import { t } from "@/lib/i18n";
import { formatPrice } from "./resultsViewFormat";
import { BODY_FONT, HEADING_FONT } from "./resultsViewTheme";

function PillIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="9" width="18" height="6" rx="3" fill="currentColor" opacity="0.15" />
      <path d="M12 9v6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="9" width="18" height="6" rx="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function compositionText(product) {
  if (product.composition) return product.composition;
  if (product.generic) return `${product.generic}${product.strength ? ` ${product.strength}` : ""}`;
  return null;
}

export default function SearchedMedicineCard({ product, lang }) {
  const composition = compositionText(product);
  const price = formatPrice(product, lang);

  return (
    <div className={`rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.05)] sm:p-6 ${BODY_FONT}`}>
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <PillIcon className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`text-2xl font-bold text-zinc-900 ${HEADING_FONT}`}>{product.brand}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.strength ? <Chip>{product.strength}</Chip> : null}
            {product.dosage_form ? <Chip>{product.dosage_form}</Chip> : null}
            {product.manufacturer ? <Chip>{product.manufacturer}</Chip> : null}
          </div>
        </div>

        <div className="shrink-0 text-end">
          {price ? (
            <p className={`text-lg font-bold text-zinc-900 ${HEADING_FONT}`}>{price}</p>
          ) : (
            <Chip tone="muted">{t(lang, "priceNotListed")}</Chip>
          )}
        </div>
      </div>

      {composition ? (
        <div className="mt-4 rounded-xl bg-teal-50/60 px-4 py-3">
          <p className="text-sm text-teal-900">
            <span className="font-semibold">{t(lang, "contains")}:</span> {composition}
          </p>
        </div>
      ) : null}

      <RegistrationBadge product={product} lang={lang} />
    </div>
  );
}
