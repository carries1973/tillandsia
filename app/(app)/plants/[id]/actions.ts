'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/data';

// Remove a plant. Its photos return to the album (FK set null); its
// observation log is removed. Photos are never deleted here.
export async function deleteSpecimen(specimenId: string) {
  const { user, household } = await getSession();
  if (!user || !household) return { error: 'Not signed in.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('specimens')
    .delete()
    .eq('id', specimenId)
    .eq('household_id', household.id);
  if (error) return { error: error.message };

  revalidatePath('/plants');
  redirect('/plants');
}

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

// Rename a plant / correct its species / confirm the ID.
export async function updateSpecimen(specimenId: string, formData: FormData) {
  const { user, household } = await getSession();
  if (!user || !household) return { error: 'Not signed in.' };

  const name = String(formData.get('name') ?? '').trim();
  if (!name) return { error: 'Give your plant a name.' };
  const species_id = String(formData.get('species_id') ?? '').trim() || null;
  const confident = formData.get('confident') === 'on';

  const supabase = await createClient();
  const { error } = await supabase
    .from('specimens')
    .update({ name, species_id, confident })
    .eq('id', specimenId)
    .eq('household_id', household.id);
  if (error) return { error: error.message };

  revalidatePath(`/plants/${specimenId}`);
  revalidatePath('/plants');
  return { ok: true };
}

// Log a dated observation (measurements + note) — this is the progress history.
export async function addObservation(specimenId: string, formData: FormData) {
  const { user } = await getSession();
  if (!user) return { error: 'Not signed in.' };

  const observed_on =
    String(formData.get('observed_on') ?? '').trim() ||
    new Date().toISOString().slice(0, 10);

  const pupRaw = num(formData.get('pup_count'));

  const row = {
    specimen_id: specimenId,
    observed_on,
    height_cm: num(formData.get('height_cm')),
    span_cm: num(formData.get('span_cm')),
    longest_leaf_cm: num(formData.get('longest_leaf_cm')),
    bulb_cm: num(formData.get('bulb_cm')),
    bloomed: formData.get('bloomed') === 'on',
    pup_count: pupRaw == null ? null : Math.max(0, Math.round(pupRaw)),
    note: String(formData.get('note') ?? '').trim() || null,
    created_by: user.id,
  };

  const supabase = await createClient();
  const { error } = await supabase.from('observations').insert(row);
  if (error) return { error: error.message };

  revalidatePath(`/plants/${specimenId}`);
  return { ok: true };
}
