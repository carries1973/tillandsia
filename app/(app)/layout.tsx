import { redirect } from 'next/navigation';
import { getSession } from '@/lib/data';
import BottomNav from '@/components/BottomNav';
import OfflineBanner from '@/components/OfflineBanner';
import RegisterSW from '@/components/RegisterSW';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, household } = await getSession();
  if (!user) redirect('/login');
  if (!household) redirect('/onboarding');

  return (
    <div className="mx-auto min-h-dvh max-w-md pb-24">
      <RegisterSW />
      <OfflineBanner />
      <div className="px-5 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
