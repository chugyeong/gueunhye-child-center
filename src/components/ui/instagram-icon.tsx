type InstagramIconProps = {
  size?: number;
  strokeWidth?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

export function InstagramIcon({
  size = 24,
  strokeWidth = 2,
  "aria-hidden": ariaHidden,
}: InstagramIconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}>
      <rect width="16" height="16" x="4" y="4" rx="4" />
      <circle cx="12" cy="12" r="3.25" />
      <path d="M16.5 7.5h.01" />
    </svg>
  );
}
