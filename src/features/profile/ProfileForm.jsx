import { useState } from 'react';
import { TextField } from '../../components/ui/Field.jsx';
import { Card } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import ImagePicker from '../../components/ImagePicker.jsx';
import SignaturePad from '../../components/SignaturePad.jsx';
import { profileRepo } from '../../db/index.js';
import { PROFILE, ACTIONS } from '../../constants/text.js';

const EMPTY = {
  name: '',
  license: '',
  specialty: PROFILE.specialtyDefault,
  clinic: '',
  phone: '',
  email: '',
  logo: null,
  signature: null,
};

// Formulario del perfil del especialista. `initial` = registro existente (editar).
export default function ProfileForm({ initial, onSaved, submitLabel = ACTIONS.save }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setVal = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('El nombre del especialista es obligatorio.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const saved = await profileRepo.save({
        name: form.name.trim(),
        license: form.license.trim(),
        specialty: form.specialty.trim() || PROFILE.specialtyDefault,
        clinic: form.clinic.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        logo: form.logo,
        signature: form.signature,
      });
      onSaved?.(saved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <TextField
          label={PROFILE.name}
          value={form.name}
          onChange={set('name')}
          autoComplete="name"
          required
        />
        <TextField label={PROFILE.license} value={form.license} onChange={set('license')} inputMode="numeric" />
        <TextField label={PROFILE.specialty} value={form.specialty} onChange={set('specialty')} />
        <TextField label={PROFILE.clinic} value={form.clinic} onChange={set('clinic')} />
        <TextField label={PROFILE.phone} value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" />
        <TextField label={PROFILE.email} value={form.email} onChange={set('email')} inputMode="email" autoComplete="email" />
      </Card>

      <Card className="flex flex-col gap-4">
        <ImagePicker
          label={PROFILE.logo}
          hint="· opcional, aparece en el PDF"
          value={form.logo}
          onChange={setVal('logo')}
          maxEdge={512}
          quality={0.85}
          aspect="h-28"
        />
        <SignaturePad label={PROFILE.signature} value={form.signature} onChange={setVal('signature')} />
      </Card>

      {error && <p className="text-sm font-semibold text-danger">{error}</p>}

      <Button type="submit" full disabled={saving} icon="check">
        {saving ? 'Guardando…' : submitLabel}
      </Button>
    </form>
  );
}
