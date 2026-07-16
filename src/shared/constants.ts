/** Default application URL (Notion login). */
export const APP_URL = 'https://www.notion.so/login';

/** Fallback window size when no saved state is available. */
export const DEFAULT_WINDOW_SIZE = {
  width: 1280,
  height: 800,
} as const;

/** Filename used to persist BrowserWindow bounds. */
export const WINDOW_STATE_FILENAME = 'window-state.json';
