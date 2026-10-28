"use client";

import { t } from "@/lib/i18n";

export default function StepProgressDots({ total, activeIndex, onSelect, lang }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={t(lang, "goToStep").replace("{n}", index + 1)}
          aria-current={index === activeIndex ? "step" : undefined}
          className={`h-2.5 w-2.5 rounded-full transition-colors motion-reduce:transition-none ${
            index === activeIndex ? "bg-teal-600" : "bg-zinc-300"
          }`}
        />
      ))}
    </div>
  );
}
