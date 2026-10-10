const TONES = {
  danger: 'bg-danger-soft text-danger',
  accent: 'bg-accent-soft text-accent',
  neutral: 'bg-surface-2 text-muted',
  primary: 'bg-primary-soft text-primary',
};

// Insignia pequeña para alertas (DM, alergia, anticoagulante…).
export default function Badge({ children, tone = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
