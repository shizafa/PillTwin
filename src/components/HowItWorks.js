"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import PhoneMockup from "./PhoneMockup";
import PhoneScanScreen from "./PhoneScanScreen";
import PhoneResultsScreen from "./PhoneResultsScreen";
import PhoneCheckScreen from "./PhoneCheckScreen";
import StepProgressDots from "./StepProgressDots";
import { t } from "@/lib/i18n";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { activeStepIndex, stepOpacity } from "./howItWorksMotion";

const STEPS = ["step1", "step2", "step3"];
const STATIC_PHONE = [PhoneScanScreen, PhoneResultsScreen, PhoneCheckScreen];

function StepText({ lang, stepKey, index, total, scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, (v) => stepOpacity(v, index, total, 0.3));

  return (
    <motion.div style={{ opacity }} className="flex min-h-[90vh] flex-col justify-center">
      <span
        aria-hidden="true"
        className="select-none text-[88px] font-black leading-none text-teal-600/15 sm:text-[110px]"
      >
        {index + 1}
      </span>
      <h3 className="-mt-6 text-2xl font-bold text-zinc-900 sm:text-3xl">{t(lang, `${stepKey}Heading`)}</h3>
      <p className="mt-3 max-w-sm text-zinc-600">{t(lang, `${stepKey}Text`)}</p>
    </motion.div>
  );
}

export default function HowItWorks({ lang }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = activeStepIndex(v, STEPS.length);
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const useSimpleLayout = !mounted || isMobile || reducedMotion;

  function goToStep(index) {
    const target = sectionRef.current?.querySelectorAll("[data-step]")[index];
    if (!target) return;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  }

  return (
    <div id="how-it-works">
      {/* Mobile / reduced-motion: each step stacked with its own static phone screen. */}
      <section className={useSimpleLayout ? "bg-white px-4 py-16" : "hidden"}>
        <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">{t(lang, "navHowItWorks")}</h2>
        <div className="mx-auto mt-10 max-w-md space-y-14">
          {STEPS.map((stepKey, index) => {
            const Screen = STATIC_PHONE[index];
            return (
              <div key={stepKey}>
                <span aria-hidden="true" className="select-none text-6xl font-black leading-none text-teal-600/15">
                  {index + 1}
                </span>
                <h3 className="-mt-3 text-xl font-bold text-zinc-900">{t(lang, `${stepKey}Heading`)}</h3>
                <p className="mt-2 text-zinc-600">{t(lang, `${stepKey}Text`)}</p>

                <div
                  aria-hidden="true"
                  className="pointer-events-none relative mx-auto mt-5 h-[420px] w-[220px] overflow-hidden rounded-[2rem] border-[8px] border-zinc-900 bg-zinc-900 shadow-xl"
                >
                  <div className="h-full w-full overflow-hidden rounded-[1.4rem] bg-white">
                    <Screen lang={lang} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Desktop: phone pinned, step text scrolls past it. */}
      <section ref={sectionRef} className={useSimpleLayout ? "hidden" : "relative bg-white"}>
        <h2 className="mx-auto max-w-6xl px-4 pt-16 text-center text-2xl font-bold text-zinc-900 sm:px-6 sm:text-3xl">
          {t(lang, "navHowItWorks")}
        </h2>
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <div>
            {STEPS.map((stepKey, index) => (
              <div key={stepKey} data-step={index}>
                <StepText lang={lang} stepKey={stepKey} index={index} total={STEPS.length} scrollYProgress={scrollYProgress} />
              </div>
            ))}
          </div>

          <StepProgressDots total={STEPS.length} activeIndex={activeIndex} onSelect={goToStep} lang={lang} />

          <div className="relative hidden lg:block">
            <div className="sticky top-24 flex items-center justify-center">
              <PhoneMockup lang={lang} scrollYProgress={scrollYProgress} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
