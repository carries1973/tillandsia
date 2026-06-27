'use client';

import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { addPlant } from './actions';

interface SpeciesOption {
  id: string;
  binomial: string;
  common: string;
}

export default function NewPlantForm({ species }: { species: SpeciesOption[] }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handle(fd: FormData) {
    setBusy(true);
    setError('');
    const result = await addPlant(fd);
    if (result?.error) setError(result.error);
    setBusy(false);
  }

  return (
    <Card className="p-5">
      <form action={handle} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-ink">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="e.g. Fuzzy purple"
            className="mt-2 min-h-[48px] w-full rounded-2xl border border-[#e2e1d8] bg-white px-4 text-[16px] text-ink outline-none focus:border-green"
          />
        </div>

        <div>
          <label htmlFor="species_id" className="block text-sm font-semibold text-ink">
            Species <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <select
            id="species_id"
            name="species_id"
            defaultValue=""
            className="mt-2 min-h-[48px] w-full rounded-2xl border border-[#e2e1d8] bg-white px-4 text-[16px] text-ink outline-none focus:border-green"
          >
            <option value="">I&apos;m not sure yet</option>
            {species.map((s) => (
              <option key={s.id} value={s.id}>
                {s.common ? `${s.common} — ${s.binomial}` : s.binomial}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-ink">
            Notes <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Where it lives, where it came from…"
            className="mt-2 w-full rounded-2xl border border-[#e2e1d8] bg-white px-4 py-3 text-[16px] text-ink outline-none focus:border-green"
          />
        </div>

        {error ? (
          <p role="alert" className="text-sm font-semibold text-[#a23b3b]">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Saving…' : 'Save plant 🌱'}
        </Button>
      </form>
    </Card>
  );
}
