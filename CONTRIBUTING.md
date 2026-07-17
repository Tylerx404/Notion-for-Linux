# Contributing

Thanks for helping improve **Notion for Linux**.

## How to contribute

1. **Report issues** — bugs, packaging problems, or feature ideas.
2. **Fork & branch** — work on a focused branch from the latest `main`.
3. **Develop with Bun**
   ```bash
   bun install
   bun start
   ```
4. **Type-check and package**
   ```bash
   bun run typecheck
   bun run dist:appimage   # or dist:deb / dist:rpm
   ```
5. **Open a pull request** — describe what changed and how you verified it.

## Guidelines

- Prefer TypeScript in `src/`; keep modules small and single-purpose.
- Do not reintroduce Snap packaging unless discussed first.
- Match existing style: ESM, strict typing, clear module boundaries.
- Test on at least one Linux distro when changing packaging.
- CI runs typecheck + compile on every PR; packaging is verified on version tags (`v*`).

## Releases

The release workflow checks out the **tag** and requires `VERSION` in that commit to match the tag (e.g. tag `v1.0.1` ⇒ committed `VERSION` is `1.0.1`). Tag only **after** the bump is committed.

```bash
# 1. Bump VERSION
echo X.Y.Z > VERSION

# 2. Sync package.json and commit
bun run version:sync
git add VERSION package.json
git commit -m "chore: bump version to X.Y.Z"

# 3. Create annotated tag (fails if tree is dirty / VERSION not committed)
bun run version:tag

# 4. Push branch + tag (tag push triggers Release workflow)
git push origin main
git push origin "v$(tr -d '[:space:]' < VERSION)"
```

If you tagged the wrong commit, delete the local tag, fix, and retag:

```bash
git tag -d vX.Y.Z
# commit VERSION if needed, then:
bun run version:tag
git push origin vX.Y.Z
# if the bad tag was already on remote:
# git push origin :refs/tags/vX.Y.Z && git push origin vX.Y.Z
```

## Ways to help

- Test `.deb`, `.rpm`, and AppImage builds on different distributions
- Improve accessibility or keyboard shortcuts
- Document install steps for specific distros
