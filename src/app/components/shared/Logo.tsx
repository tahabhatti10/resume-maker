interface LogoProps {
  className?: string;
  /** Render only the mark, without the wordmark. */
  markOnly?: boolean;
}

export const BRAND_GRADIENT = "linear-gradient(135deg, #0ea5e9 0%, #4f46e5 52%, #9333ea 100%)";

export function Logo({ className = "", markOnly = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-[0_12px_30px_rgba(79,70,229,0.22)] ring-1 ring-indigo-100">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7.75 4.25h9.05l3.45 3.6v15.9H7.75V4.25Z" fill="url(#doc)" />
          <path d="M16.55 4.25v3.9h3.7" fill="#DBEAFE" />
          <path d="M11 11.1h6.1M11 14h7.35M11 16.9h4.7" stroke="white" strokeWidth="1.65" strokeLinecap="round" />
          <path d="M6.4 8.8c2.1-2.9 5.05-4.35 8.85-4.35 1.95 0 3.65.42 5.1 1.25" stroke="url(#arc)" strokeWidth="2.25" strokeLinecap="round" />
          <circle cx="8.55" cy="8.4" r="2.15" fill="#0EA5E9" />
          <defs>
            <linearGradient id="doc" x1="7.75" y1="4.25" x2="22.35" y2="21.95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#9333EA" />
            </linearGradient>
            <linearGradient id="arc" x1="6.4" y1="4.45" x2="20.35" y2="8.8" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      {!markOnly && (
        <span className="bg-clip-text text-xl font-bold text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
          Resumio
        </span>
      )}
    </span>
  );
}
