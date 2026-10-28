"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { t } from "@/lib/i18n";
import { localStepProgress, mapRange } from "./howItWorksMotion";

function ShieldCheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6l7-3Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8.7 12.2l2.3 2.3 4.3-4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PhoneCheckScreen({ lang, scrollYProgress, stepIndex = 0, stepTotal = 1 }) {
  const fallback = useMotionValue(1);
  const source = scrollYProgress ?? fallback;
  const localT = useTransform(source, (v) => (scrollYProgress ? localStepProgress(v, stepIndex, stepTotal) : 1));

  const shieldOpacity = useTransform(localT, (v) => mapRange(v, 0.1, 0.35, 0, 1));
  const shieldScale = useTransform(localT, (v) => 0.6 + mapRange(v, 0.15, 0.45, 0, 1) * 0.4);
  const noteOpacity = useTransform(localT, (v) => mapRange(v, 0.5, 0.75, 0, 1));
  const noteY = useTransform(localT, (v) => mapRange(v, 0.5, 0.75, 8, 0));

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-50 px-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{t(lang, "yourMedicine")}</p>
      <p className="mt-1 text-lg font-bold text-zinc-900">Panadol</p>

      <motion.div style={{ opacity: shieldOpacity, scale: shieldScale }} className="mt-6 text-teal-600">
        <ShieldCheckIcon className="h-16 w-16" />
      </motion.div>

      <motion.span
        style={{ opacity: shieldOpacity }}
        className="mt-3 inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800"
      >
        {t(lang, "badgeRegistered")}
      </motion.span>

      <motion.p style={{ opacity: noteOpacity, y: noteY }} className="mt-5 max-w-[200px] text-xs text-zinc-500">
        {t(lang, "confirmNote")}
      </motion.p>
    </div>
  );
}
