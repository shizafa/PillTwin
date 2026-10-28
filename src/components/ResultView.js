import { t, warningText } from "@/lib/i18n";

function formatPrice(product, lang) {
  if (product.mrp === null || product.mrp === undefined) return t(lang, "priceNotAvailable");
  const perUnit = product.price_per_unit
    ? ` (Rs. ${Number(product.price_per_unit).toFixed(2)} ${t(lang, "perUnit")})`
    : "";
  return `Rs. ${Number(product.mrp).toFixed(2)}${perUnit}`;
}

function ProductCard({ product, highlight, lang }) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-zinc-900">{product.brand}</h3>
        <span className="text-sm text-zinc-700">{formatPrice(product, lang)}</span>
      </div>
      <p className="mt-1 text-sm text-zinc-600">
        {product.generic}
        {product.strength ? ` · ${product.strength}` : ""}
        {product.dosage_form ? ` · ${product.dosage_form}` : ""}
      </p>
      {product.manufacturer ? (
        <p className="mt-1 text-sm text-zinc-500">{product.manufacturer}</p>
      ) : null}
      {product.reg_no ? (
        <p className="mt-1 text-xs text-zinc-400">
          {t(lang, "regNo")} {product.reg_no}
        </p>
      ) : null}
    </div>
  );
}

function PackDetails({ pack, lang }) {
  const rows = [
    ["brand", pack.brand],
    ["generic", pack.generic],
    ["strength", pack.strength],
    ["form", pack.dosage_form],
    ["regNo", pack.reg_no],
    ["printedPrice", pack.mrp === null ? null : `Rs. ${pack.mrp}`],
    ["packSize", pack.pack_size],
    ["expiry", pack.expiry],
    ["batch", pack.batch],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");

  if (rows.length === 0) return null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <h2 className="text-sm font-semibold text-zinc-700">{t(lang, "whatWeRead")}</h2>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        {rows.map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs text-zinc-500">{t(lang, key)}</dt>
            <dd className="text-zinc-800">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ResultView({ result, lang }) {
  const { pack, product, alternatives = [], warnings = [] } = result;

  return (
    <div className="mt-8 space-y-6">
      {pack ? <PackDetails pack={pack} lang={lang} /> : null}

      {warnings.length > 0 ? (
        <div className="space-y-2">
          {warnings.map((warning) => (
            <p
              key={warning.code}
              className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
            >
              {warningText(lang, warning)}
            </p>
          ))}
        </div>
      ) : null}

      {product ? (
        <>
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {t(lang, "yourMedicine")}
            </h2>
            <ProductCard product={product} highlight lang={lang} />
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {t(lang, "sameSalt")}
              {alternatives.length > 0 ? ` (${alternatives.length})` : ""}
            </h2>
            {alternatives.length > 0 ? (
              <div className="space-y-2">
                {alternatives.map((alternative) => (
                  <ProductCard key={alternative.id} product={alternative} lang={lang} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-600">{t(lang, "noAlternatives")}</p>
            )}
          </section>
        </>
      ) : null}

      <p className="rounded-lg bg-zinc-100 p-3 text-sm font-medium text-zinc-800">
        {t(lang, "disclaimer")}
      </p>
      <p className="text-xs text-zinc-500">{t(lang, "dataNote")}</p>
    </div>
  );
}
