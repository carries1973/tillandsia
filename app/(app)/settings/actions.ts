'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/data';

export async function updateProfile(formData: FormData) {
  const display_name = String(formData.get('display_name') ?? '').trim();
  const units = String(formData.get('units') ?? 'cm') === 'in' ? 'in' : 'cm';

  const { user } = await getSession();
  if (!user) return { error: 'Not signed in.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: display_name || null, units })
    .eq('id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/settings');
  return { ok: true };
}

export async function createInvite() {
  const { user, household } = await getSession();
  if (!user || !household) return { error: 'Not signed in.' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('household_invites')
    .insert({ household_id: household.id })
    .select('code')
    .single();
  if (error || !data) return { error: error?.message ?? 'Could not create an invite.' };

  revalidatePath('/settings');
  return { code: data.code as string };
}
