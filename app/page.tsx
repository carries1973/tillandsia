import { redirect } from 'next/navigation';
import { getSession } from '@/lib/data';

// Entry point: route to onboarding, home, or login depending on state.
export default async function Index() {
  const { user, household } = await getSession();
  if (!user) redirect('/login');
  if (!household) redirect('/onboarding');
  redirect('/home');
}
