import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, EmptyState, PageTitle, Badge } from '@/components/ui';
import { CARE_GROUP_META, type CareGroup } from '@/lib/types';

export default async function SpeciesPage() {
  const supabase = await createClient();
  const { data: species } = await supabase
    .from('species')
    .select('slug, binomial, authority, common_names, care_group, mesic_xeric')
    .order('binomial');

  return (
    <div>
      <PageTitle sub="Verified care for each air-plant type.">Care sheets</PageTitle>

      {!species || species.length === 0 ? (
        <EmptyState
          emoji="📖"
          title="No care sheets loaded"
          body="Run the seed.sql in Supabase to load the four species sheets."
        />
      ) : (
        <ul className="space-y-3">
          {species.map((s) => {
            const meta = CARE_GROUP_META[s.care_group as CareGroup];
            const common = ((s.common_names as string[] | null) ?? [])[0];
            return (
              <li key={s.slug as string}>
                <Link href={`/species/${s.slug}`}>
                  <Card className="flex items-center gap-3 p-4">
                    <div className="text-2xl" aria-hidden="true">
                      {meta.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{common ?? s.binomial}</p>
                      <p className="truncate text-sm italic text-ink-soft">{s.binomial}</p>
                    </div>
                    <Badge color={meta.color}>{meta.label}</Badge>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
