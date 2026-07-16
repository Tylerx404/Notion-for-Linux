import { BrowserWindow, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../shared/config.js';
import { APP_URL } from '../shared/constants.js';
import { loadWindowState, saveWindowState } from './window-state.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Project root (dist/main → ../../). */
const projectRoot = path.join(__dirname, '..', '..');

const appIconPath = path.join(projectRoot, 'assets', 'icon.png');

let mainWindow: BrowserWindow | null = null;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function createMainWindow(initialUrl?: string | null): BrowserWindow {
  const state = loadWindowState();

  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    icon: appIconPath,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(projectRoot, 'dist', 'preload', 'index.js'),
      webSecurity: true,
    },
  });

  // Fully hide the native menu bar (Linux still draws it if only autoHide is set).
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  const url = initialUrl ?? APP_URL;
  void mainWindow.loadURL(url, { userAgent: config.userAgent });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    if (details.url.includes('accounts.google.com')) {
      void shell.openExternal(details.url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.setMenuBarVisibility(false);
    mainWindow?.show();
  });

  mainWindow.on('close', () => {
    if (!mainWindow) return;
    const bounds = mainWindow.getBounds();
    saveWindowState(bounds);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

export function focusMainWindow(url?: string | null): void {
  if (!mainWindow) return;

  if (url) {
    void mainWindow.loadURL(url, { userAgent: config.userAgent });
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  mainWindow.focus();
}
