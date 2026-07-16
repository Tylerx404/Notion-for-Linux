import { app, BrowserWindow, Menu } from 'electron';
import { setupContextMenu } from './context-menu.js';
import { resolveUrlFromArgs } from './deep-links.js';
import { createMainWindow, focusMainWindow, getMainWindow } from './window.js';

setupContextMenu();

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv) => {
    const url = resolveUrlFromArgs(argv);
    if (getMainWindow()) {
      focusMainWindow(url);
    } else {
      createMainWindow(url);
    }
  });

  void app.whenReady().then(() => {
    // Remove Electron's default File/Edit/View/Window menu (avoids native
    // menubar + focus caret glitch on Linux). Notion has its own UI.
    Menu.setApplicationMenu(null);

    const startupUrl = resolveUrlFromArgs(process.argv);
    createMainWindow(startupUrl);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else {
      focusMainWindow();
    }
  });
}
