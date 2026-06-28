'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { updateSpecimen, deleteSpecimen } from './actions';

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
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function handle(fd: FormData) {
    setBusy(true);
    setError('');
    const result = await updateSpecimen(specimenId, fd);
    if (result?.error) setError(result.error);
    else setOpen(false);
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    setError('');
    const result = await deleteSpecimen(specimenId);
    // Success redirects; only an error returns here.
    if (result?.error) {
      setError(result.error);
      setBusy(false);
    }
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

      {/* Remove plant */}
      <div className="mt-5 border-t border-[#eee9df] pt-4">
        {!confirmRemove ? (
          <button
            type="button"
            onClick={() => setConfirmRemove(true)}
            className="text-sm font-semibold text-[#a23b3b]"
          >
            Remove this plant
          </button>
        ) : (
          <div>
            <p className="text-sm text-ink-soft">
              Remove <strong className="text-ink">{name}</strong>? Its photos stay in your shared
              album — only the plant and its progress log are removed.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="min-h-[44px] rounded-full bg-[#a23b3b] px-5 text-[15px] font-semibold text-white disabled:opacity-50"
              >
                {busy ? 'Removing…' : 'Yes, remove'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmRemove(false)}
                className="min-h-[44px] rounded-full px-4 text-sm font-semibold text-ink-soft"
              >
                Keep it
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
