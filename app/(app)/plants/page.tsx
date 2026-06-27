import Link from 'next/link';
import { getSession } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { Card, EmptyState, LinkButton, PageTitle, Badge } from '@/components/ui';
import { CARE_GROUP_META, type CareGroup } from '@/lib/types';

export default async function PlantsPage() {
  const { user, household } = await getSession();
  if (!user || !household) return null;

  const supabase = await createClient();
  const { data: specimens } = await supabase
    .from('specimens')
    .select('id, name, confident, code, species:species_id(binomial, care_group)')
    .eq('household_id', household.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <PageTitle>Plants</PageTitle>
        <LinkButton href="/plants/new">＋ Add</LinkButton>
      </div>

      {!specimens || specimens.length === 0 ? (
        <EmptyState
          emoji="🪴"
          title="No plants yet"
          body="Add your first air plant — give it a name you'll recognise."
          action={<LinkButton href="/plants/new">Add your first 🌱</LinkButton>}
        />
      ) : (
        <ul className="space-y-3">
          {specimens.map((s) => {
            const species = s.species as unknown as { binomial: string; care_group: CareGroup } | null;
            const meta = species ? CARE_GROUP_META[species.care_group] : null;
            return (
              <li key={s.id}>
                <Link href={`/plants/${s.id}`}>
                  <Card className="flex items-center gap-3 p-4">
                    <div className="text-2xl" aria-hidden="true">
                      {meta?.emoji ?? '🌿'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{s.name}</p>
                      <p className="truncate text-sm text-ink-soft">
                        {species?.binomial ?? 'Species not set'}
                      </p>
                    </div>
                    {!s.confident ? <Badge color="#9a5a23">Provisional ID</Badge> : null}
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
