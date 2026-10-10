// Marca "Huella": cuadro teal con huella en color claro. SVG propio.
export function BrandMark({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="13" fill="var(--c-primary)" />
      <ellipse cx="20" cy="27" rx="8.5" ry="11" fill="var(--c-primary-ink)" />
      <circle cx="30" cy="16.5" r="3.1" fill="var(--c-primary-ink)" />
      <circle cx="34.5" cy="21.5" r="2.5" fill="var(--c-primary-ink)" />
      <circle cx="35" cy="27" r="2.2" fill="var(--c-primary-ink)" />
    </svg>
  );
}
