// Faceless Islamic geometric illustrations — pure SVG.

export function EightStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="110" fill="var(--color-primary-50)" />
      <g stroke="var(--color-primary-900)" strokeWidth="2.2" strokeLinejoin="round">
        <path d="M120 40l20 40 44 6-32 30 8 44-40-22-40 22 8-44-32-30 44-6z" fill="var(--color-gold-50)" />
        <path d="M40 120l40-20 6-44 30 32 44-8-22 40 22 40-44-8-30 32-6-44z" fill="none" opacity="0.55" />
      </g>
      <circle cx="120" cy="120" r="18" fill="var(--color-gold-400)" opacity="0.9" />
      <circle cx="120" cy="120" r="8" fill="var(--color-primary-900)" />
    </svg>
  );
}

export function Dome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="220" height="220" rx="60" fill="var(--color-primary-50)" />
      <g stroke="var(--color-primary-900)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M60 180V120c0-33 27-60 60-60s60 27 60 60v60" fill="var(--color-card)" />
        <path d="M120 60V40" />
        <circle cx="120" cy="30" r="6" fill="var(--color-gold-400)" />
        <path d="M40 180h160" />
        <rect x="105" y="140" width="30" height="40" rx="15" fill="var(--color-gold-50)" />
        <path d="M80 180v-30" />
        <path d="M160 180v-30" />
      </g>
    </svg>
  );
}

export function Lantern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="110" fill="var(--color-gold-50)" />
      <g stroke="var(--color-primary-900)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M120 40v14" />
        <path d="M90 60h60l-6 14H96z" fill="var(--color-card)" />
        <path d="M84 74h72v90a36 36 0 01-72 0z" fill="var(--color-primary-50)" />
        <path d="M120 90v60M96 110l48 30M144 110l-48 30" opacity="0.6" />
        <path d="M96 184h48l-6 14H102z" fill="var(--color-card)" />
        <circle cx="120" cy="118" r="14" fill="var(--color-gold-400)" />
      </g>
    </svg>
  );
}
