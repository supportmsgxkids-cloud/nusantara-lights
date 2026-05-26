// Faceless profile illustration — geometric Islamic motif avatar.
export function ProfileIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-primary-500)" />
          <stop offset="1" stopColor="var(--color-primary-900)" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#pg)" />
      {/* decorative ring */}
      <circle cx="100" cy="100" r="88" stroke="var(--color-gold-400)" strokeWidth="1.5" strokeDasharray="2 6" opacity="0.7" />
      {/* shoulders */}
      <path d="M30 180c10-30 35-46 70-46s60 16 70 46v20H30z" fill="var(--color-card)" opacity="0.95" />
      {/* head silhouette (faceless) */}
      <circle cx="100" cy="92" r="38" fill="var(--color-card)" />
      {/* hijab/kopiah dome */}
      <path
        d="M60 92a40 40 0 0180 0c0 6-2 11-5 16H65c-3-5-5-10-5-16z"
        fill="var(--color-primary-900)"
      />
      {/* gold star ornament */}
      <g transform="translate(100 70)">
        <path
          d="M0-8l2.4 4.8L8 0l-5.6 3.2L0 8l-2.4-4.8L-8 0l5.6-3.2z"
          fill="var(--color-gold-400)"
        />
      </g>
    </svg>
  );
}
