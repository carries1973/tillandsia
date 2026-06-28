import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CARE_GROUP_META, type CareGroup, type Species } from '@/lib/types';

// Short "at a glance" vitals derived from the species data (prototype design).
function vitals(s: Species) {
  // Soak-safe species (their watering text leads with "SOAK-SAFE") soak weekly,
  // whatever their care group — e.g. grass-like T. juncea sits in "wispy" but
  // wants a soak, not just misting.
  const soakSafe =
    s.care_group === 'soft_rosette_soak_safe' || /soak[\s-]?safe/i.test(s.watering ?? '');
  const water = soakSafe
    ? 'Soak ~wk'
    : s.care_group === 'xeric_grey'
      ? 'Mist ~2wk'
      : 'Mist ~3d';
  const light = (s.light ?? 'Bright').split(/[ ,]/)[0];
  return [
    { icon: '💧', value: water, key: 'Water' },
    { icon: '☀️', value: light, key: 'Light' },
    { icon: '📏', value: s.max_size_cm ? `${s.max_size_cm} cm` : '—', key: 'Size' },
    { icon: '⏱️', value: s.dry_time ?? '—', key: 'Dry by' },
    { icon: '💦', value: s.humidity ?? '—', key: 'Humidity' },
    { icon: '📊', value: s.difficulty ?? '—', key: 'Level' },
  ];
}

const SECTIONS: { icon: string; label: string; field: keyof Species }[] = [
  { icon: '💧', label: 'Watering', field: 'watering' },
  { icon: '☀️', label: 'Light', field: 'light' },
  { icon: '🌬️', label: 'Air & drying', field: 'air' },
  { icon: '🧪', label: 'Fertilizer', field: 'fertilizer' },
  { icon: '🌸', label: 'Bloom', field: 'bloom' },
  { icon: '🌱', label: 'Pups & propagation', field: 'propagation' },
  { icon: '🩺', label: 'Troubleshooting', field: 'troubleshooting' },
  { icon: '🚫', label: 'Common mistakes', field: 'common_mistakes' },
  { icon: '🪴', label: 'Display', field: 'display' },
  { icon: '❄️', label: 'Calgary notes', field: 'calgary_notes' },
  { icon: '✨', label: 'Trichomes', field: 'trichome_notes' },
];

export default async function SpeciesDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('species').select('*').eq('slug', slug).maybeSingle();
  if (!data) notFound();
  const s = data as Species;
  const meta = CARE_GROUP_META[s.care_group as CareGroup];
  const common = s.common_names?.[0];
  const sections = SECTIONS.filter((sec) => s[sec.field]);

  const heroStyle = s.hero_image_url
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(31,42,35,.15) 0%, rgba(31,42,35,.85) 100%), url('${s.hero_image_url}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: `linear-gradient(135deg, ${meta.color} 0%, ${meta.color}cc 55%, rgba(31,42,35,.85) 100%)`,
      };

  return (
    <div className="pb-4">
      <Link href="/species" className="text-sm font-semibold text-green">
        ← Care sheets
      </Link>

      {/* Hero banner — real photo when we have one, else a care-group colour wash */}
      <div
        className="relative mt-3 flex h-52 items-end overflow-hidden rounded-card px-4 pb-12 pt-4 text-white shadow-soft"
        style={heroStyle}
      >
        {!s.hero_image_url ? (
          <span
            className="pointer-events-none absolute -right-3 -top-5 text-[120px] leading-none opacity-25"
            aria-hidden="true"
          >
            {meta.emoji}
          </span>
        ) : null}
        <div className="relative">
          <span className="mb-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur">
            {meta.emoji} {meta.label}
          </span>
          <h1 className="font-display text-2xl font-extrabold leading-tight drop-shadow">
            {common ?? s.binomial}
          </h1>
          <p className="text-[13px] italic opacity-95 drop-shadow">
            {s.binomial}
            {s.authority ? <span className="not-italic"> · {s.authority}</span> : null}
          </p>
        </div>
      </div>

      {/* At-a-glance vitals — overlap the hero like the prototype */}
      <div className="relative z-10 -mt-8 grid grid-cols-3 gap-2 px-1">
        {vitals(s).map((v) => (
          <div key={v.key} className="rounded-2xl bg-card px-1 py-2.5 text-center shadow-soft">
            <div className="text-lg" aria-hidden="true">
              {v.icon}
            </div>
            <div className="mt-0.5 text-[12px] font-extrabold leading-tight text-ink">
              {v.value}
            </div>
            <div className="text-[9px] uppercase tracking-wide text-ink-soft">{v.key}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {s.mesic_xeric ? (
          <span className="rounded-full bg-green-tint px-3 py-1 text-xs font-semibold text-green-deep">
            {s.mesic_xeric}
          </span>
        ) : null}
        {s.bloom_season ? (
          <span className="rounded-full bg-green-tint px-3 py-1 text-xs font-semibold text-green-deep">
            🌸 Blooms {s.bloom_season}
          </span>
        ) : null}
        {s.temp_range ? (
          <span className="rounded-full bg-green-tint px-3 py-1 text-xs font-semibold text-green-deep">
            🌡️ {s.temp_range}
          </span>
        ) : null}
        {s.native_range ? (
          <span className="rounded-full bg-green-tint px-3 py-1 text-xs font-semibold text-green-deep">
            🌍 {s.native_range}
          </span>
        ) : null}
      </div>

      {s.care_group === 'bulbous_no_soak' ? (
        <div className="mt-4 rounded-card bg-[#fbe9d6] px-4 py-3 text-sm font-semibold text-[#9a5a23]">
          ⚠️ Bulbous — never long-soak. Water trapped in the bulb causes rot. Mist, shake out,
          dry fast with good airflow.
        </div>
      ) : null}

      {/* Tap-to-expand sections (native <details> — accessible, keyboard-friendly) */}
      <div className="mt-4 space-y-2">
        {sections.map((sec, i) => (
          <details
            key={sec.label}
            open={i === 0}
            className="group rounded-card bg-card shadow-soft"
          >
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true">{sec.icon}</span>
              <span className="flex-1">{sec.label}</span>
              <span
                className="text-ink-soft transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                ⌄
              </span>
            </summary>
            <p className="px-4 pb-4 text-[15px] leading-relaxed text-ink-soft">
              {s[sec.field] as string}
            </p>
          </details>
        ))}
      </div>

      {s.sources?.length ? (
        <p className="mt-4 px-1 text-xs text-ink-soft">Sources: {s.sources.join(' · ')}</p>
      ) : null}
    </div>
  );
}
