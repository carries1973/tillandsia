import { getSession } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { Card, PageTitle } from '@/components/ui';
import ProfileForm from './ProfileForm';
import InvitePanel from './InvitePanel';
import SignOutButton from './SignOutButton';

export default async function SettingsPage() {
  const { user, profile, household } = await getSession();
  if (!user || !household) return null;

  const supabase = await createClient();
  const { data: memberRows } = await supabase
    .from('household_members')
    .select('user_id, role, profiles(display_name)')
    .eq('household_id', household.id);

  const { data: invites } = await supabase
    .from('household_invites')
    .select('code, expires_at, accepted_by')
    .eq('household_id', household.id)
    .is('accepted_by', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1);

  const members = (memberRows ?? []).map((m) => ({
    id: m.user_id as string,
    role: m.role as string,
    name: ((m.profiles as unknown as { display_name: string | null } | null)?.display_name ?? 'Member') as string,
  }));

  return (
    <div>
      <PageTitle sub={household.name}>Settings</PageTitle>

      <Card className="mb-4 p-5">
        <p className="mb-3 text-sm font-semibold text-ink">Your profile</p>
        <ProfileForm
          email={user.email ?? ''}
          displayName={profile?.display_name ?? ''}
          units={profile?.units ?? 'cm'}
        />
      </Card>

      <Card className="mb-4 p-5">
        <p className="mb-1 text-sm font-semibold text-ink">Who&apos;s in this garden</p>
        <ul className="mb-4 mt-2 space-y-1.5">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-2 text-sm text-ink">
              <span aria-hidden="true">{m.id === user.id ? '🙋' : '👤'}</span>
              <span>{m.name}</span>
              {m.id === user.id ? <span className="text-ink-soft">(you)</span> : null}
              {m.role === 'owner' ? (
                <span className="ml-auto text-xs font-semibold text-ink-soft">owner</span>
              ) : null}
            </li>
          ))}
        </ul>
        <InvitePanel existingCode={invites?.[0]?.code ?? null} />
      </Card>

      <SignOutButton />
    </div>
  );
}
