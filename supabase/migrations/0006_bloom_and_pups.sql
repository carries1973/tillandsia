-- ===========================================================================
-- Tillandsia — bloom & pup lifecycle on the progress log
-- A Tillandsia blooms once in its life, then throws offsets ("pups") from the
-- base. That arc is the heart of air-plant progress, so capture it on the
-- dated observation log (same pattern as the measurements): a bloom is a
-- point-in-time event, and pup_count is a point-in-time count you watch climb
-- 0 → 1 → 2. "Currently blooming?" / "how many pups?" = the latest entry that
-- recorded each. Safe to re-run.
-- ===========================================================================

alter table public.observations
  add column if not exists bloomed   boolean not null default false,
  add column if not exists pup_count int;

comment on column public.observations.bloomed   is 'This entry recorded a bloom (spike/flower) on observed_on.';
comment on column public.observations.pup_count is 'Number of pups/offsets visible on observed_on (null = not counted this entry).';
