'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setSpecies } from './actions';

interface Result {
  slug: string | null;
  binomial: string | null;
  common: string | null;
  confidence: number | null;
  reasoning: string;
}

export default function IdentifyButton({ specimenId }: { specimenId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);

  async function identify() {
    setBusy(true);
    setError('');
    setResult(null);
    setApplied(false);
    try {
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specimenId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Identify failed.');
      } else {
        setResult(data as Result);
      }
    } catch {
      setError('Network error — try again.');
    }
    setBusy(false);
  }

  async function apply() {
    if (!result?.slug) return;
    setBusy(true);
    const r = await setSpecies(specimenId, result.slug, (result.confidence ?? 0) >= 0.9);
    if (r?.error) setError(r.error);
    else {
      setApplied(true);
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="rounded-card bg-card p-5 shadow-soft">
      <p className="text-sm font-semibold text-ink">✨ Identify with AI</p>
      <p className="mt-1 text-sm text-ink-soft">
        Let Claude look at this plant&apos;s photo and guess the species.
      </p>

      <button
        onClick={identify}
        disabled={busy}
        className="mt-3 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-green px-5 text-[15px] font-semibold text-white transition hover:bg-green-deep disabled:opacity-50"
      >
        {busy ? 'Looking…' : result ? 'Identify again' : 'Identify this plant'}
      </button>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-[#a23b3b]">
          {error}
        </p>
      ) : null}

      {result ? (
        result.slug ? (
          <div className="mt-3 rounded-2xl bg-green-tint p-4">
            <p className="text-sm font-semibold text-green-deep">
              Looks like <strong>{result.common ?? result.binomial}</strong>
              {result.confidence != null
                ? ` · ${Math.round(result.confidence * 100)}% sure`
                : ''}
            </p>
            {result.binomial ? (
              <p className="text-xs italic text-green-deep/80">{result.binomial}</p>
            ) : null}
            {result.reasoning ? (
              <p className="mt-1 text-sm text-ink-soft">{result.reasoning}</p>
            ) : null}
            {applied ? (
              <p className="mt-3 text-sm font-semibold text-green-deep">Set ✓</p>
            ) : (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={apply}
                  disabled={busy}
                  className="min-h-[40px] rounded-full bg-green px-4 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Set as species
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="min-h-[40px] rounded-full px-3 text-sm font-semibold text-ink-soft"
                >
                  Not right
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl bg-canvas p-4">
            <p className="text-sm text-ink-soft">
              Couldn&apos;t confidently match it to one of your care-sheet species.
              {result.reasoning ? ` ${result.reasoning}` : ''}
            </p>
          </div>
        )
      ) : null}
    </div>
  );
}
