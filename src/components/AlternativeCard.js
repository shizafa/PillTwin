import Chip from "./Chip";
import RegistrationBadge from "./RegistrationBadge";
import { t } from "@/lib/i18n";
import { formatPrice, savingsAmount } from "./resultsViewFormat";
import { BODY_FONT, HEADING_FONT } from "./resultsViewTheme";

export default function AlternativeCard({ product, searchedProduct, lang }) {
  const price = formatPrice(product, lang);
  const savings = savingsAmount(searchedProduct, product);

  return (
    <div
      className={`rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] motion-reduce:transition-none sm:p-5 ${BODY_FONT}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className={`text-lg font-bold text-zinc-900 ${HEADING_FONT}`}>{product.brand}</h4>
          {product.manufacturer ? <p className="text-sm text-zinc-500">{product.manufacturer}</p> : null}

          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.strength ? <Chip>{product.strength}</Chip> : null}
            {product.dosage_form ? <Chip>{product.dosage_form}</Chip> : null}
            <Chip tone="teal">{t(lang, "sameSalt")}</Chip>
          </div>
        </div>

        <div className="shrink-0 text-end">
          {price ? (
            <>
              <p className={`text-lg font-bold text-zinc-900 ${HEADING_FONT}`}>{price}</p>
              {savings ? (
                <p className="mt-1 inline-block rounded-full bg-teal-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {t(lang, "savingsBadge").replace("{amount}", savings)}
                </p>
              ) : null}
            </>
          ) : (
            <Chip tone="muted">{t(lang, "priceNotListed")}</Chip>
          )}
        </div>
      </div>

      <RegistrationBadge product={product} lang={lang} />
    </div>
  );
}
