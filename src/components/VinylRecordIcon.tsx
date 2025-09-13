interface VinylRecordIconProps {
  className?: string;
  filled?: boolean;
}

export function VinylRecordIcon({ className = "w-4 h-4", filled = false }: VinylRecordIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "#D4AF37" : "none"}
      stroke={filled ? "#D4AF37" : "#4b5563"}
      strokeWidth="2"
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" />
      {/* Middle circle */}
      <circle cx="12" cy="12" r="6" fill={filled ? "#B8860B" : "none"} />
      {/* Inner circle (center hole) */}
      <circle cx="12" cy="12" r="2" fill={filled ? "#9A7C0A" : "none"} />
      {/* Vinyl grooves */}
      <circle cx="12" cy="12" r="8" fill="none" stroke={filled ? "#B8860B" : "#6b7280"} strokeWidth="0.5" opacity="0.6" />
      <circle cx="12" cy="12" r="7" fill="none" stroke={filled ? "#B8860B" : "#6b7280"} strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}