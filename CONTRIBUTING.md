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

1. Bump the root `VERSION` file.
2. `bun run version:sync && bun run version:tag`
3. Push the branch and the tag (`vX.Y.Z`). The **Release** workflow builds packages and attaches them to the GitHub Release. Tag and `VERSION` must match.

## Ways to help

- Test `.deb`, `.rpm`, and AppImage builds on different distributions
- Improve accessibility or keyboard shortcuts
- Document install steps for specific distros
