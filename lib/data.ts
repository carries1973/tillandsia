import { createClient } from '@/lib/supabase/server';
import type { Household, Profile } from '@/lib/types';

// Resolve the signed-in user, their profile, and their (first) household.
// Phase 1 = one shared household, so we take the first membership.
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, household: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const { data: membership } = await supabase
    .from('household_members')
    .select('household_id, households(*)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  const household = (membership?.households as Household | undefined) ?? null;

  return {
    user,
    profile: (profile as Profile | null) ?? null,
    household,
  };
}
