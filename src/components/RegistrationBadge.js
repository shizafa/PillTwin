import { t } from "@/lib/i18n";
import { cleanText } from "@/lib/saltKey";
import { BODY_FONT } from "./resultsViewTheme";

function cleanRegNo(value) {
  return cleanText(value).toLowerCase();
}

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.15" />
      <path d="M6.5 10.3l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.15" />
      <path d="M10 6v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="13.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

function InfoIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.12" />
      <path d="M10 9v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="6.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

function sourceLabel(lang, source) {
  if (source === "manual") return t(lang, "sourceManual");
  return t(lang, "sourceDrap");
}

function formatDate(lang, isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(lang === "ur" ? "ur-PK" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Three states, matched to how confident we actually are:
// - registered: we have a reg no. and DRAP marks it Active, AND (when the
//   medicine came from a scan) that reg no. actually matches what's printed
//   on the box — a product found via brand/generic fallback with its own,
//   different reg no. never counts as "verified".
// - notRegistered (red): DRAP explicitly lists a non-Active status — only
//   shown when the data says so, never inferred.
// - notVerified (neutral grey): we simply have no DRAP registration number
//   to check against, which is not the same as DRAP rejecting it.
export default function RegistrationBadge({ product, lang, scannedRegNo }) {
  const status = (product.status || "").trim().toLowerCase();
  const hasRegNo = Boolean(product.reg_no);
  const regNoMatchesScan =
    !scannedRegNo || cleanRegNo(product.reg_no) === cleanRegNo(scannedRegNo);
  const registered = hasRegNo && status === "active" && regNoMatchesScan;
  const notRegistered = hasRegNo && status && status !== "active" && regNoMatchesScan;

  let tone = "bg-zinc-100 text-zinc-700 border-zinc-200";
  let Icon = InfoIcon;
  let label = t(lang, "badgeNotVerified");
  let explanation = t(lang, "badgeNotVerifiedExplain");

  if (registered) {
    tone = "bg-teal-50 text-teal-800 border-teal-200";
    Icon = CheckIcon;
    label = t(lang, "badgeRegistered");
    explanation = t(lang, "badgeRegisteredExplain");
  } else if (notRegistered) {
    tone = "bg-red-50 text-red-700 border-red-200";
    Icon = AlertIcon;
    label = t(lang, "badgeNotRegistered");
    explanation = t(lang, "badgeNotRegisteredExplain").replace("{status}", product.status);
  }

  const date = formatDate(lang, product.fetched_at);

  return (
    <div className={`mt-3 ${BODY_FONT}`}>
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
        {explanation}
        <br />
        {sourceLabel(lang, product.source)}
        {date ? ` · ${t(lang, "checkedOn")} ${date}` : ""}
      </p>
    </div>
  );
}
