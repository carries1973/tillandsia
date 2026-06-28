'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { updateSpecimen } from './actions';

interface SpeciesOption {
  id: string;
  label: string;
}

export default function EditPlant({
  specimenId,
  name,
  speciesId,
  confident,
  species,
}: {
  specimenId: string;
  name: string;
  speciesId: string | null;
  confident: boolean;
  species: SpeciesOption[];
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handle(fd: FormData) {
    setBusy(true);
    setError('');
    const result = await updateSpecimen(specimenId, fd);
    if (result?.error) setError(result.error);
    else setOpen(false);
    setBusy(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-green underline"
      >
        Edit
      </button>
    );
  }

  return (
    <form action={handle} className="mt-3 rounded-card bg-card p-5 shadow-soft">
      <p className="mb-3 font-display text-lg font-bold text-ink">Edit plant</p>

      <label htmlFor="name" className="block text-xs font-semibold text-ink-soft">
        Name
      </label>
      <input
        id="name"
        name="name"
        defaultValue={name}
        required
        className="mt-1 min-h-[44px] w-full rounded-xl border border-[#e2e1d8] bg-white px-3 text-[16px] text-ink outline-none focus:border-green"
      />

      <label htmlFor="species_id" className="mt-4 block text-xs font-semibold text-ink-soft">
        Species
      </label>
      <select
        id="species_id"
        name="species_id"
        defaultValue={speciesId ?? ''}
        className="mt-1 min-h-[44px] w-full rounded-xl border border-[#e2e1d8] bg-white px-3 text-[16px] text-ink outline-none focus:border-green"
      >
        <option value="">Not sure yet</option>
        {species.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="confident"
          defaultChecked={confident}
          className="h-5 w-5 accent-green"
        />
        ID confirmed (remove the “provisional” badge)
      </label>

      {error ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-[#a23b3b]">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex gap-2">
        <Button type="submit" disabled={busy} className="flex-1">
          {busy ? 'Saving…' : 'Save'}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="min-h-[44px] rounded-full px-4 text-sm font-semibold text-ink-soft"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
