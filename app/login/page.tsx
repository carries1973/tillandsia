'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Card } from '@/components/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setStatus('error');
    } else {
      setStatus('sent');
    }
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
        {status === 'sent' ? (
          <div className="text-center">
            <div className="text-3xl" aria-hidden="true">
              📬
            </div>
            <h2 className="mt-2 font-display text-xl font-bold text-ink">Check your email</h2>
            <p className="mt-1 text-[15px] text-ink-soft">
              We sent a sign-in link to <strong>{email}</strong>. Tap it on this device to come
              in. No password to remember.
            </p>
            <button
              className="mt-4 text-sm font-semibold text-green underline"
              onClick={() => setStatus('idle')}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={sendLink}>
            <label htmlFor="email" className="block text-sm font-semibold text-ink">
              Your email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 min-h-[48px] w-full rounded-2xl border border-[#e2e1d8] bg-white px-4 text-[16px] text-ink outline-none focus:border-green"
            />
            <p className="mt-2 text-[13px] text-ink-soft">
              We&apos;ll email you a magic link — the link keeps your garden private.
            </p>
            {status === 'error' ? (
              <p role="alert" className="mt-2 text-sm font-semibold text-[#a23b3b]">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={status === 'sending'} className="mt-4 w-full">
              {status === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}
