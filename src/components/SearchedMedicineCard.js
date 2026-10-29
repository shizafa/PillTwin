import Chip from "./Chip";
import RegistrationBadge from "./RegistrationBadge";
import { t } from "@/lib/i18n";
import { formatPrice } from "./resultsViewFormat";
import { pickCardColor } from "./cardColors";
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

export default function SearchedMedicineCard({ product, lang, scannedRegNo }) {
  const composition = compositionText(product);
  const price = formatPrice(product, lang);
  const color = pickCardColor(product.id);

  return (
    <div
      style={{ backgroundColor: color.bg, color: color.text }}
      className={`rounded-3xl p-7 shadow-[0_4px_8px_rgba(0,0,0,0.1),0_16px_40px_rgba(0,0,0,0.12)] sm:p-9 ${BODY_FONT}`}
    >
      <div className="flex items-start gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black/10 sm:h-20 sm:w-20">
          <PillIcon className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`text-3xl font-bold sm:text-4xl ${HEADING_FONT}`}>{product.brand}</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.strength ? <Chip>{product.strength}</Chip> : null}
            {product.dosage_form ? <Chip>{product.dosage_form}</Chip> : null}
            {product.manufacturer ? <Chip>{product.manufacturer}</Chip> : null}
          </div>
        </div>

        {price ? (
          <div className="shrink-0 text-end">
            <p className={`text-xl font-bold sm:text-2xl ${HEADING_FONT}`}>{price}</p>
          </div>
        ) : null}
      </div>

      {composition ? (
        <div className="mt-5 rounded-xl bg-black/10 px-4 py-3">
          <p className="text-sm">
            <span className="font-semibold">{t(lang, "contains")}:</span> {composition}
          </p>
        </div>
      ) : null}

      <RegistrationBadge product={product} lang={lang} scannedRegNo={scannedRegNo} />
    </div>
  );
}
