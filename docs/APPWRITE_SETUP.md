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
- Browser network tab shows a successful Appwrite ping on page load

## 5. Cloudflare deployment

Appwrite needs `APPWRITE_API_KEY` in **two** places in the Cloudflare dashboard:

1. **Workers Builds → Build variables and secrets** — so `next build` can inline `NEXT_PUBLIC_*` vars and pre-render metadata.
2. **Worker → Settings → Variables and Secrets** — so the live site can read gigs, settings, and media at request time.

Add `APPWRITE_API_KEY` as an **encrypted secret** in both locations. The `NEXT_PUBLIC_APPWRITE_*` variables must also be set in both places (or at least in build variables and as plain Worker variables).

After adding runtime secrets, redeploy with `npm run deploy` (the script uses `--keep-vars` so dashboard secrets are not wiped).
