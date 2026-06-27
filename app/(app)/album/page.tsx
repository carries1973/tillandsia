import { getSession } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { PageTitle } from '@/components/ui';
import AlbumGrid, { type Member } from '@/components/AlbumGrid';
import AlbumUpload from './AlbumUpload';

export default async function AlbumPage() {
  const { user, household } = await getSession();
  if (!user || !household) return null;

  const supabase = await createClient();
  const { data: memberRows } = await supabase
    .from('household_members')
    .select('user_id, profiles(display_name)')
    .eq('household_id', household.id);

  const members: Member[] = (memberRows ?? []).map((m) => ({
    id: m.user_id as string,
    name:
      ((m.profiles as unknown as { display_name: string | null } | null)?.display_name ??
        'Member') as string,
  }));

  return (
    <div>
      <PageTitle sub="Everything you both add lands here.">Shared album</PageTitle>
      <div className="mb-5">
        <AlbumUpload householdId={household.id} userId={user.id} />
      </div>
      <AlbumGrid householdId={household.id} currentUserId={user.id} members={members} />
    </div>
  );
}
