-- ===========================================================================
-- Tillandsia — add Tillandsia seleriana (Seleriana air plant).
-- A fat, fuzzy silvery PSEUDOBULB tapering to pointed velvety leaves — one of
-- the largest hollow bulbs of any Tillandsia, so it's especially rot-prone.
-- Filed under bulbous_no_soak (mist/quick dunk + dry fast, NEVER long-soak)
-- per the load-bearing bulbous rule (spec §9), NOT the weekly soak from the
-- source guide. Safe to re-run.
-- ===========================================================================

insert into public.species
  (slug, binomial, authority, common_names, care_group, native_range, max_size_cm,
   mesic_xeric, trichome_notes, watering, light, fertilizer, air, bloom, pups, display,
   calgary_notes, sources, humidity, temp_range, bloom_season, dry_time, difficulty,
   propagation, troubleshooting, common_mistakes, hero_image_url)
values (
  'tillandsia-seleriana', 'Tillandsia seleriana', 'Mez',
  array['Seleriana'], 'bulbous_no_soak',
  'S. Mexico & Central America', 15, 'mesic',
  'Dense silvery-grey velvety trichomes over a swollen, hollow pseudobulb that tapers into a tight starburst of pointed leaves. Looks fuzzy-xeric but the big bulb is the key care feature.',
  'NEVER long-soak — the large hollow pseudobulb traps water and rots from the centre. Mist thoroughly every ~3 days, or give a quick dunk, then turn it upside-down, shake the water out of the bulb, and dry within a few hours. The dense fuzz holds moisture, so strong airflow is essential.',
  'Bright indirect — east/south window. More light brings out stronger silver colour and some blushing. Tolerates gentle direct sun; avoid harsh midday rays.',
  'Diluted (¼–½ strength) bromeliad feed every 2–3 weeks in spring/summer; reduce in winter.',
  'Excellent airflow is critical to keep the fuzzy centre from rotting — it must dry fully within a few hours of watering.',
  'Small purple/lavender flowers emerge from the centre (often from a pink/red bract) when mature. Each head is monocarpic — the mother declines after blooming but throws pups.',
  'Pups form at the base after flowering; separate once each is about ⅓ the parent''s size, or leave them on to clump.',
  'Small holders, shells, wire mounts, or open mini terrariums — keep the bulb able to drain and the air moving. Avoid closed/sealed containers and moss-packed bases.',
  'Fuzzy bulbous types like this love extra misting through dry Calgary winters — but always dry the bulb fully afterwards. Use RO/distilled or filtered water; bright window or grow light in winter.',
  array['Air Plant Design Studio','Travaldo','Garden Betty','Kew POWO'],
  'Medium–High', '15–29°C', 'Spring–Summer', '< 3 h', 'Moderate',
  'Pups (offsets) at the base are the main method — separate at ~⅓ the parent''s size with a gentle twist or sterile scissors, or leave attached to build a clump.',
  'Soft, mushy or blackening base = water trapped in the bulb (rot) — dry it fully and cut soaking out entirely. Brown, dry leaf tips = low humidity (mist more). Dull, greyed colour = not enough light (move brighter).',
  'Long-soaking the hollow bulb · leaving the fuzzy centre wet with weak airflow · sealing it in a closed globe · softened/hard tap water.',
  '/species/tillandsia-seleriana.jpg'
)
on conflict (slug) do nothing;
