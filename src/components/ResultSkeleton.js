import { t } from "@/lib/i18n";

function Bar({ className }) {
  return <div className={`animate-pulse rounded-full bg-zinc-200 motion-reduce:animate-none ${className}`} />;
}

export default function ResultSkeleton({ lang }) {
  return (
    <div className="mt-8 space-y-6" role="status" aria-live="polite" aria-label={t(lang, "loadingResults")}>
      <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.05)] sm:p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-zinc-200 motion-reduce:animate-none" />
          <div className="flex-1 space-y-3">
            <Bar className="h-5 w-2/3" />
            <div className="flex gap-1.5">
              <Bar className="h-5 w-16" />
              <Bar className="h-5 w-16" />
            </div>
          </div>
        </div>
        <Bar className="mt-4 h-10 w-full rounded-xl" />
        <Bar className="mt-4 h-6 w-32 rounded-full" />
      </div>

      <div className="space-y-3">
        {[0, 1].map((key) => (
          <div key={key} className="rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-5">
            <Bar className="h-5 w-1/2" />
            <Bar className="mt-2 h-4 w-1/3" />
            <div className="mt-2 flex gap-1.5">
              <Bar className="h-5 w-20" />
              <Bar className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
