-- ===========================================================================
-- Tillandsia — add Tillandsia butzii (Leopard air plant).
-- Swollen, leopard-spotted pseudobulb base with long, thin, curling
-- "tentacle" leaves. The hollow bulb traps water → filed under
-- bulbous_no_soak (NEVER long-soak; mist/quick dunk + dry fast), per the
-- load-bearing bulbous rule (spec §9), NOT a weekly soak. Safe to re-run.
-- ===========================================================================

insert into public.species
  (slug, binomial, authority, common_names, care_group, native_range, max_size_cm,
   mesic_xeric, trichome_notes, watering, light, fertilizer, air, bloom, pups, display,
   calgary_notes, sources, humidity, temp_range, bloom_season, dry_time, difficulty,
   propagation, troubleshooting, common_mistakes, hero_image_url)
values (
  'tillandsia-butzii', 'Tillandsia butzii', 'Mez',
  array['Leopard air plant'], 'bulbous_no_soak',
  'Mexico to Panama (Central America)', 25, 'mesic',
  'Smooth green leaves (not silvery) with dark purple/green "leopard" spotting on the swollen pseudobulb base. Long, thin, wiry leaves that curl and twist like tentacles.',
  'NEVER long-soak — the hollow pseudobulb traps water and rots from the inside out. Mist thoroughly every ~3 days, or give a quick 1–2 min dunk, then turn it upside-down, shake the water out of the bulb, and let it dry within a few hours in moving air. Mist a bit more in dry Calgary winters, but always dry fully.',
  'Bright indirect — east/south window with a sheer curtain. Tolerates some gentle morning sun; more light deepens the green/purple and tightens the leaf curl. Protect from harsh midday sun.',
  'Diluted (¼–½ strength) bromeliad feed every 2–4 weeks in spring/summer; reduce or skip in winter.',
  'Excellent airflow is critical — no stale corners. The bulb must dry within a few hours after watering or it rots.',
  'A spike with red/pink bracts and small purple/lavender flowers when mature. Each head is monocarpic — the mother declines after blooming but throws pups.',
  'Pups form at the base after flowering; separate once each is about ⅓ the parent''s size, or leave them on to clump.',
  'Hang upside-down or mount on driftwood or wire, or in an open hanging orb — the wild tentacle leaves are made for vertical, dramatic displays. Avoid closed containers and moss-packed bases.',
  'Dry winter air → mist more often, but still dry the bulb fully every time. Use RO/distilled or filtered water; give it a bright window or grow light through short Calgary winters.',
  array['Air Plant Design Studio','Travaldo','Garden Betty','Kew POWO'],
  'Medium–High', '10–29°C', 'Spring–Summer', '< 3 h', 'Easy',
  'Pups (offsets) at the base are the main method — separate at ~⅓ the parent''s size with a gentle twist or sterile scissors, or leave attached to build a curly clump.',
  'Soft, mushy or blackening base = water trapped in the bulb (rot) — dry it out fully and cut soaking back. Brown, dry leaf tips = low humidity or under-watering (mist more). Leaves not curling / floppy = too little light (move brighter).',
  'Long-soaking the bulb like a soft rosette · sealing it in a closed globe · leaving water sitting in the base with weak airflow · softened/hard tap water.',
  '/species/tillandsia-butzii.jpg'
)
on conflict (slug) do nothing;
