import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/ui/AppHeader.jsx';
import { Card, GroupLabel } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Icon from '../components/Icon.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import { usePatient } from '../features/patients/usePatients.js';
import { patientRepo, visitRepo } from '../db/index.js';
import { calcAge, formatDate } from '../lib/dates.js';
import { deriveAlerts } from '../lib/alerts.js';
import { SEX as SEX_LABELS, FIELDS, ACTIONS, MESSAGES, VISIT_STATUS } from '../constants/text.js';

function DataRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="flex-none text-muted">{label}</span>
      <span className="text-right text-ink">{value}</span>
    </div>
  );
}

export default function PatientRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const patient = usePatient(id);
  const visits = useLiveQuery(() => (id ? visitRepo.listByPatient(id) : []), [id]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (patient === undefined) {
    return (
      <div>
        <AppHeader title="" back />
        <p className="py-10 text-center text-sm text-muted">{MESSAGES.loading}</p>
      </div>
    );
  }
  if (!patient) {
    return (
      <div>
        <AppHeader title="Expediente" back />
        <p className="py-10 text-center text-sm text-muted">Paciente no encontrado.</p>
      </div>
    );
  }

  const age = calcAge(patient.birthDate);
  const latestFinalized = (visits ?? []).find((v) => v.status === 'finalized');
  const alerts = deriveAlerts(latestFinalized);
  const hasVisits = (visits?.length ?? 0) > 0;
  const justCreated = location.state?.justCreated;

  async function handleDelete() {
    await patientRepo.softDelete(id);
    setConfirmDelete(false);
    navigate('/pacientes', { replace: true });
  }

  return (
    <div>
      <AppHeader
        title={patient.fullName}
        subtitle={[age != null ? `${age} años` : null, patient.sex ? SEX_LABELS[patient.sex] : null]
          .filter(Boolean)
          .join(' · ')}
        back
        right={
          <Link
            to={`/pacientes/${id}/editar`}
            className="tap flex items-center justify-center rounded-lg text-muted"
            aria-label={ACTIONS.edit}
          >
            <Icon name="edit" size={20} />
          </Link>
        }
      />

      <div className="flex flex-col gap-5 px-4 pb-24 pt-4">
        <div className="flex items-center gap-3">
          <Avatar name={patient.fullName} size={52} />
          <div className="min-w-0">
            <h2 className="truncate text-xl">{patient.fullName}</h2>
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
        </div>

        {justCreated && (
          <div className="rounded-xl bg-primary-soft px-4 py-3 text-sm font-semibold text-primary">
            Paciente guardado. ¿Iniciar su primera consulta?
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button full icon="plus" onClick={() => navigate(`/pacientes/${id}/visita`)}>
            {hasVisits ? ACTIONS.newVisit : ACTIONS.startFirstVisit}
          </Button>
          <Button full variant="ghost" icon="pdf" onClick={() => navigate(`/pacientes/${id}/visita`)}>
            {ACTIONS.exportPdf}
          </Button>
        </div>

        {/* Resumen de datos */}
        <div>
          <GroupLabel>Datos</GroupLabel>
          <Card className="mt-2">
            <DataRow label={FIELDS.birthDate} value={formatDate(patient.birthDate)} />
            <DataRow label={FIELDS.occupation} value={patient.occupation} />
            <DataRow label={FIELDS.phone} value={patient.phone} />
            <DataRow label={FIELDS.address} value={patient.address} />
            <DataRow label={FIELDS.admissionDate} value={formatDate(patient.admissionDate)} />
            {!patient.occupation && !patient.phone && !patient.address && (
              <p className="py-1 text-sm text-muted">Sin datos adicionales.</p>
            )}
          </Card>
        </div>

        {(patient.emergencyContact?.name || patient.emergencyContact?.phone) && (
          <div>
            <GroupLabel>{FIELDS.emergencyContact}</GroupLabel>
            <Card className="mt-2">
              <DataRow label={FIELDS.emergencyName} value={patient.emergencyContact.name} />
              <DataRow label={FIELDS.emergencyRelationship} value={patient.emergencyContact.relationship} />
              <DataRow label={FIELDS.emergencyPhone} value={patient.emergencyContact.phone} />
            </Card>
          </div>
        )}

        {/* Línea de tiempo de visitas */}
        <div>
          <GroupLabel>Visitas</GroupLabel>
          <div className="mt-2">
            {visits === undefined ? (
              <p className="py-6 text-center text-sm text-muted">{MESSAGES.loading}</p>
            ) : !hasVisits ? (
              <EmptyState icon="foot">{MESSAGES.noVisits}</EmptyState>
            ) : (
              <div className="flex flex-col gap-2.5">
                {visits.map((v) => (
                  <Link
                    key={v.id}
                    to={`/pacientes/${id}/visita`}
                    className="tap flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card"
                  >
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon name="foot" size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">{formatDate(v.date)}</p>
                      <p className="text-xs text-muted">{VISIT_STATUS[v.status] || v.status}</p>
                    </div>
                    <Icon name="chevron" size={18} className="flex-none text-muted" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="tap mt-2 self-center text-sm font-semibold text-danger"
        >
          Eliminar paciente
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar paciente"
        message="Se moverá a la papelera junto con sus visitas. Podrás restaurarlo después."
        confirmLabel={ACTIONS.delete}
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
