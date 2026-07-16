import electronContextMenu from 'electron-context-menu';

/** Register the application-wide context menu. */
export function setupContextMenu(): void {
  electronContextMenu({
    showSaveImageAs: true,
  });
}
