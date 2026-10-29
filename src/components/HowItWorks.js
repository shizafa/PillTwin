import { t } from "@/lib/i18n";
import { CARD_COLORS } from "./cardColors";
import { BODY_FONT, HEADING_FONT } from "./resultsViewTheme";

const STEPS = ["step1", "step2", "step3"];

// Each card sticks a little lower than the one before it, so as you scroll
// past, the next card slides up and stacks on top while the earlier ones
// stay pinned underneath, peeking out above it.
const STICKY_TOP_BASE = 88;
const STICKY_TOP_STEP = 24;

function StepCard({ lang, stepKey, index }) {
  const color = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div
      style={{ backgroundColor: color.bg, color: color.text }}
      className={`rounded-3xl p-7 shadow-[0_8px_16px_rgba(0,0,0,0.15),0_24px_48px_rgba(0,0,0,0.18)] sm:p-9 ${BODY_FONT}`}
    >
      <span aria-hidden="true" className="select-none text-[72px] font-black leading-none opacity-20 sm:text-[96px]">
        {index + 1}
      </span>
      <h3 className={`-mt-4 text-2xl font-bold sm:text-3xl ${HEADING_FONT}`}>{t(lang, `${stepKey}Heading`)}</h3>
      <p className="mt-3 max-w-sm opacity-90">{t(lang, `${stepKey}Text`)}</p>
    </div>
  );
}

export default function HowItWorks({ lang }) {
  return (
    <div id="how-it-works" className={`bg-white ${BODY_FONT}`}>
      <h2 className={`mx-auto max-w-6xl px-4 pt-16 text-center text-2xl font-bold text-zinc-900 sm:px-6 sm:text-3xl ${HEADING_FONT}`}>
        {t(lang, "navHowItWorks")}
      </h2>

      <div className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        {STEPS.map((stepKey, index) => (
          <div key={stepKey} className="min-h-[85vh] pt-10 first:pt-16">
            <div
              className="sticky"
              style={{ top: `${STICKY_TOP_BASE + index * STICKY_TOP_STEP}px`, zIndex: index + 1 }}
            >
              <StepCard lang={lang} stepKey={stepKey} index={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
