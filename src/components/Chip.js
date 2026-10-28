const TONES = {
  neutral: "bg-zinc-100 text-zinc-600",
  teal: "bg-teal-50 text-teal-800",
  muted: "bg-zinc-50 text-zinc-400",
};

export default function Chip({ children, tone = "neutral" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}
