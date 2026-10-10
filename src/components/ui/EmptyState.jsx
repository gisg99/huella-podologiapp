import Icon from '../Icon.jsx';

export default function EmptyState({ icon = 'foot', title, children, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/60 p-8 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon name={icon} size={24} />
      </div>
      {title && <p className="text-base font-semibold">{title}</p>}
      {children && <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{children}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
