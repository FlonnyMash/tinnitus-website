-- Tinnitus Band Website - Supabase Schema
-- Run this in the Supabase SQL Editor for a fresh project.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.app_role as enum ('admin');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role public.app_role,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gigs (
  id uuid primary key default gen_random_uuid(),
  gig_date date not null,
  venue text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.setlists (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null unique references public.gigs (id) on delete cascade,
  title text,
  songs text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index gigs_gig_date_idx on public.gigs (gig_date desc);
create index setlists_gig_id_idx on public.setlists (gig_id);

-- ---------------------------------------------------------------------------
-- Updated-at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger gigs_set_updated_at
before update on public.gigs
for each row execute function public.set_updated_at();

create trigger setlists_set_updated_at
before update on public.setlists
for each row execute function public.set_updated_at();

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.gigs enable row level security;
alter table public.setlists enable row level security;
alter table public.site_settings enable row level security;

-- Profiles: users can read their own profile; admins can read all profiles.
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Gigs: public read, admin write.
create policy "Public can read gigs"
on public.gigs
for select
to anon, authenticated
using (true);

create policy "Admins can insert gigs"
on public.gigs
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update gigs"
on public.gigs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete gigs"
on public.gigs
for delete
to authenticated
using (public.is_admin());

-- Setlists: public read, admin write.
create policy "Public can read setlists"
on public.setlists
for select
to anon, authenticated
using (true);

create policy "Admins can insert setlists"
on public.setlists
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update setlists"
on public.setlists
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete setlists"
on public.setlists
for delete
to authenticated
using (public.is_admin());

-- Site settings: public read for homepage keys, admin write.
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

create policy "Admins can insert site settings"
on public.site_settings
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update site settings"
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete site settings"
on public.site_settings
for delete
to authenticated
using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('band-photos', 'band-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('logos', 'logos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "Public can read band photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'band-photos');

create policy "Admins can upload band photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'band-photos' and public.is_admin());

create policy "Admins can update band photos"
on storage.objects
for update
to authenticated
using (bucket_id = 'band-photos' and public.is_admin())
with check (bucket_id = 'band-photos' and public.is_admin());

create policy "Admins can delete band photos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'band-photos' and public.is_admin());

create policy "Public can read logos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'logos');

create policy "Admins can upload logos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'logos' and public.is_admin());

create policy "Admins can update logos"
on storage.objects
for update
to authenticated
using (bucket_id = 'logos' and public.is_admin())
with check (bucket_id = 'logos' and public.is_admin());

create policy "Admins can delete logos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'logos' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed defaults
-- ---------------------------------------------------------------------------

insert into public.site_settings (key, value)
values
  (
    'homepage_seo',
    jsonb_build_object(
      'title', 'Tinnitus – Rock Band',
      'description', 'Offizielle Website der Rockband Tinnitus. Termine, Setlists und News.'
    )
  ),
  (
    'hero',
    jsonb_build_object(
      'logo_url', '',
      'hero_image_url', ''
    )
  ),
  (
    'band_photos',
    jsonb_build_object(
      'urls', '[]'::jsonb
    )
  )
on conflict (key) do nothing;

-- Promote the first admin after signup:
-- update public.profiles set role = 'admin' where email = 'admin@example.com';
