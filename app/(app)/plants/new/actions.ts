'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/data';

export async function addPlant(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const speciesId = String(formData.get('species_id') ?? '').trim();
  const notes = String(formData.get('notes') ?? '').trim();

  if (!name) return { error: 'Give your plant a name.' };

  const { user, household } = await getSession();
  if (!user || !household) redirect('/login');

  const supabase = await createClient();
  const { error } = await supabase.from('specimens').insert({
    household_id: household.id,
    name,
    species_id: speciesId || null,
    notes: notes || null,
    confident: Boolean(speciesId),
    created_by: user.id,
  });
  if (error) return { error: error.message };

  redirect('/plants');
}
