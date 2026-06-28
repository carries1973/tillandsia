import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getSession } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { PHOTO_BUCKET } from '@/lib/types';

// Phase 2A — identify the air-plant species in a specimen's photo with Claude
// Sonnet vision. Conservative: returns "unknown" rather than guessing wildly.
export async function POST(req: Request) {
  const { user, household } = await getSession();
  if (!user || !household) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'AI identify isn’t set up yet — add an ANTHROPIC_API_KEY.', needsKey: true },
      { status: 503 }
    );
  }

  let specimenId = '';
  try {
    ({ specimenId } = await req.json());
  } catch {
    /* ignore */
  }
  if (!specimenId) return NextResponse.json({ error: 'Missing specimenId.' }, { status: 400 });

  const supabase = await createClient();

  const { data: specimen } = await supabase
    .from('specimens')
    .select('id, cover_photo_id')
    .eq('id', specimenId)
    .eq('household_id', household.id)
    .maybeSingle();
  if (!specimen) return NextResponse.json({ error: 'Plant not found.' }, { status: 404 });

  // Pick the cover photo, else the most recent photo for this plant.
  let path: string | null = null;
  if (specimen.cover_photo_id) {
    const { data: cp } = await supabase
      .from('photos')
      .select('storage_path')
      .eq('id', specimen.cover_photo_id)
      .maybeSingle();
    path = (cp?.storage_path as string | undefined) ?? null;
  }
  if (!path) {
    const { data: recent } = await supabase
      .from('photos')
      .select('storage_path')
      .eq('specimen_id', specimenId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    path = (recent?.storage_path as string | undefined) ?? null;
  }
  if (!path) {
    return NextResponse.json({ error: 'Add a photo of this plant first.' }, { status: 400 });
  }

  const { data: blob, error: dlErr } = await supabase.storage.from(PHOTO_BUCKET).download(path);
  if (dlErr || !blob) {
    return NextResponse.json({ error: 'Could not load the photo.' }, { status: 500 });
  }
  const base64 = Buffer.from(await blob.arrayBuffer()).toString('base64');

  const { data: species } = await supabase
    .from('species')
    .select('slug, binomial, common_names, care_group, mesic_xeric, trichome_notes');
  const speciesList = (species ?? [])
    .map((s) => {
      const common = ((s.common_names as string[] | null) ?? [])[0] ?? '';
      return `- ${s.slug}: ${s.binomial}${common ? ` ("${common}")` : ''} — group ${s.care_group}; ${s.mesic_xeric ?? ''}; ${s.trichome_notes ?? ''}`;
    })
    .join('\n');

  const prompt = `You are an expert Tillandsia (air plant) botanist. Identify the air plant in the photo.

These are the species tracked in this app:
${speciesList}

Distinguishing cues: bulbosa = smooth green leaves from a hollow pseudobulb; caput-medusae = silvery-grey snake-like leaves from a fat bulb; pruinosa = densely frosted/fuzzy small bulbous plant; ionantha group = small soft silvery-green rosette (often blushing red); fuzzy-fine-rosette = round pompom of very fine, needle-like fuzzy leaves.

Return ONLY a JSON object — no prose, no markdown — with exactly this shape:
{"slug": "<one of the slugs above, or 'unknown' if none clearly match>", "confidence": <number 0..1>, "reasoning": "<one short sentence>"}

Be conservative: if you are not reasonably confident it matches one of the listed species, return "unknown".`;

  let text = '';
  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
            { type: 'text', text: prompt },
          ],
        },
      ],
    });
    const block = msg.content.find((b) => b.type === 'text');
    text = block && block.type === 'text' ? block.text : '';
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Vision request failed.' },
      { status: 502 }
    );
  }

  let parsed: { slug?: string; confidence?: number; reasoning?: string } = {};
  try {
    const a = text.indexOf('{');
    const b = text.lastIndexOf('}');
    if (a >= 0 && b > a) parsed = JSON.parse(text.slice(a, b + 1));
  } catch {
    /* fall through */
  }
  if (!parsed.slug) {
    return NextResponse.json({ error: 'Could not read the result.' }, { status: 502 });
  }

  const match = (species ?? []).find((s) => s.slug === parsed.slug);
  return NextResponse.json({
    slug: match ? (parsed.slug as string) : null,
    binomial: (match?.binomial as string | undefined) ?? null,
    common: ((match?.common_names as string[] | null) ?? [])[0] ?? null,
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : null,
    reasoning: String(parsed.reasoning ?? ''),
  });
}
