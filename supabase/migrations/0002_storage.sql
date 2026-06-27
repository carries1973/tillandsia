-- ===========================================================================
-- Tillandsia — storage bucket for photos + household-scoped RLS
-- Photos live at:  photos/{household_id}/{uuid}.jpg
-- A user can read/write objects only inside a household they belong to.
-- ===========================================================================

insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

-- Read: members of the household that owns the first path segment.
create policy "photos read for members"
  on storage.objects for select
  using (
    bucket_id = 'photos'
    and public.is_member( (storage.foldername(name))[1]::uuid )
  );

-- Insert: same household scoping.
create policy "photos insert for members"
  on storage.objects for insert
  with check (
    bucket_id = 'photos'
    and public.is_member( (storage.foldername(name))[1]::uuid )
  );

-- Update / delete: same household scoping (soft-delete + re-cover later).
create policy "photos update for members"
  on storage.objects for update
  using (
    bucket_id = 'photos'
    and public.is_member( (storage.foldername(name))[1]::uuid )
  );

create policy "photos delete for members"
  on storage.objects for delete
  using (
    bucket_id = 'photos'
    and public.is_member( (storage.foldername(name))[1]::uuid )
  );
