import { redirect } from 'next/navigation';
import { getSession } from '@/lib/data';
import OnboardingForm from './OnboardingForm';

export default async function OnboardingPage() {
  const { user, household, profile } = await getSession();
  if (!user) redirect('/login');
  if (household) redirect('/home');

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-7 text-center">
        <div className="text-5xl" aria-hidden="true">
          🌱
        </div>
        <h1 className="mt-3 font-display text-[26px] font-bold leading-tight text-ink">
          Welcome{profile?.display_name ? `, ${profile.display_name}` : ''}!
        </h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          Let&apos;s set up your shared garden. You only do this once.
        </p>
      </div>
      <OnboardingForm />
    </main>
  );
}
