alter table public.member_signups
add column if not exists phone_number text;

alter table public.member_signups
alter column interest drop not null;
