import Link from 'next/link';
import { getSession } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { Card, LinkButton, PageTitle } from '@/components/ui';
import InstallTip from '@/components/InstallTip';
import HomeUpload from './HomeUpload';

export default async function HomePage() {
  const { user, profile, household } = await getSession();
  if (!user || !household) return null;

  const supabase = await createClient();
  const [{ count: plantCount }, { count: photoCount }] = await Promise.all([
    supabase.from('specimens').select('id', { count: 'exact', head: true }).eq('household_id', household.id),
    supabase.from('photos').select('id', { count: 'exact', head: true }).eq('household_id', household.id),
  ]);

  const firstName = profile?.display_name?.split(' ')[0] ?? 'there';

  return (
    <div>
      <PageTitle sub={household.name}>Hi {firstName} 🌿</PageTitle>

      <InstallTip />

      <Card className="mt-1 p-5">
        <p className="text-[15px] font-semibold text-ink">What now?</p>
        <p className="mt-1 text-sm text-ink-soft">
          Snap a plant and it lands in your shared album for both of you.
        </p>
        <div className="mt-4">
          <HomeUpload householdId={household.id} userId={user.id} />
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Link href="/plants" className="rounded-card">
          <Card className="p-5">
            <div className="text-2xl" aria-hidden="true">🪴</div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">{plantCount ?? 0}</p>
            <p className="text-sm text-ink-soft">{plantCount === 1 ? 'plant' : 'plants'}</p>
          </Card>
        </Link>
        <Link href="/album" className="rounded-card">
          <Card className="p-5">
            <div className="text-2xl" aria-hidden="true">🖼️</div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">{photoCount ?? 0}</p>
            <p className="text-sm text-ink-soft">{photoCount === 1 ? 'photo' : 'photos'}</p>
          </Card>
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <LinkButton href="/plants/new" variant="ghost">＋ Add a plant</LinkButton>
        <LinkButton href="/species" variant="ghost">📖 Care sheets</LinkButton>
      </div>
    </div>
  );
}
