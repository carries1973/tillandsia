'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createHousehold(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim() || 'Our Garden';
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: household, error } = await supabase
    .from('households')
    .insert({ name })
    .select('id')
    .single();
  if (error || !household) {
    return { error: error?.message ?? 'Could not create your garden.' };
  }

  const { error: memberError } = await supabase.from('household_members').insert({
    household_id: household.id,
    user_id: user.id,
    role: 'owner',
  });
  if (memberError) return { error: memberError.message };

  redirect('/home');
}

export async function joinHousehold(formData: FormData) {
  const code = String(formData.get('code') ?? '').trim().toLowerCase();
  if (!code) return { error: 'Enter the invite code.' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: invite } = await supabase
    .from('household_invites')
    .select('id, household_id, expires_at')
    .eq('code', code)
    .maybeSingle();

  if (!invite) return { error: "That code didn't match. Double-check it with the person who invited you." };
  if (new Date(invite.expires_at) < new Date()) return { error: 'That invite has expired — ask for a new one.' };

  const { error: memberError } = await supabase.from('household_members').insert({
    household_id: invite.household_id,
    user_id: user.id,
    role: 'member',
  });
  if (memberError) return { error: memberError.message };

  await supabase
    .from('household_invites')
    .update({ accepted_by: user.id })
    .eq('id', invite.id);

  redirect('/home');
}
