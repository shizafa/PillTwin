// Border + inherited text color, no fill — adapts to whatever foreground
// color the enclosing card sets, instead of a fixed palette.
export default function Chip({ children, strong = false }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-current px-2.5 py-1 text-xs ${
        strong ? "font-semibold" : "font-medium"
      }`}
    >
      {children}
    </span>
  );
}
