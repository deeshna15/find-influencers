interface VerifiedBadgeProps {
  verified: boolean;
  size?: "sm" | "md" | "lg";
}

export function VerifiedBadge({ verified, size = "sm" }: VerifiedBadgeProps) {
  if (!verified) return null;

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <svg
      className={`inline-block ml-1 ${sizeClasses[size]} text-blue-500 fill-current`}
      viewBox="0 0 24 24"
      aria-label="Verified"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );
}
