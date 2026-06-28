'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { addObservation } from './actions';

export default function AddObservation({
  specimenId,
  bulbous,
  units,
}: {
  specimenId: string;
  bulbous: boolean;
  units: 'cm' | 'in';
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  async function handle(fd: FormData) {
    setBusy(true);
    setError('');
    const result = await addObservation(specimenId, fd);
    if (result?.error) setError(result.error);
    else setOpen(false);
    setBusy(false);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full">
        ＋ Log an update
      </Button>
    );
  }

  const u = units;
  const field = (name: string, label: string) => (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold text-ink-soft">
        {label} ({u})
      </label>
      <input
        id={name}
        name={name}
        type="number"
        step="0.1"
        inputMode="decimal"
        className="mt-1 min-h-[44px] w-full rounded-xl border border-[#e2e1d8] bg-white px-3 text-[16px] text-ink outline-none focus:border-green"
      />
    </div>
  );

  return (
    <form action={handle} className="rounded-card bg-card p-5 shadow-soft">
      <p className="mb-3 font-display text-lg font-bold text-ink">Log an update</p>

      <label htmlFor="observed_on" className="block text-xs font-semibold text-ink-soft">
        Date
      </label>
      <input
        id="observed_on"
        name="observed_on"
        type="date"
        defaultValue={today}
        className="mt-1 min-h-[44px] w-full rounded-xl border border-[#e2e1d8] bg-white px-3 text-[16px] text-ink outline-none focus:border-green"
      />

      <p className="mt-4 text-xs font-semibold text-ink">Lifecycle</p>
      <div className="mt-2 grid grid-cols-2 items-end gap-3">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-[#e2e1d8] bg-white px-3 text-sm font-semibold text-ink">
          <input type="checkbox" name="bloomed" className="h-5 w-5 accent-green" />
          <span>🌸 Blooming</span>
        </label>
        <div>
          <label htmlFor="pup_count" className="block text-xs font-semibold text-ink-soft">
            Pups (offsets)
          </label>
          <input
            id="pup_count"
            name="pup_count"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="e.g. 2"
            className="mt-1 min-h-[44px] w-full rounded-xl border border-[#e2e1d8] bg-white px-3 text-[16px] text-ink outline-none focus:border-green"
          />
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold text-ink">Measurements (optional)</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {field('height_cm', 'Height')}
        {field('span_cm', 'Width / span')}
        {field('longest_leaf_cm', 'Longest leaf')}
        {bulbous ? field('bulb_cm', 'Bulb width') : null}
      </div>

      <div className="mt-4">
        <label htmlFor="note" className="block text-xs font-semibold text-ink-soft">
          Note
        </label>
        <textarea
          id="note"
          name="note"
          rows={2}
          placeholder="Blushing red · new pup · watered · looking happy…"
          className="mt-1 w-full rounded-xl border border-[#e2e1d8] bg-white px-3 py-2 text-[16px] text-ink outline-none focus:border-green"
        />
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-[#a23b3b]">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex gap-2">
        <Button type="submit" disabled={busy} className="flex-1">
          {busy ? 'Saving…' : 'Save update'}
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
