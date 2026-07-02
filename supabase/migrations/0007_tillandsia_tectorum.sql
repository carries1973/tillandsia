-- ===========================================================================
-- Tillandsia — add Tillandsia tectorum (Snowball / Fuzzy tectorum).
-- The app's first XERIC species: a high-altitude Andean plant under the
-- densest silvery-white trichomes of any Tillandsia. Care is the opposite of
-- mesic juncea — mist sparingly, NEVER soak, maximum light, dry within ~1 h.
-- Fills the previously-empty "xeric_grey" care group (spec §9). Safe to re-run.
-- ===========================================================================

insert into public.species
  (slug, binomial, authority, common_names, care_group, native_range, max_size_cm,
   mesic_xeric, trichome_notes, watering, light, fertilizer, air, bloom, pups, display,
   calgary_notes, sources, humidity, temp_range, bloom_season, dry_time, difficulty,
   propagation, troubleshooting, common_mistakes, hero_image_url)
values (
  'tillandsia-tectorum', 'Tillandsia tectorum', 'É.Morren ex Baker',
  array['Snowball','Fuzzy tectorum'], 'xeric_grey',
  'Andes of Ecuador & Peru — high-elevation, arid (lithophyte on rock/cliffs)', 15, 'xeric',
  'Ultra-dense silvery-white trichomes (scurf) coat the whole plant for a frosted, snowball look — the fuzziest Tillandsia. They reflect intense high-altitude UV and pull moisture from fog, so it reads bright white when well-hydrated and greyer/lifted when thirsty.',
  'Mist every ~1–2 weeks (closer to weekly in dry Calgary winters). Do NOT soak or submerge — this high-altitude xeric plant hates staying wet. A thorough misting that wets the trichomes is plenty; then dry fully within ~1 h with strong airflow. Grey, lifted trichomes = mist soon.',
  'The brightest spot you have — bright indirect to some direct sun (gentle morning/late-afternoon). The dense fuzz reflects light, so it needs MORE than most air plants. A full-spectrum grow light helps through Calgary winters.',
  'Very dilute (¼ strength or less) bromeliad feed in the misting water every 4–6 weeks spring–fall. Over-feeding burns the trichomes — less is more.',
  'Excellent airflow is essential — it must dry within ~1 h after misting. A nearby fan prevents rot.',
  'A pinkish spike with small violet/purple flowers; relatively rare indoors but more likely with bright light. Each head is monocarpic — the bloomed rosette slowly declines while pups take over.',
  'Pups (offsets) form at the base as it matures or after blooming. Separate at ~⅓–½ the mother''s size with a gentle twist or sterile scissors, or leave them on to clump.',
  'Mounted on porous rock, cholla wood, or driftwood, or in open bowls/wire — open displays show off the fuzz and keep airflow high. Avoid closed terrariums or globes (moisture + poor airflow = rot).',
  'Very tolerant of dry Calgary winter air — but give it your brightest window plus a grow light in low winter light, and mist a little more often when the heating is on. Use RO/rain water; avoid softened water (salts). Summer: a bright, protected outdoor spot is a boost — bring it in before nights drop below ~10°C.',
  array['Air Plant Design Studio','Travaldo','Gulley Greenhouse','Kew POWO'],
  'Low–Medium (40–60%)', '10–27°C', 'Spring–Summer', '< 1 h', 'Moderate',
  'Pups appear at the base; divide once each is ⅓–½ the parent''s size, or leave attached to build a clump. Seed is possible but extremely slow.',
  'Soft/mushy or blackening base = too much moisture or poor drying (rot) — trim and improve airflow fast; this species is very moisture-sensitive. Brown crispy tips/patches = harsh hot sun or dehydration. Loss of the bright white fuzz, or pale/stretched growth = not enough light. Tightly curling leaves = thirsty, mist more.',
  'Soaking it like a mesic plant · too little light (it greys out and won''t bloom) · leaving it wet with weak airflow · softened/hard tap water that clogs the trichomes.',
  '/species/tillandsia-tectorum.jpg'
)
on conflict (slug) do nothing;
