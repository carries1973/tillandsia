-- ===========================================================================
-- Tillandsia — add Tillandsia juncea (Rush / Grass air plant).
-- A tall, slender, grass-like mesic-leaning species. Filed under the "wispy"
-- care group (grass/rush archetype) but it is SOAK-SAFE: its thin reed-like
-- leaves want a weekly soak, NOT just misting — the watering text leads with
-- "SOAK-SAFE:" so the at-a-glance vitals read it correctly. Safe to re-run.
-- Content cross-checked for horticultural accuracy (spec §9).
-- ===========================================================================

insert into public.species
  (slug, binomial, authority, common_names, care_group, native_range, max_size_cm,
   mesic_xeric, trichome_notes, watering, light, fertilizer, air, bloom, pups, display,
   calgary_notes, sources, humidity, temp_range, bloom_season, dry_time, difficulty,
   propagation, troubleshooting, common_mistakes, hero_image_url)
values (
  'tillandsia-juncea', 'Tillandsia juncea', '(Ruiz & Pav.) Poir.',
  array['Rush air plant','Grass air plant'], 'wispy',
  'Mexico & C. America through tropical South America', 30, 'mesic-leaning',
  'Fine, reed-like green leaves (not heavily silver) in a loose spreading rosette. The woody brown base is natural — not rot or damage.',
  'SOAK-SAFE: submerge fully for ~20–60 min weekly (the thin reed-like leaves dry out faster than xeric types, so it drinks more than a silvery air plant). Supplement with misting 2–4×/week in dry indoor air. Always shake out and dry within ~4 h.',
  'Bright indirect — an east/west window or filtered south. Avoid harsh midday sun, which scorches the thin leaves. Good light brings out reddish-bronze tints.',
  'Quarter- to half-strength bromeliad feed in the soak water every 2–4 weeks spring–fall. Skip in winter; don''t over-feed.',
  'Airflow is critical — dry fully within ~4 h after soaking, ideally tip-down in moving air, so water never sits in the crown.',
  'A tall spike (15–25 cm above the foliage) with red/pink bracts and small violet tubular flowers; blooms last weeks. Each head is monocarpic — the mother slowly declines after flowering but throws pups.',
  'Pups emerge at the base. Separate once a pup is about a third of the mother''s size (twist gently or use sterilised scissors), or leave them on for a fuller grass-like clump.',
  'Tall vases, mounted on cholla wood or driftwood, or in open terrariums — it adds height and movement. Keep it removable and open for airflow; no sealed globes or moss-packed bases.',
  'Dry Calgary winters → mist more and use a humidifier or pebble tray. Short winter days → a full-spectrum grow light helps. Use RO/rain water; hard tap water leaves spotting.',
  array['Air Plant Design Studio','Travaldo','Garden Betty','Kew POWO'],
  'Medium–High (40–60%+)', '10–32°C', 'Spring–Summer', '< 4 h', 'Easy',
  'Pups (offsets) are the main method — they emerge at the base. Separate at ~1/3 the parent''s size with a gentle twist or sterile scissors, or leave attached to build a full clump. Seed is possible but takes years.',
  'Rot = water sitting in the crown or poor drying/airflow; trim affected leaves and improve circulation. Crispy, wilting leaves = thirsty, soak more often. Brown leaf tips = normal aging, low humidity, or sun scorch — trim if unsightly. Mealybugs/scale/spider mites are rare; treat with isopropyl swabs, insecticidal soap, or neem and quarantine new plants.',
  'Misting only and never giving it a proper weekly soak (the thin leaves dehydrate) · leaving it wet with no airflow after soaking · harsh direct midday sun · reading the natural woody brown base as rot.',
  '/species/tillandsia-juncea.jpg'
)
on conflict (slug) do nothing;
