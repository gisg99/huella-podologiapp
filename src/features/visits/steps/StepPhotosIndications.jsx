import { Card, GroupLabel } from '../../../components/ui/Card.jsx';
import { TextArea } from '../../../components/ui/Field.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Icon from '../../../components/Icon.jsx';
import { useProfile } from '../../../app/useProfile.js';
import { useObjectURL } from '../../../lib/useObjectURL.js';
import { MAX_PHOTOS_PER_VISIT } from '../../../constants/domain.js';
import { FIELDS, PROFILE } from '../../../constants/text.js';

export default function StepPhotosIndications({ form, update }) {
  const profile = useProfile();
  const signatureUrl = useObjectURL(profile?.signature || null);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <GroupLabel>{FIELDS.indications}</GroupLabel>
        <Card className="mt-2">
          <TextArea
            rows={4}
            value={form.indications}
            onChange={(e) => update({ indications: e.target.value })}
            placeholder="Indicaciones para el paciente…"
          />
        </Card>
      </div>

      <div>
        <GroupLabel>{FIELDS.photos}</GroupLabel>
        <div className="mt-2">
          <EmptyState icon="plus" title={`Hasta ${MAX_PHOTOS_PER_VISIT} fotos por visita`}>
            La captura y compresión de fotos se agrega en la Fase 5.
          </EmptyState>
        </div>
      </div>

      <div>
        <GroupLabel>{FIELDS.signature}</GroupLabel>
        <Card className="mt-2">
          {profile?.signature ? (
            <div className="rounded-xl border border-line bg-white p-2">
              <img src={signatureUrl} alt="Firma del profesional" className="mx-auto h-20 object-contain" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Icon name="alert" size={18} className="text-warn" />
              No has registrado una firma. Agrégala en {PROFILE.title.toLowerCase()} (Ajustes).
            </div>
          )}
          <p className="mt-2 text-xs text-muted">Se usa la firma de tu perfil en el PDF.</p>
        </Card>
      </div>
    </div>
  );
}
