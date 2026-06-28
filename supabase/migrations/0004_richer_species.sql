-- ===========================================================================
-- Tillandsia — richer species care sheets
-- Adds at-a-glance vitals (humidity/temp/bloom season/dry time/difficulty),
-- deeper sections (propagation/troubleshooting/common mistakes), and an
-- optional hero image. Content is horticulturally accurate (spec §9).
-- ===========================================================================

alter table public.species add column if not exists humidity        text;
alter table public.species add column if not exists temp_range      text;
alter table public.species add column if not exists bloom_season    text;
alter table public.species add column if not exists dry_time        text;
alter table public.species add column if not exists difficulty      text;
alter table public.species add column if not exists propagation     text;
alter table public.species add column if not exists troubleshooting text;
alter table public.species add column if not exists common_mistakes text;
alter table public.species add column if not exists hero_image_url  text;

-- T. bulbosa --------------------------------------------------------------
update public.species set
  humidity='High', temp_range='15–30°C', bloom_season='Summer',
  dry_time='< 3 h', difficulty='Easy',
  watering='Mist thoroughly or give a quick 1–2 min dunk every ~3 days. NEVER long-soak — the hollow bulb traps water and rots from the inside out. After watering, turn it upside-down, shake out trapped water, and let it dry within ~3 hours in bright, moving air.',
  propagation='After blooming, the mother sends out 2–4 pups from the base. Leave each pup attached until it reaches about a third of the mother''s size, then twist it off gently — or leave them all on to grow as a clump.',
  troubleshooting='Soft, darkening or smelly base = water trapped in the bulb (rot); cut watering back and boost airflow. Tightly curling leaves = thirsty; mist more often. Brown crispy tips = dry air or hard-water salts.',
  common_mistakes='Soaking it like a soak-safe rosette · sealing it in a closed glass globe · mounting it base-down so water pools · using hard Calgary tap water instead of RO/rain.'
where slug='tillandsia-bulbosa';

-- T. caput-medusae --------------------------------------------------------
update public.species set
  humidity='Medium', temp_range='15–32°C', bloom_season='Spring–Summer',
  dry_time='< 4 h', difficulty='Easy',
  watering='Mist every ~3 days, or give a brief dunk. Its heavier silver trichomes make it more drought-tolerant than bulbosa, but it still must NOT be long-soaked. Always dry fast, bulb pointing down.',
  propagation='Pups appear at the base after the red flower spike fades. Caput-medusae clumps beautifully — many growers leave the pups on to build a full "head of snakes".',
  troubleshooting='Mushy bulb base = rot from trapped water. Grey leaves going dull or limp = thirsty, mist more. Loss of the silvery sheen = hard-water minerals clogging the trichomes; switch to RO/rain.',
  common_mistakes='Long soaks · moss-packed bases · too little light, which makes the leaves stretch and flop.'
where slug='tillandsia-caput-medusae';

-- T. pruinosa -------------------------------------------------------------
update public.species set
  humidity='High', temp_range='15–30°C', bloom_season='Spring',
  dry_time='< 3 h', difficulty='Moderate',
  watering='Mist every ~3 days and give it bright indirect light and humidity — it thrives on moist air. The dense velvety fuzz traps water, so NEVER soak it and always dry it fast, or the crown will rot.',
  propagation='Usually one pup (sometimes two) after flowering, and it grows slowly. Best left in place to form a small clump over time.',
  troubleshooting='Crown stays wet or rots = it was soaked or has poor airflow. Fuzz looks matted, grey and lifeless = hard water clogging the trichomes; use RO/rain. Fading colour = it wants brighter indirect light.',
  common_mistakes='Reading the fuzz as "it needs less water" — it actually wants humidity · soaking it · leaving it wet with no airflow after misting.'
where slug='tillandsia-pruinosa';

-- T. ionantha (soft rosettes) ---------------------------------------------
update public.species set
  humidity='Medium', temp_range='10–32°C', bloom_season='Spring',
  dry_time='< 4 h', difficulty='Beginner',
  watering='SOAK-SAFE: dunk or soak for ~20 min about once a week (mist more in very dry winters). Then shake it out and dry it upside-down within 4 hours. Keep it removable — never pack the base in moss.',
  propagation='A prolific pupper — offsets cluster tightly around the base and quickly form clumps. Leave them on for a fuller display, or divide once each pup has its own roots.',
  troubleshooting='Leaves curling inward or wrinkled = thirsty, give it a soak. Brown mushy centre = it stayed wet too long after soaking. No red blush = it wants brighter light.',
  common_mistakes='Forgetting to dry it within 4 h after a soak · keeping it too dim so it never blushes or blooms · burying the base in moss.',
  hero_image_url='/species/soft-rosette-ionantha-group.jpg'
where slug='soft-rosette-ionantha-group';
