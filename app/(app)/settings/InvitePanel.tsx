'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { createInvite } from './actions';

export default function InvitePanel({ existingCode }: { existingCode: string | null }) {
  const [code, setCode] = useState<string | null>(existingCode);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setBusy(true);
    setError('');
    const result = await createInvite();
    if (result?.error) setError(result.error);
    else if (result?.code) setCode(result.code);
    setBusy(false);
  }

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the code is visible to read aloud */
    }
  }

  return (
    <div className="rounded-2xl bg-canvas p-4">
      <p className="text-sm font-semibold text-ink">Invite the other person</p>
      {code ? (
        <>
          <p className="mt-1 text-sm text-ink-soft">
            Share this code. They tap <strong>“I have a code”</strong> when they sign in.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 select-all rounded-xl bg-white px-4 py-3 text-center font-mono text-lg font-bold tracking-wider text-ink">
              {code}
            </code>
            <Button type="button" variant="ghost" onClick={copy}>
              {copied ? 'Copied ✓' : 'Copy'}
            </Button>
          </div>
          <p className="mt-2 text-xs text-ink-soft">This code works for 7 days.</p>
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-ink-soft">
            Create a one-time code so they can join your shared garden.
          </p>
          {error ? (
            <p role="alert" className="mt-2 text-sm font-semibold text-[#a23b3b]">
              {error}
            </p>
          ) : null}
          <Button type="button" onClick={generate} disabled={busy} className="mt-3">
            {busy ? 'Creating…' : 'Create invite code'}
          </Button>
        </>
      )}
    </div>
  );
}
