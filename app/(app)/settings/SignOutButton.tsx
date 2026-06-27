'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.push('/login');
    router.refresh();
  }
  return (
    <button
      onClick={signOut}
      className="min-h-[44px] w-full rounded-full border border-[#e2e1d8] bg-white px-5 py-2.5 text-[15px] font-semibold text-ink-soft transition hover:bg-canvas"
    >
      Sign out
    </button>
  );
}
