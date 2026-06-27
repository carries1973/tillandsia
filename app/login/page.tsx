'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui';

export default function LoginPage() {
  const [status, setStatus] = useState<'idle' | 'redirecting' | 'error'>('idle');
  const [error, setError] = useState('');

  async function signInWithGoogle() {
    setStatus('redirecting');
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setStatus('error');
    }
    // On success the browser redirects to Google, so nothing else runs here.
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 text-center">
        <div className="text-5xl" aria-hidden="true">
          🌿
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">Tillandsia</h1>
        <p className="mt-1 text-[15px] text-ink-soft">Your shared air-plant garden.</p>
      </div>

      <Card className="p-6">
        <button
          onClick={signInWithGoogle}
          disabled={status === 'redirecting'}
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full border border-[#dcdbd2] bg-white px-5 text-[16px] font-semibold text-ink transition hover:bg-canvas disabled:opacity-60"
        >
          <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58z"
            />
          </svg>
          {status === 'redirecting' ? 'Opening Google…' : 'Continue with Google'}
        </button>

        <p className="mt-3 text-center text-[13px] text-ink-soft">
          One tap to sign in. No password to remember — and your garden stays private to
          you and the people you invite.
        </p>

        {status === 'error' ? (
          <p role="alert" className="mt-3 text-center text-sm font-semibold text-[#a23b3b]">
            {error}
          </p>
        ) : null}
      </Card>
    </main>
  );
}
