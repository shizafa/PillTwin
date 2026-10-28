"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import OrbitCard from "./OrbitCard";
import { DESKTOP_CARDS, MOBILE_CARDS } from "./scrollStageCards";
import { t } from "@/lib/i18n";
import { useMediaQuery } from "@/lib/useMediaQuery";

const TEXT_START = 0.1;
const TEXT_END = 0.6;

export default function ScrollStage({ lang }) {
  // The pinned section stays mounted at all times (see below) so this ref is
  // always attached to a real node before useScroll sets up — framer-motion
  // does not reliably pick up a target ref that only attaches on a later render.
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const textOpacity = useTransform(scrollYProgress, [TEXT_START, TEXT_END], [0, 1]);

  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 639px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => setMounted(true), []);

  // Server render and first paint always show the simple layout so there is
  // no animated-vs-static hydration mismatch; it swaps in once mounted.
  const useSimpleLayout = !mounted || isMobile || reducedMotion;

  return (
    <>
      <section className={useSimpleLayout ? "bg-white px-4 py-20" : "hidden"}>
        <p className="mx-auto max-w-2xl text-balance text-center text-2xl font-semibold leading-snug text-zinc-900 sm:text-3xl">
          {t(lang, "scrollStageText")}
        </p>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-4 gap-3">
          {MOBILE_CARDS.map((card) => (
            <div key={card.id} className="relative aspect-square overflow-hidden rounded-xl shadow-sm">
              <Image src={card.image} alt="" fill sizes="25vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section
        ref={sectionRef}
        className={`relative bg-white ${useSimpleLayout ? "hidden" : ""}`}
        style={{ height: "800vh" }}
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <motion.p
            style={{ opacity: textOpacity }}
            className="relative z-10 max-w-xl text-balance text-center text-2xl font-semibold leading-snug text-zinc-900 sm:text-4xl"
          >
            {t(lang, "scrollStageText")}
          </motion.p>

          <div className="pointer-events-none absolute inset-0">
            {DESKTOP_CARDS.map((card, index) => (
              <OrbitCard
                key={card.id}
                card={card}
                index={index}
                total={DESKTOP_CARDS.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
