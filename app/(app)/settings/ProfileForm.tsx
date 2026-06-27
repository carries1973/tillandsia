'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { updateProfile } from './actions';

export default function ProfileForm({
  email,
  displayName,
  units,
}: {
  email: string;
  displayName: string;
  units: 'cm' | 'in';
}) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handle(fd: FormData) {
    setStatus('saving');
    const result = await updateProfile(fd);
    if (result?.error) {
      setError(result.error);
      setStatus('error');
    } else {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1800);
    }
  }

  return (
    <form action={handle} className="space-y-4">
      <div>
        <label htmlFor="display_name" className="block text-sm font-semibold text-ink">
          Display name <span className="font-normal text-ink-soft">(what the other person sees)</span>
        </label>
        <input
          id="display_name"
          name="display_name"
          defaultValue={displayName}
          placeholder="e.g. Mom"
          className="mt-2 min-h-[48px] w-full rounded-2xl border border-[#e2e1d8] bg-white px-4 text-[16px] text-ink outline-none focus:border-green"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">Measurement units</legend>
        <div className="mt-2 flex gap-2">
          {(['cm', 'in'] as const).map((u) => (
            <label
              key={u}
              className="flex min-h-[44px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#e2e1d8] bg-white text-sm font-semibold text-ink has-[:checked]:border-green has-[:checked]:bg-green-tint"
            >
              <input type="radio" name="units" value={u} defaultChecked={units === u} className="sr-only" />
              {u === 'cm' ? 'Centimetres' : 'Inches'}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-xs text-ink-soft">Signed in as {email}</p>

      {status === 'error' ? (
        <p role="alert" className="text-sm font-semibold text-[#a23b3b]">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={status === 'saving'} variant="ghost">
        {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save profile'}
      </Button>
    </form>
  );
}
