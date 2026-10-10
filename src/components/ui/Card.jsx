// Tarjeta de sección con título opcional.
export function Card({ children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-4 shadow-card ${className}`}>
      {children}
    </section>
  );
}

export function CardTitle({ children, icon }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-base">
      {icon}
      {children}
    </h2>
  );
}

// Encabezado de grupo pequeño (etiqueta en mayúsculas).
export function GroupLabel({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{children}</p>
  );
}
