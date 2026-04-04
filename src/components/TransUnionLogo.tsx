export function TransUnionLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TransUnion"
    >
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="16"
        fontWeight="700"
        fill="currentColor"
      >
        tu
      </text>
    </svg>
  );
}
