import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, Badge } from '@/components/ui';
import { CARE_GROUP_META, type CareGroup, type Species } from '@/lib/types';

function Section({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="border-t border-[#eef0ea] py-3 first:border-t-0">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 text-[15px] leading-relaxed text-ink">{value}</p>
    </div>
  );
}

export default async function SpeciesDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('species').select('*').eq('slug', slug).maybeSingle();
  if (!data) notFound();
  const s = data as Species;
  const meta = CARE_GROUP_META[s.care_group as CareGroup];
  const common = s.common_names?.[0];

  return (
    <div>
      <Link href="/species" className="text-sm font-semibold text-green">
        ← Care sheets
      </Link>

      <header className="mt-3">
        <div className="text-4xl" aria-hidden="true">
          {meta.emoji}
        </div>
        <h1 className="mt-2 font-display text-[26px] font-bold leading-tight text-ink">
          {common ?? s.binomial}
        </h1>
        <p className="mt-1 text-[15px] italic text-ink-soft">
          {s.binomial}
          {s.authority ? <span className="not-italic"> {s.authority}</span> : null}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge color={meta.color}>{meta.label}</Badge>
          {s.mesic_xeric ? <Badge>{s.mesic_xeric}</Badge> : null}
          {s.max_size_cm ? <Badge>up to {s.max_size_cm} cm</Badge> : null}
        </div>
        {s.native_range ? (
          <p className="mt-2 text-sm text-ink-soft">🌍 {s.native_range}</p>
        ) : null}
      </header>

      {s.care_group === 'bulbous_no_soak' ? (
        <div className="mt-4 rounded-card bg-[#fbe9d6] px-4 py-3 text-sm font-semibold text-[#9a5a23]">
          ⚠️ Bulbous — never long-soak. Water trapped in the bulb causes rot. Mist, shake out,
          dry fast with good airflow.
        </div>
      ) : null}

      <Card className="mt-4 p-5">
        <Section label="Watering" value={s.watering} />
        <Section label="Light" value={s.light} />
        <Section label="Fertilizer" value={s.fertilizer} />
        <Section label="Air & drying" value={s.air} />
        <Section label="Bloom" value={s.bloom} />
        <Section label="Pups" value={s.pups} />
        <Section label="Display" value={s.display} />
        <Section label="Calgary notes" value={s.calgary_notes} />
        <Section label="Trichomes" value={s.trichome_notes} />
      </Card>

      {s.sources?.length ? (
        <p className="mt-4 px-1 text-xs text-ink-soft">Sources: {s.sources.join(' · ')}</p>
      ) : null}
    </div>
  );
}
