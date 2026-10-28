import { t } from "@/lib/i18n";

function SearchScanIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 19l-4.3-4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M15.5 6.5h1.6l1.1-1.6h3l1.1 1.6h1.2a.8.8 0 0 1 .8.8v6a.8.8 0 0 1-.8.8h-7.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

function CompareIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="7" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="8" width="7" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 8h2M5.5 11h2M16.5 12h2M16.5 15h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STEPS = [
  { key: "step1", Icon: SearchScanIcon, bg: "bg-blue-50" },
  { key: "step2", Icon: CompareIcon, bg: "bg-emerald-50" },
  { key: "step3", Icon: CheckIcon, bg: "bg-amber-50" },
];

export default function HowItWorks({ lang }) {
  return (
    <section id="how-it-works" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
          {t(lang, "navHowItWorks")}
        </h2>

        <div className="mt-14 flex flex-col gap-16">
          {STEPS.map((step, index) => (
            <div
              key={step.key}
              className={`flex flex-col items-center gap-8 text-center sm:gap-12 sm:text-start ${
                index % 2 === 1 ? "sm:flex-row-reverse" : "sm:flex-row"
              }`}
            >
              <div
                className={`flex h-40 w-40 shrink-0 items-center justify-center rounded-3xl sm:h-48 sm:w-48 ${step.bg}`}
              >
                <step.Icon className="h-16 w-16 text-zinc-700 sm:h-20 sm:w-20" />
              </div>
              <div className="max-w-md">
                <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                <h3 className="mt-1 text-xl font-bold text-zinc-900 sm:text-2xl">
                  {t(lang, `${step.key}Heading`)}
                </h3>
                <p className="mt-2 text-zinc-600">{t(lang, `${step.key}Text`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
