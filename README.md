<p align="center">
  <img src="assets/icon.png" alt="Notion for Linux" width="96" height="96" />
</p>

<h1 align="center">Notion for Linux</h1>

<p align="center">
  <strong>Unofficial desktop client for <a href="https://www.notion.so">Notion</a> on Linux</strong><br />
  Lightweight Electron shell · TypeScript · Bun · AppImage / deb / rpm
</p>

<p align="center">
  <a href="https://github.com/Tylerx404/Notion-for-Linux/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Tylerx404/notion-for-linux/ci.yml?branch=main&style=flat-square&label=CI" alt="CI" /></a>
  <a href="https://github.com/Tylerx404/Notion-for-Linux/releases/latest"><img src="https://img.shields.io/github/v/release/Tylerx404/notion-for-linux?style=flat-square&label=release" alt="Release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" /></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/runtime-Bun-f9f1e1?style=flat-square&logo=bun&logoColor=black" alt="Bun" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-7-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
</p>

> [!IMPORTANT]
> This project is **not affiliated with, endorsed by, or associated with Notion Labs, Inc.**  
> It wraps the official Notion web app in a native Linux window.

---

## Why this exists

Notion does not ship an official desktop client for Linux. **Notion for Linux** gives you a focused, single-window experience with sensible desktop defaults—without Snap, and with packages that fit common distros.

| Package | Best for |
|---------|----------|
| **AppImage** | Portable, no install |
| **`.deb`** | Debian, Ubuntu, and derivatives |
| **`.rpm`** | Fedora, RHEL, and derivatives |

---

## Features

- Full Notion web app in a dedicated desktop window  
- Single-instance lock (second launch focuses the existing window)  
- Desktop-style user-agent for better web compatibility  
- Window size and position restored between sessions  
- Google Sign-In via the system browser (safer OAuth popups)  
- Native Linux packaging: AppImage, Debian, RPM  
- Versioned GitHub Releases driven by a simple `VERSION` file  

---

## Install

### From GitHub Releases (recommended)

Download the latest build from the [Releases](https://github.com/Tylerx404/Notion-for-Linux/releases/latest) page.

**AppImage**

```bash
chmod +x notion-for-linux-*-x86_64.AppImage
./notion-for-linux-*-x86_64.AppImage
```

**Debian / Ubuntu**

```bash
sudo apt install ./notion-for-linux-*-amd64.deb
```

**Fedora / RHEL**

```bash
sudo dnf install ./notion-for-linux-*-x86_64.rpm
```

After installation, launch **Notion** from your app menu, or run:

```bash
notion-for-linux
```

---

## Development

### Requirements

- Linux (x64; arm64 depending on Electron support)  
- [Bun](https://bun.sh) **1.3+**  
- For RPM builds only: `rpmbuild` (`sudo apt install rpm` on Debian/Ubuntu)

### Setup

```bash
bun install
bun start          # compile TypeScript and launch Electron
```

### Scripts

| Command | Description |
|---------|-------------|
| `bun start` | Build and run the app |
| `bun run typecheck` | TypeScript check only |
| `bun run build` | Compile `src/` → `dist/` |
| `bun run dist:all` | Build AppImage + deb + rpm → `release/` |
| `bun run dist:appimage` | AppImage only |
| `bun run dist:deb` | Debian package only |
| `bun run dist:rpm` | RPM package only |
| `bun run clean` | Remove `dist/` and `release/` |
| `bun run version:sync` | Set `package.json` version from `VERSION` |
| `bun run version:tag` | Create annotated tag `v$(cat VERSION)` |

### Project layout

```text
src/
  main/       Electron main process (window, state, deep links)
  preload/    Isolated preload (no Node APIs exposed)
  shared/     Shared config and constants
assets/
  icon.png    Window icon (512×512)
  icons/      Linux hicolor set (16…1024) for deb/rpm/AppImage
scripts/      Version sync / tag helpers
VERSION       Release version source of truth
```

---

## Packaging

```bash
bun run dist:all
```

Artifacts are written to `release/`:

```text
notion-for-linux-<version>-x86_64.AppImage
notion-for-linux-<version>-amd64.deb
notion-for-linux-<version>-x86_64.rpm
```

Icons are committed under [`assets/`](assets/):

| Path | Used for |
|------|----------|
| [`assets/icon.png`](assets/icon.png) | BrowserWindow / runtime (packaged into the app) |
| [`assets/icons/*.png`](assets/icons/) | Linux package install (`/usr/share/icons/hicolor/<size>/apps/`) |

Files in `assets/icons/` must be named `NxN.png` at standard sizes (`16x16` … `1024x1024`) so desktop environments can resolve the launcher icon. No generate step is required in CI.

---

## Continuous integration & releases

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **CI** | Push / PR to `main` | Install, typecheck, compile |
| **Release** | Tag `v*` matching `VERSION`, or manual *Run workflow* | Build packages and publish a GitHub Release |

### Versioning

The single source of truth is the root [`VERSION`](VERSION) file (e.g. `1.0.0`).

```bash
# 1. Bump VERSION (one line)
echo 1.1.0 > VERSION

# 2. Sync package.json and create tag
bun run version:sync
bun run version:tag

# 3. Push branch + tag
git push origin main
git push origin "v$(tr -d '[:space:]' < VERSION)"
```

- Tag form: `v` + contents of `VERSION` (e.g. `1.2.0` → `v1.2.0`).  
- Mismatch between tag and `VERSION` fails the release job.  
- Hyphenated versions (e.g. `1.2.0-beta.1`) are published as **prereleases**.  
- Manual path: **Actions → Release → Run workflow** (reads `VERSION` only).

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, style, and packaging notes.

---

## License

Released under the [MIT License](LICENSE).

---

## Acknowledgments

- [Electron](https://www.electronjs.org/) — desktop application framework  
- [Bun](https://bun.sh) — JavaScript runtime and package manager  
- [Notion](https://www.notion.so) — the product this client wraps (**unofficial**; not affiliated)
