create extension if not exists pgcrypto;

create table if not exists public.member_signups (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  interest text not null,
  source text default 'landing_page',
  created_at timestamptz default now()
);

alter table public.member_signups enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.member_signups to anon, authenticated;
revoke select, update, delete on table public.member_signups from anon, authenticated;

drop policy if exists "Public can insert member signups" on public.member_signups;

create policy "Public can insert member signups"
on public.member_signups
for insert
to anon, authenticated
with check (true);
