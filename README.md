# Tinnitus Band Website

Full-stack website and admin panel for the rock band **Tinnitus**, built with:

- Next.js App Router
- Tailwind CSS
- shadcn/ui
- Supabase Auth, Database, and Storage

## Features

### Public site
- Hero section with band logo and hero image
- Upcoming gigs
- Past gigs with setlist modal or `Setlist noch nicht verfügbar`
- Dynamic homepage SEO metadata

### Admin panel (`/admin`)
- Supabase Auth login
- Role-based access via `profiles.role = 'admin'`
- CRUD for gigs
- Setlist management linked to gigs
- Media uploads for logo and band photos
- Homepage SEO editor

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor
3. Create an admin user in Supabase Auth
4. Promote that user to admin:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin@example.com';
```

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the development server

```bash
npm run dev
```

Open:
- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/login](http://localhost:3000/login)

## Project Structure

```text
app/
  page.tsx                 # Public landing page
  login/page.tsx           # Admin login
  admin/                   # Protected admin routes
  actions/                 # Server actions
components/
  public/                  # Public UI sections
  admin/                   # Admin UI
lib/
  supabase/                # Supabase clients + middleware helpers
  queries/                 # Data fetching helpers
  auth.ts                  # Admin auth helpers
supabase/
  schema.sql               # Database schema, RLS, storage policies
```

## Database Tables

- `profiles` – user profile and admin role
- `gigs` – gig date, venue, description
- `setlists` – one setlist per gig
- `site_settings` – homepage SEO, hero assets, band photos

## Storage Buckets

- `logos`
- `band-photos`

Both buckets are public-read and admin-write via RLS policies defined in `supabase/schema.sql`.
