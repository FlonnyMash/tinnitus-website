/**
 * Provisions Appwrite resources for the Tinnitus website.
 * Run after creating an API key in the Appwrite Console:
 *
 *   APPWRITE_API_KEY=your-key node scripts/setup-appwrite.mjs
 *
 * Requires NEXT_PUBLIC_APPWRITE_* vars in .env.local (or environment).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  Client,
  Databases,
  Storage,
  ID,
  Permission,
  Role,
} from "node-appwrite";

function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local is optional when vars are exported in the shell
  }
}

loadEnvLocal();

const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "6a46d8f8003e5c2aaee3";
const API_KEY = process.env.APPWRITE_API_KEY;

if (!API_KEY) {
  console.error(
    "Missing APPWRITE_API_KEY. Create one in Appwrite Console (Settings → API Keys) with sessions, users, databases, documents, files, and buckets scopes.",
  );
  process.exit(1);
}

const DATABASE_ID = "tinnitus";
const COLLECTION_GIGS = "gigs";
const COLLECTION_SETLISTS = "setlists";
const COLLECTION_SITE_SETTINGS = "site_settings";
const BUCKET_LOGOS = "logos";
const BUCKET_BAND_PHOTOS = "band-photos";

const adminWritePermissions = [
  Permission.read(Role.any()),
  Permission.create(Role.label("admin")),
  Permission.update(Role.label("admin")),
  Permission.delete(Role.label("admin")),
];

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function ensureDatabase() {
  try {
    await databases.get({ databaseId: DATABASE_ID });
    console.log(`Database "${DATABASE_ID}" already exists.`);
  } catch {
    await databases.create({ databaseId: DATABASE_ID, name: "Tinnitus" });
    console.log(`Created database "${DATABASE_ID}".`);
  }
}

async function ensureCollection(collectionId, name, attributes, indexes) {
  try {
    await databases.getCollection({ databaseId: DATABASE_ID, collectionId });
    console.log(`Collection "${collectionId}" already exists.`);
    return;
  } catch {
    // create below
  }

  await databases.createCollection({
    databaseId: DATABASE_ID,
    collectionId,
    name,
    permissions: adminWritePermissions,
    attributes,
    indexes,
  });
  console.log(`Created collection "${collectionId}".`);
}

async function ensureBucket(bucketId, name, maximumFileSize, allowedFileExtensions) {
  try {
    await storage.getBucket({ bucketId });
    console.log(`Bucket "${bucketId}" already exists.`);
    return;
  } catch {
    // create below
  }

  await storage.createBucket({
    bucketId,
    name,
    permissions: adminWritePermissions,
    maximumFileSize,
    allowedFileExtensions,
  });
  console.log(`Created bucket "${bucketId}".`);
}

async function seedSiteSettings() {
  const seeds = [
    {
      key: "homepage_seo",
      value: JSON.stringify({
        title: "Tinnitus – Rock Band",
        description:
          "Offizielle Website der Rockband Tinnitus. Termine, Setlists und News.",
      }),
    },
    {
      key: "hero",
      value: JSON.stringify({ logo_url: "", hero_image_url: "" }),
    },
    {
      key: "band_photos",
      value: JSON.stringify({ urls: [] }),
    },
  ];

  for (const seed of seeds) {
    const existing = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: COLLECTION_SITE_SETTINGS,
      queries: [`equal("key", ["${seed.key}"])`, 'limit(1)'],
    });

    if (existing.documents.length > 0) {
      console.log(`Site setting "${seed.key}" already seeded.`);
      continue;
    }

    await databases.createDocument({
      databaseId: DATABASE_ID,
      collectionId: COLLECTION_SITE_SETTINGS,
      documentId: ID.unique(),
      data: seed,
    });
    console.log(`Seeded site setting "${seed.key}".`);
  }
}

async function main() {
  console.log("Setting up Appwrite resources for Tinnitus website...\n");

  await ensureDatabase();

  await ensureCollection(
    COLLECTION_GIGS,
    "Gigs",
    [
      { key: "gig_date", type: "string", size: 32, required: true },
      { key: "venue", type: "string", size: 255, required: true },
      { key: "description", type: "string", size: 4096, required: false },
    ],
    [{ key: "gig_date_desc", type: "key", attributes: ["gig_date"], orders: ["DESC"] }],
  );

  await ensureCollection(
    COLLECTION_SETLISTS,
    "Setlists",
    [
      { key: "gig_id", type: "string", size: 36, required: true },
      { key: "title", type: "string", size: 255, required: false },
      { key: "songs", type: "string", size: 512, required: false, array: true },
      { key: "notes", type: "string", size: 4096, required: false },
    ],
    [{ key: "gig_id_unique", type: "unique", attributes: ["gig_id"] }],
  );

  await ensureCollection(
    COLLECTION_SITE_SETTINGS,
    "Site Settings",
    [
      { key: "key", type: "string", size: 64, required: true },
      { key: "value", type: "string", size: 16384, required: true },
    ],
    [{ key: "key_unique", type: "unique", attributes: ["key"] }],
  );

  await ensureBucket(BUCKET_LOGOS, "Logos", 5 * 1024 * 1024, [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "svg",
  ]);

  await ensureBucket(BUCKET_BAND_PHOTOS, "Band Photos", 10 * 1024 * 1024, [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
  ]);

  // Attributes may still be building; wait briefly before seeding.
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await seedSiteSettings();

  console.log("\nSetup complete. Add these to .env.local:\n");
  console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${DATABASE_ID}`);
  console.log(`NEXT_PUBLIC_APPWRITE_COLLECTION_GIGS=${COLLECTION_GIGS}`);
  console.log(`NEXT_PUBLIC_APPWRITE_COLLECTION_SETLISTS=${COLLECTION_SETLISTS}`);
  console.log(`NEXT_PUBLIC_APPWRITE_COLLECTION_SITE_SETTINGS=${COLLECTION_SITE_SETTINGS}`);
  console.log("\nManual steps remaining:");
  console.log("1. Auth → Users → Create admin user");
  console.log('2. Edit user → add label "admin"');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
