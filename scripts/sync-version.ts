/**
 * Sync package.json version from the root VERSION file.
 * Usage: bun run version:sync
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const versionPath = path.join(root, "VERSION");
const packagePath = path.join(root, "package.json");

const version = readFileSync(versionPath, "utf8").trim();
if (!/^\d+\.\d+\.\d+([.-].*)?$/.test(version)) {
  console.error(`Invalid VERSION: ${version}`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(packagePath, "utf8")) as { version: string };
pkg.version = version;
writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`package.json version -> ${version}`);
