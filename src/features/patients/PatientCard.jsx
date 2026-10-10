import { Link } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Icon from '../../components/Icon.jsx';
import { calcAge, relativeDays } from '../../lib/dates.js';
import { alertsFromKeys } from '../../lib/alerts.js';

export default function PatientCard({ patient }) {
  const age = calcAge(patient.birthDate);
  const last = patient.lastVisitAt
    ? relativeDays(patient.lastVisitAt)
    : 'sin visitas';
  const alerts = alertsFromKeys(patient.alerts);

  return (
    <Link
      to={`/pacientes/${patient.id}`}
      className="tap flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card active:opacity-80"
    >
      <Avatar name={patient.fullName} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-ink">{patient.fullName || 'Sin nombre'}</p>
        <p className="mt-0.5 text-xs text-muted">
          {age != null ? `${age} años · ` : ''}
          {last}
        </p>
        {alerts.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {alerts.map((a) => (
              <Badge key={a.key} tone={a.tone}>
                {a.label}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Icon name="chevron" size={18} className="flex-none text-muted" />
    </Link>
  );
}
