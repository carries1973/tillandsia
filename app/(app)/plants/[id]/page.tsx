import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { Card, PageTitle, Badge } from '@/components/ui';
import { CARE_GROUP_META, type CareGroup } from '@/lib/types';
import SpecimenUpload from './SpecimenUpload';

export default async function PlantDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, household } = await getSession();
  if (!user || !household) return null;

  const supabase = await createClient();
  const { data: specimen } = await supabase
    .from('specimens')
    .select(
      'id, name, notes, confident, acquired, species:species_id(slug, binomial, care_group, watering)'
    )
    .eq('id', id)
    .eq('household_id', household.id)
    .maybeSingle();

  if (!specimen) notFound();

  const species = specimen.species as unknown as
    | { slug: string; binomial: string; care_group: CareGroup; watering: string | null }
    | null;
  const meta = species ? CARE_GROUP_META[species.care_group] : null;

  const { count: photoCount } = await supabase
    .from('photos')
    .select('id', { count: 'exact', head: true })
    .eq('specimen_id', id);

  return (
    <div>
      <Link href="/plants" className="text-sm font-semibold text-green">
        ← Plants
      </Link>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-3xl" aria-hidden="true">
          {meta?.emoji ?? '🌿'}
        </span>
        <PageTitle sub={species?.binomial ?? 'Species not set'}>{specimen.name}</PageTitle>
      </div>

      {!specimen.confident ? (
        <div className="mb-4">
          <Badge color="#9a5a23">Provisional ID — confirm the species when you&apos;re sure</Badge>
        </div>
      ) : null}

      {species ? (
        <Card className="mb-4 p-5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">{meta?.label}</span>
            <Link href={`/species/${species.slug}`} className="text-sm font-semibold text-green">
              Full care sheet →
            </Link>
          </div>
          {species.watering ? (
            <p className="mt-2 text-sm text-ink-soft">💧 {species.watering}</p>
          ) : null}
        </Card>
      ) : null}

      {specimen.notes ? (
        <Card className="mb-4 p-5">
          <p className="text-sm font-semibold text-ink">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{specimen.notes}</p>
        </Card>
      ) : null}

      <Card className="p-5">
        <p className="text-sm font-semibold text-ink">
          Photos {photoCount ? `· ${photoCount}` : ''}
        </p>
        <p className="mt-1 mb-3 text-sm text-ink-soft">
          Add a photo of this plant — it also shows in the shared album.
        </p>
        <SpecimenUpload householdId={household.id} userId={user.id} specimenId={id} />
      </Card>
    </div>
  );
}
