# Appwrite Console Setup

Project: **Tinnitus-Website** (`6a46d8f8003e5c2aaee3`)  
Endpoint: `https://fra.cloud.appwrite.io/v1`

## 1. Create API key

1. Open [Appwrite Console](https://cloud.appwrite.io) → **Settings → API Keys → Create API Key**
2. Name: `Tinnitus-Website-Server`
3. Scopes: `sessions.write`, `users.read`, `databases.read`, `databases.write`, `collections.read`, `collections.write`, `documents.read`, `documents.write`, `files.read`, `files.write`, `buckets.read`, `buckets.write`
4. Copy the key into `.env.local` as `APPWRITE_API_KEY`

## 2. Provision database, collections, buckets (automated)

With `APPWRITE_API_KEY` set in `.env.local`:

```bash
node scripts/setup-appwrite.mjs
```

This creates:

- Database `tinnitus`
- Collections `gigs`, `setlists`, `site_settings`
- Storage bucket `logos` (logos, hero images, and band photos — free tier allows one bucket)
- Seed documents for homepage SEO, hero, and band photos settings

Copy the printed env vars into `.env.local`.

## 3. Create admin user (manual)

1. **Auth → Users → Create User** (email + password)
2. Edit the user → add label **`admin`**

Only users with the `admin` label can access `/admin` and write data.

## 4. Verify

```bash
npm run dev
```

- Public site loads at `http://localhost:3000`
- Admin login at `http://localhost:3000/login`

## 5. Cloudflare deployment

### Build variables (Workers Builds → Build variables and secrets)

Set these for every deploy build:

| Name | Type |
|------|------|
| `APPWRITE_API_KEY` | **Encrypted secret** |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Text |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Text |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | Text |
| `NEXT_PUBLIC_APPWRITE_COLLECTION_GIGS` | Text |
| `NEXT_PUBLIC_APPWRITE_COLLECTION_SETLISTS` | Text |
| `NEXT_PUBLIC_APPWRITE_COLLECTION_SITE_SETTINGS` | Text |

Deploy command: `npm run deploy`

The deploy script uploads `APPWRITE_API_KEY` from the build environment to the Worker runtime via `wrangler --secrets-file`. Public Appwrite config is also defined in `wrangler.jsonc` so it is always available at runtime.

If gigs or login still fail after deploy, open **Workers & Pages → tinnitus-website → Observability → Logs** while loading the site.
