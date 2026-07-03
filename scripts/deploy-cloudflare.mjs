import { execSync } from "node:child_process";
import { unlinkSync, writeFileSync } from "node:fs";
import { platform } from "node:os";

if (platform() === "win32") {
  console.warn(
    "WARNING: Deploying OpenNext from Windows can produce broken Workers bundles. " +
      "Prefer Cloudflare Workers Builds (Linux) or WSL for production deploys.",
  );
}

const SECRETS_FILE = ".cf-deploy-secrets";

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env });
}

run("npx opennextjs-cloudflare build");

const secretLines = [];
if (process.env.APPWRITE_API_KEY) {
  secretLines.push(`APPWRITE_API_KEY=${process.env.APPWRITE_API_KEY}`);
}

let secretsArg = "";
if (secretLines.length > 0) {
  writeFileSync(SECRETS_FILE, `${secretLines.join("\n")}\n`);
  secretsArg = ` --secrets-file ${SECRETS_FILE}`;
} else {
  console.warn(
    "WARNING: APPWRITE_API_KEY is not set in the build environment. " +
      "Add it as an encrypted secret under Workers Builds → Build variables and secrets.",
  );
}

try {
  run(`npx opennextjs-cloudflare deploy -- --keep-vars${secretsArg}`);
} finally {
  if (secretLines.length > 0) {
    unlinkSync(SECRETS_FILE);
  }
}
