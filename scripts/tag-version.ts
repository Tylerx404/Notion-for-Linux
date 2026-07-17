/**
 * Create an annotated git tag from the VERSION file (vX.Y.Z).
 * Requires VERSION + package.json to already be committed (clean tree).
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

// Refuse to tag if version bump is not committed yet (common footgun).
const status = (await $`git status --porcelain`.text()).trim();
if (status.length > 0) {
  console.error(
    "Working tree is not clean. Commit VERSION / package.json first, then retag.\n" +
      "Suggested flow:\n" +
      "  echo X.Y.Z > VERSION\n" +
      "  bun run version:sync\n" +
      '  git add VERSION package.json && git commit -m "chore: bump version to X.Y.Z"\n' +
      "  bun run version:tag\n" +
      "  git push origin main && git push origin vX.Y.Z",
  );
  process.exit(1);
}

const committedVersion = (
  await $`git show HEAD:VERSION`.text()
).trim();
if (committedVersion !== version) {
  console.error(
    `VERSION file (${version}) does not match committed HEAD:VERSION (${committedVersion}).\n` +
      "Commit the VERSION bump before tagging.",
  );
  process.exit(1);
}

const committedPkg = JSON.parse(await $`git show HEAD:package.json`.text()) as {
  version: string;
};
if (committedPkg.version !== version) {
  console.error(
    `package.json version (${committedPkg.version}) does not match VERSION (${version}).\n` +
      "Run `bun run version:sync`, commit, then retag.",
  );
  process.exit(1);
}

const existing = await $`git rev-parse -q --verify "refs/tags/${tag}"`.nothrow().quiet();
if (existing.exitCode === 0) {
  console.error(`Tag already exists: ${tag}`);
  process.exit(1);
}

const head = (await $`git rev-parse --short HEAD`.text()).trim();
await $`git tag -a ${tag} -m ${`Release ${tag}`}`;
console.log(`Created tag ${tag} on ${head}`);
console.log(`Push with: git push origin ${tag}`);
