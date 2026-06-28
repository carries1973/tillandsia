'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/data';

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

// Log a dated observation (measurements + note) — this is the progress history.
export async function addObservation(specimenId: string, formData: FormData) {
  const { user } = await getSession();
  if (!user) return { error: 'Not signed in.' };

  const observed_on =
    String(formData.get('observed_on') ?? '').trim() ||
    new Date().toISOString().slice(0, 10);

  const row = {
    specimen_id: specimenId,
    observed_on,
    height_cm: num(formData.get('height_cm')),
    span_cm: num(formData.get('span_cm')),
    longest_leaf_cm: num(formData.get('longest_leaf_cm')),
    bulb_cm: num(formData.get('bulb_cm')),
    note: String(formData.get('note') ?? '').trim() || null,
    created_by: user.id,
  };

  const supabase = await createClient();
  const { error } = await supabase.from('observations').insert(row);
  if (error) return { error: error.message };

  revalidatePath(`/plants/${specimenId}`);
  return { ok: true };
}
