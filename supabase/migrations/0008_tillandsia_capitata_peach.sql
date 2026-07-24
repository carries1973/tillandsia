-- ===========================================================================
-- Tillandsia — add Tillandsia capitata 'Peach' (Capitata Peach).
-- A broad-leaved, succulent soft rosette that flushes peach/blush-pink in
-- bright light. Mesic and SOAK-SAFE → soft_rosette_soak_safe care group
-- (weekly soak, dry within 4 h). Content cross-checked (spec §9). Safe to
-- re-run.
-- ===========================================================================

insert into public.species
  (slug, binomial, authority, common_names, care_group, native_range, max_size_cm,
   mesic_xeric, trichome_notes, watering, light, fertilizer, air, bloom, pups, display,
   calgary_notes, sources, humidity, temp_range, bloom_season, dry_time, difficulty,
   propagation, troubleshooting, common_mistakes, hero_image_url)
values (
  'tillandsia-capitata-peach', 'Tillandsia capitata', 'Griseb.',
  array['Capitata Peach'], 'soft_rosette_soak_safe',
  'Mexico, Central America & the Caribbean', 30, 'mesic',
  '''Peach'' is a colour-selected clone: broad, succulent silvery-green leaves that flush a warm peach/blush-pink — strongest in bright light and at bloom. The blush deepens to burgundy on the leaf backs and tips.',
  'SOAK-SAFE: soak ~weekly for 20–30 min (or mist heavily 2–3×/week), then shake out and dry fully within 4 h. Water a bit more often in dry Calgary heating season. Keep it removable — no moss-packed base.',
  'Bright indirect — an east/west window, 4–6+ h of bright filtered light brings out the strongest peach/pink. Avoid harsh scorching midday sun; too little light fades the colour and slows growth.',
  'Diluted (¼–½ strength) bromeliad feed every 2–4 weeks in spring/summer; skip or reduce in winter.',
  'Good airflow is essential — near a fan or open window (no cold drafts). Must dry within ~4 h after watering.',
  'A tall spike with violet/purple-blue tubular flowers when mature; the whole rosette colours up at bloom. Each head is monocarpic — the mother slowly declines after flowering but throws pups.',
  'Pups form at the base after blooming; separate once each is ⅓–½ the mother''s size, or leave them on to build a peach cluster.',
  'Mounted on driftwood, shells, or wire; open bowls/terrariums with no standing water; hanging or wall planters. Group several for a peach cluster.',
  'South-facing window or a grow light through short Calgary winters keeps the colour up. Water a touch more often when the heating dries the air. Use RO/rain or filtered water — avoid softened or heavily chlorinated tap.',
  array['Air Plant Design Studio','Garden Betty','Travaldo','Kew POWO'],
  'Medium (50–70%)', '10–29°C', 'Spring–Summer', '< 4 h', 'Easy',
  'Pups (offsets) at the base are the main method — divide once each is ⅓–½ the parent''s size with a gentle twist or sterile scissors, or leave attached to clump.',
  'Brown crispy tips = under-watering or low humidity (soak/mist more). Rot or a black base = too much water or poor drying (cut back, boost airflow). Fading/dull colour = not enough light (move brighter). Slow growth = low light or no feed (brighten + fertilise).',
  'Letting it sit wet — not drying within 4 h · keeping it too dim so it never colours up · packing the base in moss · softened/hard tap water.',
  '/species/tillandsia-capitata-peach.jpg'
)
on conflict (slug) do nothing;
