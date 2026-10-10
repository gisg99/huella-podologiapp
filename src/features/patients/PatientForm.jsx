import { useState } from 'react';
import { TextField, TextArea } from '../../components/ui/Field.jsx';
import { Card, GroupLabel } from '../../components/ui/Card.jsx';
import SegmentedControl from '../../components/ui/SegmentedControl.jsx';
import Button from '../../components/ui/Button.jsx';
import { patientRepo } from '../../db/index.js';
import { calcAge, todayInputValue } from '../../lib/dates.js';
import { SEX } from '../../constants/domain.js';
import { SEX as SEX_LABELS, FIELDS, ACTIONS } from '../../constants/text.js';

function build(initial) {
  return {
    fullName: '',
    birthDate: '',
    sex: null,
    occupation: '',
    address: '',
    phone: '',
    admissionDate: todayInputValue(),
    ...initial,
    emergencyContact: { name: '', relationship: '', phone: '', ...(initial?.emergencyContact || {}) },
    family: { parents: '', siblings: '', children: '', grandparents: '', ...(initial?.family || {}) },
  };
}

export default function PatientForm({ initial, onSaved, submitLabel = ACTIONS.save }) {
  const [form, setForm] = useState(() => build(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setNested = (group, key) => (e) =>
    setForm((f) => ({ ...f, [group]: { ...f[group], [key]: e.target.value } }));

  const age = calcAge(form.birthDate);
  const sexOptions = SEX.map((v) => ({ value: v, label: SEX_LABELS[v] }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError('El nombre completo es obligatorio.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const data = {
        fullName: form.fullName.trim(),
        birthDate: form.birthDate || null,
        sex: form.sex,
        occupation: form.occupation.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        emergencyContact: {
          name: form.emergencyContact.name.trim(),
          relationship: form.emergencyContact.relationship.trim(),
          phone: form.emergencyContact.phone.trim(),
        },
        family: {
          parents: form.family.parents.trim(),
          siblings: form.family.siblings.trim(),
          children: form.family.children.trim(),
          grandparents: form.family.grandparents.trim(),
        },
        admissionDate: form.admissionDate || null,
      };
      const saved = initial?.id
        ? await patientRepo.update(initial.id, data)
        : await patientRepo.create(data);
      onSaved?.(saved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <GroupLabel>Datos del paciente</GroupLabel>
        <Card className="mt-2 flex flex-col gap-4">
          <TextField label={FIELDS.fullName} value={form.fullName} onChange={set('fullName')} required autoComplete="name" />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              type="date"
              label={FIELDS.birthDate}
              value={form.birthDate || ''}
              onChange={set('birthDate')}
              hint={age != null ? `· ${age} años` : ''}
            />
            <TextField type="date" label={FIELDS.admissionDate} value={form.admissionDate || ''} onChange={set('admissionDate')} />
          </div>
          <SegmentedControl label={FIELDS.sex} value={form.sex} onChange={(v) => setForm((f) => ({ ...f, sex: v }))} options={sexOptions} />
          <TextField label={FIELDS.occupation} value={form.occupation} onChange={set('occupation')} />
          <TextField label={FIELDS.address} value={form.address} onChange={set('address')} autoComplete="street-address" />
          <TextField label={FIELDS.phone} value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" />
        </Card>
      </div>

      <div>
        <GroupLabel>{FIELDS.emergencyContact}</GroupLabel>
        <Card className="mt-2 flex flex-col gap-4">
          <TextField label={FIELDS.emergencyName} value={form.emergencyContact.name} onChange={setNested('emergencyContact', 'name')} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label={FIELDS.emergencyRelationship} value={form.emergencyContact.relationship} onChange={setNested('emergencyContact', 'relationship')} />
            <TextField label={FIELDS.emergencyPhone} value={form.emergencyContact.phone} onChange={setNested('emergencyContact', 'phone')} inputMode="tel" />
          </div>
        </Card>
      </div>

      <div>
        <GroupLabel>{FIELDS.family}</GroupLabel>
        <Card className="mt-2 flex flex-col gap-4">
          <TextArea label={FIELDS.parents} rows={2} value={form.family.parents} onChange={setNested('family', 'parents')} />
          <TextArea label={FIELDS.siblings} rows={2} value={form.family.siblings} onChange={setNested('family', 'siblings')} />
          <TextArea label={FIELDS.children} rows={2} value={form.family.children} onChange={setNested('family', 'children')} />
          <TextArea label={FIELDS.grandparents} rows={2} value={form.family.grandparents} onChange={setNested('family', 'grandparents')} />
        </Card>
      </div>

      {error && <p className="text-sm font-semibold text-danger">{error}</p>}

      <Button type="submit" full disabled={saving} icon="check">
        {saving ? 'Guardando…' : submitLabel}
      </Button>
    </form>
  );
}
