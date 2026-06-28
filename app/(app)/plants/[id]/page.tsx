import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui';
import { CARE_GROUP_META, PHOTO_BUCKET, type CareGroup, type Photo } from '@/lib/types';
import SpecimenUpload from './SpecimenUpload';
import AddObservation from './AddObservation';
import EditPlant from './EditPlant';
import IdentifyButton from './IdentifyButton';

interface Observation {
  id: string;
  observed_on: string;
  height_cm: number | null;
  span_cm: number | null;
  longest_leaf_cm: number | null;
  bulb_cm: number | null;
  note: string | null;
}

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function PlantDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, household, profile } = await getSession();
  if (!user || !household) return null;

  const supabase = await createClient();
  const { data: specimen } = await supabase
    .from('specimens')
    .select(
      'id, name, notes, confident, acquired, species_id, species:species_id(slug, binomial, care_group, watering)'
    )
    .eq('id', id)
    .eq('household_id', household.id)
    .maybeSingle();
  if (!specimen) notFound();

  const { data: speciesList } = await supabase
    .from('species')
    .select('id, binomial, common_names')
    .order('binomial');
  const speciesOptions = (speciesList ?? []).map((sp) => {
    const common = ((sp.common_names as string[] | null) ?? [])[0];
    return {
      id: sp.id as string,
      label: common ? `${common} — ${sp.binomial}` : (sp.binomial as string),
    };
  });

  const species = specimen.species as unknown as
    | { slug: string; binomial: string; care_group: CareGroup; watering: string | null }
    | null;
  const meta = species ? CARE_GROUP_META[species.care_group] : null;
  const bulbous = species?.care_group === 'bulbous_no_soak';
  const units = profile?.units ?? 'cm';

  const [{ data: obsData }, { data: photoData }] = await Promise.all([
    supabase
      .from('observations')
      .select('id, observed_on, height_cm, span_cm, longest_leaf_cm, bulb_cm, note')
      .eq('specimen_id', id)
      .order('observed_on', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('photos')
      .select('*')
      .eq('specimen_id', id)
      .order('created_at', { ascending: false }),
  ]);

  const observations = (obsData as Observation[]) ?? [];
  const photos = (photoData as Photo[]) ?? [];

  // Sign photo URLs (private bucket).
  let urls: Record<string, string> = {};
  if (photos.length) {
    const { data: signed } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrls(photos.map((p) => p.storage_path), 60 * 60);
    urls = Object.fromEntries(
      (signed ?? [])
        .filter((d) => d.signedUrl && d.path)
        .map((d) => [d.path as string, d.signedUrl as string])
    );
  }
  const coverUrl = photos[0] ? urls[photos[0].storage_path] : undefined;

  // Latest non-null measurements for the "current size" summary.
  const latest = observations.find(
    (o) => o.height_cm || o.span_cm || o.longest_leaf_cm || o.bulb_cm
  );
  const measure = (o: Observation) =>
    [
      o.height_cm != null ? `↥ ${o.height_cm}${units} tall` : null,
      o.span_cm != null ? `↔ ${o.span_cm}${units} wide` : null,
      o.longest_leaf_cm != null ? `🌿 ${o.longest_leaf_cm}${units} leaf` : null,
      o.bulb_cm != null ? `🧅 ${o.bulb_cm}${units} bulb` : null,
    ].filter(Boolean) as string[];

  return (
    <div className="pb-4">
      <Link href="/plants" className="text-sm font-semibold text-green">
        ← Plants
      </Link>

      {/* Cover photo + identity */}
      <div
        className="relative mt-3 flex h-44 items-end overflow-hidden rounded-card px-4 pb-4 text-white shadow-soft"
        style={
          coverUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(31,42,35,.1), rgba(31,42,35,.82)), url('${coverUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: `linear-gradient(135deg, ${meta?.color ?? '#3f7d52'}, rgba(31,42,35,.85))` }
        }
      >
        {!coverUrl ? (
          <span className="absolute -right-3 -top-5 text-[120px] opacity-25" aria-hidden="true">
            {meta?.emoji ?? '🌿'}
          </span>
        ) : null}
        <div className="relative">
          <h1 className="font-display text-2xl font-extrabold drop-shadow">{specimen.name}</h1>
          {species ? (
            <p className="text-[13px] italic opacity-95 drop-shadow">{species.binomial}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {meta ? <Badge color={meta.color}>{meta.label}</Badge> : null}
        {!specimen.confident ? <Badge color="#9a5a23">Provisional ID</Badge> : null}
        <div className="ml-auto flex items-center gap-3">
          {species ? (
            <Link href={`/species/${species.slug}`} className="text-sm font-semibold text-green">
              Care guide →
            </Link>
          ) : null}
          <EditPlant
            specimenId={id}
            name={specimen.name}
            speciesId={(specimen.species_id as string | null) ?? null}
            confident={specimen.confident}
            species={speciesOptions}
          />
        </div>
      </div>

      {/* Current size summary */}
      {latest ? (
        <div className="mt-4 rounded-card bg-green-tint px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-green-deep">Latest size</p>
          <p className="mt-1 text-sm font-semibold text-green-deep">
            {measure(latest).join('  ·  ')}
            <span className="font-normal"> — {fmtDate(latest.observed_on)}</span>
          </p>
        </div>
      ) : null}

      {/* AI identify (Phase 2A) */}
      {!specimen.confident ? (
        <div className="mt-4">
          <IdentifyButton specimenId={id} />
        </div>
      ) : null}

      {/* Log an update */}
      <div className="mt-4">
        <AddObservation specimenId={id} bulbous={bulbous} units={units} />
      </div>

      {/* Progress timeline */}
      <section className="mt-6">
        <h2 className="mb-3 font-display text-xl font-bold text-ink">Progress</h2>
        {observations.length === 0 ? (
          <p className="rounded-card bg-card px-4 py-6 text-center text-sm text-ink-soft shadow-soft">
            No updates yet. Log this plant&apos;s size and a note today — then again in a few weeks
            to watch it grow. 🌱
          </p>
        ) : (
          <ol className="relative space-y-3 border-l-2 border-[#e6e3da] pl-5">
            {observations.map((o) => {
              const m = measure(o);
              return (
                <li key={o.id} className="relative">
                  <span
                    className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-green ring-4 ring-canvas"
                    aria-hidden="true"
                  />
                  <div className="rounded-card bg-card px-4 py-3 shadow-soft">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                      {fmtDate(o.observed_on)}
                    </p>
                    {m.length ? (
                      <p className="mt-1 text-sm font-semibold text-ink">{m.join('  ·  ')}</p>
                    ) : null}
                    {o.note ? <p className="mt-1 text-sm text-ink-soft">{o.note}</p> : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {/* Photos for this plant */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">
            Photos{photos.length ? ` · ${photos.length}` : ''}
          </h2>
        </div>
        <div className="mb-4">
          <SpecimenUpload householdId={household.id} userId={user.id} specimenId={id} />
        </div>
        {photos.length > 0 ? (
          <ul className="grid grid-cols-3 gap-3">
            {photos.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-2xl bg-[#ece9e1] shadow-soft">
                {urls[p.storage_path] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urls[p.storage_path]}
                    alt={`${specimen.name} on ${p.taken_on ?? ''}`}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="skeleton aspect-square w-full" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
