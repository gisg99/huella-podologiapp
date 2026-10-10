import { initials } from '../../lib/strings.js';

export default function Avatar({ name, size = 40 }) {
  return (
    <div
      className="flex flex-none items-center justify-center rounded-xl bg-primary-soft font-display font-semibold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
