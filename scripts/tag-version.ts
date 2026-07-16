/**
 * Create an annotated git tag from the VERSION file (vX.Y.Z).
 * Does not push — run `git push origin <tag>` yourself.
 *
 * Usage: bun run version:tag
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { $ } from "bun";

const root = path.resolve(import.meta.dir, "..");
const version = readFileSync(path.join(root, "VERSION"), "utf8").trim();

if (!/^\d+\.\d+\.\d+([.-].*)?$/.test(version)) {
  console.error(`Invalid VERSION: ${version}`);
  process.exit(1);
}

const tag = `v${version}`;

// Keep package.json aligned before tagging
await $`bun run version:sync`;

const existing = await $`git rev-parse -q --verify "refs/tags/${tag}"`.nothrow().quiet();
if (existing.exitCode === 0) {
  console.error(`Tag already exists: ${tag}`);
  process.exit(1);
}

await $`git tag -a ${tag} -m ${`Release ${tag}`}`;
console.log(`Created tag ${tag}`);
console.log(`Push with: git push origin ${tag}`);
