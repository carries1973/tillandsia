-- ===========================================================================
-- Tillandsia — add the fuzzy fine-leaf species + turn the imported album
-- photos into tracked specimens (one plant per photo), each linked to the
-- species identified from the photo. Specimen creation is guarded on
-- specimen_id IS NULL so this is safe to re-run.
-- ===========================================================================

insert into public.species
  (slug, binomial, authority, common_names, care_group, native_range, max_size_cm,
   mesic_xeric, trichome_notes, watering, light, fertilizer, air, bloom, pups, display,
   calgary_notes, sources, humidity, temp_range, bloom_season, dry_time, difficulty,
   propagation, troubleshooting, common_mistakes, hero_image_url)
values (
  'fuzzy-fine-rosette', 'Tillandsia fuchsii', null,
  array['Fuzzy air plant','Fine-leaf / cobweb rosette'], 'wispy',
  'Mexico (highlands)', 12, 'looks xeric, behaves mesic',
  'Densely silver-trichomed with very fine, needle-like leaves in a round pompom — the heavy fuzz makes it look desert-dry but it likes regular water.',
  'Mist every ~2–3 days, or give a quick dunk. The dense fuzz makes it look drought-proof, but it enjoys frequent water and bright indirect light — just dry it fast (within ~3 h) so the tightly packed leaves never sit wet.',
  'Bright indirect to gentle morning sun.',
  'Quarter-strength bromeliad feed about monthly.',
  'Needs good airflow to dry quickly — the fuzz holds water.',
  'A slender spike with violet/red flowers.',
  'Pups from the base; clusters into a tight pompom clump.',
  'Open mounts or dishes, kept removable. No sealed globes, no moss-packing.',
  'Use RO/distilled — hard Calgary water mats the fuzz. Mist more in dry winters.',
  array['Air Plant Design Studio','Travaldo'],
  'Medium–High', '10–30°C', 'Spring', '< 3 h', 'Moderate',
  'Pups form at the base and build a clump; divide once each pup has its own roots.',
  'Matted, grey, lifeless fuzz = hard-water buildup; switch to RO/rain. Rotting centre = it stayed wet. Browning fine tips = too dry or under-watered.',
  'Soaking the dense fuzz · leaving it wet with no airflow · keeping it too dim.',
  '/species/fuzzy-fine-rosette.jpg'
)
on conflict (slug) do nothing;

-- Turn imported (unsorted) photos into one tracked plant each ---------------
do $$
declare
  hh  uuid := 'd7426217-7066-41a3-8064-447f3c4b40d9';
  uid uuid := 'bed1e0b5-7107-4cda-adf6-d823e47200bf';
  sp_bul uuid; sp_ion uuid; sp_fuz uuid;
  rec record;
  idx int := 0;
  -- species per photo, in upload order (my visual ID; provisional)
  kinds text[] := array['ion','fuzzy','ion','fuzzy','ion','bul','bul','bul','ion','ion','ion','fuzzy','ion'];
  k text; sp uuid; nm text;
  c_bul int := 0; c_ion int := 0; c_fuz int := 0;
  new_spec uuid;
begin
  select id into sp_bul from public.species where slug='tillandsia-bulbosa';
  select id into sp_ion from public.species where slug='soft-rosette-ionantha-group';
  select id into sp_fuz from public.species where slug='fuzzy-fine-rosette';

  for rec in
    select id from public.photos
    where household_id = hh and specimen_id is null
    order by created_at asc, id asc
  loop
    k := coalesce(kinds[idx+1], 'ion');
    if k='bul' then sp:=sp_bul; c_bul:=c_bul+1; nm:='Bulbosa '||c_bul;
    elsif k='fuzzy' then sp:=sp_fuz; c_fuz:=c_fuz+1; nm:='Fuzzy '||c_fuz;
    else sp:=sp_ion; c_ion:=c_ion+1; nm:='Sky plant '||c_ion;
    end if;

    insert into public.specimens (household_id, name, species_id, confident, created_by)
      values (hh, nm, sp, (k='bul'), uid)
      returning id into new_spec;

    update public.photos    set specimen_id   = new_spec where id = rec.id;
    update public.specimens set cover_photo_id = rec.id   where id = new_spec;
    idx := idx + 1;
  end loop;
end $$;
