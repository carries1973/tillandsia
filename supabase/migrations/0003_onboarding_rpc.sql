-- ===========================================================================
-- Tillandsia — onboarding RPCs
-- Creating a household and joining via invite both need to write membership
-- rows before the user is a member, which RLS can't express cleanly. These
-- SECURITY DEFINER functions do it atomically and safely (auth.uid() gated).
-- ===========================================================================

create or replace function public.create_household(p_name text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare h_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into public.households (name)
    values (coalesce(nullif(trim(p_name), ''), 'Our Garden'))
    returning id into h_id;
  insert into public.household_members (household_id, user_id, role)
    values (h_id, auth.uid(), 'owner');
  return h_id;
end; $$;

create or replace function public.accept_invite(p_code text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare inv public.household_invites;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into inv from public.household_invites
    where code = lower(trim(p_code)) limit 1;
  if inv.id is null then raise exception 'invalid_code'; end if;
  if inv.expires_at < now() then raise exception 'expired_code'; end if;
  insert into public.household_members (household_id, user_id, role)
    values (inv.household_id, auth.uid(), 'member')
    on conflict (household_id, user_id) do nothing;
  update public.household_invites set accepted_by = auth.uid() where id = inv.id;
  return inv.household_id;
end; $$;

grant execute on function public.create_household(text) to authenticated;
grant execute on function public.accept_invite(text) to authenticated;
