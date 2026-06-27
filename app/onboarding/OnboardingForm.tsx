'use client';

import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { createHousehold, joinHousehold } from './actions';

export default function OnboardingForm() {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handle(action: (fd: FormData) => Promise<{ error?: string } | void>, fd: FormData) {
    setBusy(true);
    setError('');
    const result = await action(fd);
    // A successful action redirects; only failures return here.
    if (result?.error) setError(result.error);
    setBusy(false);
  }

  return (
    <Card className="p-6">
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-full bg-canvas p-1" role="tablist">
        <button
          role="tab"
          aria-selected={mode === 'create'}
          onClick={() => setMode('create')}
          className={`min-h-[40px] rounded-full text-sm font-semibold transition ${
            mode === 'create' ? 'bg-green text-white' : 'text-ink-soft'
          }`}
        >
          Start a garden
        </button>
        <button
          role="tab"
          aria-selected={mode === 'join'}
          onClick={() => setMode('join')}
          className={`min-h-[40px] rounded-full text-sm font-semibold transition ${
            mode === 'join' ? 'bg-green text-white' : 'text-ink-soft'
          }`}
        >
          I have a code
        </button>
      </div>

      {mode === 'create' ? (
        <form action={(fd) => handle(createHousehold, fd)}>
          <label htmlFor="name" className="block text-sm font-semibold text-ink">
            Name your garden
          </label>
          <input
            id="name"
            name="name"
            defaultValue="Our Garden"
            className="mt-2 min-h-[48px] w-full rounded-2xl border border-[#e2e1d8] bg-white px-4 text-[16px] text-ink outline-none focus:border-green"
          />
          <p className="mt-2 text-[13px] text-ink-soft">
            You can invite the other person to share it on the next screen.
          </p>
          {error ? (
            <p role="alert" className="mt-2 text-sm font-semibold text-[#a23b3b]">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={busy} className="mt-4 w-full">
            {busy ? 'Creating…' : 'Create our garden 🌿'}
          </Button>
        </form>
      ) : (
        <form action={(fd) => handle(joinHousehold, fd)}>
          <label htmlFor="code" className="block text-sm font-semibold text-ink">
            Invite code
          </label>
          <input
            id="code"
            name="code"
            placeholder="e.g. 9f3a2b1c"
            autoCapitalize="none"
            className="mt-2 min-h-[48px] w-full rounded-2xl border border-[#e2e1d8] bg-white px-4 font-mono text-[16px] text-ink outline-none focus:border-green"
          />
          <p className="mt-2 text-[13px] text-ink-soft">
            Ask the person who set up the garden for their code (it&apos;s in Settings).
          </p>
          {error ? (
            <p role="alert" className="mt-2 text-sm font-semibold text-[#a23b3b]">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={busy} className="mt-4 w-full">
            {busy ? 'Joining…' : 'Join the garden'}
          </Button>
        </form>
      )}
    </Card>
  );
}
