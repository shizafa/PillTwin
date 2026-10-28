"use client";

import { motion, useTransform } from "framer-motion";
import PhoneScanScreen from "./PhoneScanScreen";
import PhoneResultsScreen from "./PhoneResultsScreen";
import PhoneCheckScreen from "./PhoneCheckScreen";
import { stepOpacity } from "./howItWorksMotion";

const STEP_TOTAL = 3;
// > 0.5 so neighboring screens' fade windows overlap — a true crossfade
// instead of both screens hitting 0 opacity at the same instant.
const OVERLAP = 0.65;

export default function PhoneMockup({ lang, scrollYProgress }) {
  const scanOpacity = useTransform(scrollYProgress, (v) => stepOpacity(v, 0, STEP_TOTAL, 0, OVERLAP));
  const resultsOpacity = useTransform(scrollYProgress, (v) => stepOpacity(v, 1, STEP_TOTAL, 0, OVERLAP));
  const checkOpacity = useTransform(scrollYProgress, (v) => stepOpacity(v, 2, STEP_TOTAL, 0, OVERLAP));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto h-[560px] w-[270px] rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl sm:h-[620px] sm:w-[300px] lg:h-[680px] lg:w-[330px]"
    >
      <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-white">
        <motion.div style={{ opacity: scanOpacity }} className="absolute inset-0">
          <PhoneScanScreen lang={lang} />
        </motion.div>
        <motion.div style={{ opacity: resultsOpacity }} className="absolute inset-0">
          <PhoneResultsScreen lang={lang} scrollYProgress={scrollYProgress} stepIndex={1} stepTotal={STEP_TOTAL} />
        </motion.div>
        <motion.div style={{ opacity: checkOpacity }} className="absolute inset-0">
          <PhoneCheckScreen lang={lang} scrollYProgress={scrollYProgress} stepIndex={2} stepTotal={STEP_TOTAL} />
        </motion.div>
      </div>
    </div>
  );
}
