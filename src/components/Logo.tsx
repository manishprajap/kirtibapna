import Link from "next/link";

/**
 * Kriti Bapna sprig: the botanical mark from the original logo, redrawn with clean lines
 * and filled in the brand pink gradient so it matches the site theme.
 */
export function Sprig({ className = "", height = 40, id = "sprig" }: { className?: string; height?: number; id?: string }) {
  return (
    <svg viewBox="0 0 24 44" height={height} className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="12" y1="0" x2="12" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F06292" />
          <stop offset="1" stopColor="#AD1457" />
        </linearGradient>
      </defs>
      <path d="M12 43V9" stroke={`url(#${id}-g)`} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 8C9.5 5.5 9.5 3 12 1c2.5 2 2.5 4.5 0 7Z" fill={`url(#${id}-g)`} />
      {[15, 25, 35].map((y) => (
        <g key={y} fill={`url(#${id}-g)`}>
          <path d={`M12 ${y}C7 ${y} 3.5 ${y - 3.5} 3.5 ${y - 8}c5 0 8.5 3.5 8.5 8Z`} />
          <path d={`M12 ${y}c5 0 8.5-3.5 8.5-8-5 0-8.5 3.5-8.5 8Z`} />
        </g>
      ))}
    </svg>
  );
}

/** Square app-icon style mark (used in the favicon too). */
export function LogoMark({ size = 44, id = "kb" }: { size?: number; id?: string }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-brand-dark"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 44" height={size * 0.6} fill="none" aria-hidden="true" className="text-white">
        <path d="M12 43V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 8C9.5 5.5 9.5 3 12 1c2.5 2 2.5 4.5 0 7Z" fill="currentColor" />
        {[15, 25, 35].map((y) => (
          <g key={y} fill="currentColor">
            <path d={`M12 ${y}C7 ${y} 3.5 ${y - 3.5} 3.5 ${y - 8}c5 0 8.5 3.5 8.5 8Z`} />
            <path d={`M12 ${y}c5 0 8.5-3.5 8.5-8-5 0-8.5 3.5-8.5 8Z`} />
          </g>
        ))}
      </svg>
    </span>
  );
}

/**
 * Kriti Bapna logo: the original spaced-capital wordmark with the sprig between the names,
 * modernised in the brand pink so it matches the theme.
 */
export default function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const word = variant === "dark" ? "text-brand-dark" : "text-white";
  const sub = variant === "dark" ? "text-ink/50" : "text-white/65";
  return (
    <Link href="/" aria-label="Kriti Bapna – Home" className={`inline-flex flex-col items-center ${className}`}>
      <span className="flex items-center gap-3 sm:gap-4">
        <span className={`font-display text-xl font-semibold uppercase tracking-[0.38em] sm:text-2xl ${word}`}>Kriti</span>
        {variant === "dark" ? (
          <Sprig height={38} id={`sprig-${variant}`} className="shrink-0" />
        ) : (
          <LogoMark size={38} />
        )}
        <span className={`font-display text-xl font-semibold uppercase tracking-[0.38em] sm:text-2xl ${word}`}>Bapna</span>
      </span>
      <span className={`mt-1 text-[8px] font-medium uppercase tracking-[0.5em] ${sub}`}>Designer Womenswear</span>
    </Link>
  );
}
