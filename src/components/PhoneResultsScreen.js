"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { t } from "@/lib/i18n";
import { localStepProgress, mapRange } from "./howItWorksMotion";

const COMPOSITION = "Paracetamol 500mg";

function IngredientChip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-medium text-teal-800">
      {children}
    </span>
  );
}

function SameSaltTag({ lang }) {
  return (
    <span className="inline-flex items-center rounded-full bg-teal-600 px-2 py-0.5 text-[9px] font-semibold text-white">
      {t(lang, "sameSalt")}
    </span>
  );
}

export default function PhoneResultsScreen({ lang, scrollYProgress, stepIndex = 0, stepTotal = 1 }) {
  // Static (mobile / reduced-motion) callers omit scrollYProgress — fall back
  // to a constant source so the reveal renders fully settled, no scroll math.
  const fallback = useMotionValue(1);
  const source = scrollYProgress ?? fallback;
  const localT = useTransform(source, (v) => (scrollYProgress ? localStepProgress(v, stepIndex, stepTotal) : 1));

  const priceOpacity = useTransform(localT, (v) => mapRange(v, 0.2, 0.5, 0, 1));
  const priceY = useTransform(localT, (v) => mapRange(v, 0.2, 0.5, 8, 0));
  const badgeScale = useTransform(localT, (v) => 0.6 + mapRange(v, 0.5, 0.8, 0, 1) * 0.4);
  const badgeOpacity = useTransform(localT, (v) => mapRange(v, 0.5, 0.8, 0, 1));

  return (
    <div className="flex h-full w-full flex-col bg-zinc-50 px-3 pb-4 pt-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          {t(lang, "yourMedicine")}
        </p>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-800">
          {t(lang, "exampleLabel")}
        </span>
      </div>

      <div className="rounded-xl bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-zinc-900">Panadol</p>
            <div className="mt-1">
              <IngredientChip>{COMPOSITION}</IngredientChip>
            </div>
          </div>
          <motion.p
            style={{ opacity: priceOpacity, y: priceY }}
            className="shrink-0 text-sm font-bold text-zinc-900"
          >
            Rs. 85
          </motion.p>
        </div>
      </div>

      <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
        {t(lang, "sectionAlternatives")}
      </p>

      <div className="space-y-2">
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-zinc-900">Febrol</p>
              <div className="mt-1 flex flex-wrap gap-1">
                <IngredientChip>{COMPOSITION}</IngredientChip>
                <SameSaltTag lang={lang} />
              </div>
            </div>
            <div className="shrink-0 text-end">
              <motion.p style={{ opacity: priceOpacity, y: priceY }} className="text-sm font-bold text-zinc-900">
                Rs. 45
              </motion.p>
              <motion.span
                style={{ opacity: badgeOpacity, scale: badgeScale }}
                className="mt-0.5 inline-block rounded-full bg-teal-600 px-2 py-0.5 text-[9px] font-semibold text-white"
              >
                {t(lang, "savingsBadge").replace("{amount}", "40")}
              </motion.span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-zinc-900">Provas</p>
              <div className="mt-1 flex flex-wrap gap-1">
                <IngredientChip>{COMPOSITION}</IngredientChip>
                <SameSaltTag lang={lang} />
              </div>
            </div>
            <motion.p
              style={{ opacity: priceOpacity, y: priceY }}
              className="shrink-0 text-sm font-bold text-zinc-900"
            >
              Rs. 60
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
