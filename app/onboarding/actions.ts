'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createHousehold(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // SECURITY DEFINER RPC creates the household + owner membership atomically.
  const { error } = await supabase.rpc('create_household', { p_name: name });
  if (error) return { error: error.message };

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

  const { error } = await supabase.rpc('accept_invite', { p_code: code });
  if (error) {
    if (error.message.includes('invalid_code'))
      return { error: "That code didn't match. Double-check it with the person who invited you." };
    if (error.message.includes('expired_code'))
      return { error: 'That invite has expired — ask for a new one.' };
    return { error: error.message };
  }

  redirect('/home');
}
