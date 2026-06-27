import { getSession } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { PageTitle } from '@/components/ui';
import NewPlantForm from './NewPlantForm';

export default async function NewPlantPage() {
  const { user, household } = await getSession();
  if (!user || !household) return null;

  const supabase = await createClient();
  const { data: species } = await supabase
    .from('species')
    .select('id, binomial, common_names')
    .order('binomial');

  return (
    <div>
      <PageTitle sub="You can set the species now or leave it as a guess.">Add a plant</PageTitle>
      <NewPlantForm
        species={(species ?? []).map((s) => ({
          id: s.id as string,
          binomial: s.binomial as string,
          common: ((s.common_names as string[] | null) ?? [])[0] ?? '',
        }))}
      />
    </div>
  );
}
