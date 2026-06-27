-- ===========================================================================
-- Tillandsia — species seed (the 4 care sheets)
-- Taxonomy verified against Kew POWO; care cross-checked (see spec §9).
-- "Belize" / "Guatemala" / "Red form" are horticultural forms, NOT taxa.
-- ===========================================================================

insert into public.species
  (slug, binomial, authority, common_names, care_group, native_range, max_size_cm, mesic_xeric, trichome_notes,
   watering, light, fertilizer, air, bloom, pups, display, calgary_notes, sources)
values
(
  'tillandsia-bulbosa', 'Tillandsia bulbosa', 'Hook.',
  array['Bulbous airplant'], 'bulbous_no_soak',
  'Tropical America (C. America, West Indies, S. Mexico, N./E. South America)', 25, 'mesic',
  'Smooth green leaves, swollen bulb base.',
  'Mist or quick mist-dunk every ~3 days. NEVER long-soak — water trapped in the bulb causes rot. Shake out, dry fast.',
  'Bright indirect.', 'Quarter-strength bromeliad fertiliser monthly.', 'High airflow — must dry within a few hours.',
  'Violet flowers from a red spike.', 'Pups after blooming.',
  'Open, removable mounts that can hang tip-down to drain. No closed globes, no moss-packing, no glue.',
  'Hard tap water → use RO/distilled. Dry winters → mist more often Nov–Feb.',
  array['Air Plant Design Studio','Cuffel Farms','Travaldo','Kew POWO']
),
(
  'tillandsia-caput-medusae', 'Tillandsia caput-medusae', 'É.Morren',
  array['Medusa''s head'], 'bulbous_no_soak',
  'Mexico to Central America (Panama → S. Sonora)', 32, 'mesic',
  'Silvery-grey trichomes; snake-like channelled leaves; bulbous base.',
  'Mist every ~3 days; more drought-tolerant than bulbosa but still NO long soak. Dry fast.',
  'Bright indirect to some direct.', 'Quarter-strength monthly.', 'Good airflow; dry quickly.',
  'Red unbranched/digitate spike, violet flowers.', 'Pups after blooming.',
  'Open/removable mounts, footed dishes, himmeli. No sealed containers or moss-packed bases.',
  'RO/distilled water; brightest window in winter.',
  array['Gulley Greenhouse','Garden Betty','Travaldo','Kew POWO']
),
(
  'tillandsia-pruinosa', 'Tillandsia pruinosa', 'Sw.',
  array['Fuzzywuzzy airplant'], 'bulbous_no_soak',
  'S. Mexico & Florida through C. America, the West Indies, and N. South America', 20,
  'looks xeric, behaves mesic',
  'Densely pruinose (velvety) trichomes — looks desert-dry but wants humidity.',
  'Mist every ~3 days; loves humidity + bright indirect. NEVER soak; dry fast (the fuzz traps water).',
  'Bright indirect.', 'Quarter-strength monthly.', 'High airflow; dry within hours.',
  'Tubular violet flowers from a pink/red spike.', 'Pups after blooming.',
  'Open, removable mounts; lift out to mist. No sealed globes or moss-packing.',
  'Hard water clogs the trichomes → RO/rain. Mist more in dry Calgary winters.',
  array['Air Plant Design Studio','Travaldo','Garden Betty','Kew POWO']
),
(
  'soft-rosette-ionantha-group', 'Tillandsia ionantha', null,
  array['Sky plant','Soft rosettes'], 'soft_rosette_soak_safe',
  'Mexico & Central America', 8, 'mesic',
  'Soft rosette of silvery-green leaves; blushes red at bloom.',
  'SOAK-SAFE: dunk/soak ~weekly (≈20 min), then shake out and dry within 4h. Still must be removable — no moss-packing.',
  'Bright indirect to gentle direct.', 'Quarter-strength monthly.', 'Dry within 4h after soaking.',
  'Purple flowers; whole rosette blushes red.', 'Clusters of pups → clumps.',
  'Open globes/teardrops fine, but keep removable for the weekly soak. No sealed containers.',
  'RO/distilled; brightest window in winter; soak rather than mist in very dry air.',
  array['Air Plant Design Studio','Cuffel Farms','Garden Betty','Kew POWO']
);
