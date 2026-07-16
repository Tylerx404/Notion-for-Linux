import { app, screen } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_WINDOW_SIZE, WINDOW_STATE_FILENAME } from '../shared/constants.js';

export interface WindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

function stateFilePath(): string {
  return path.join(app.getPath('userData'), WINDOW_STATE_FILENAME);
}

function isOnValidScreen(state: WindowState): boolean {
  if (state.x === undefined || state.y === undefined) {
    return false;
  }

  return screen.getAllDisplays().some((display) => {
    const { x, y, width, height } = display.bounds;
    return (
      state.x! >= x &&
      state.y! >= y &&
      state.x! + state.width <= x + width &&
      state.y! + state.height <= y + height
    );
  });
}

/** Load previously saved window bounds, or return defaults. */
export function loadWindowState(): WindowState {
  try {
    const raw = fs.readFileSync(stateFilePath(), 'utf8');
    const state = JSON.parse(raw) as WindowState;

    if (
      typeof state.width !== 'number' ||
      typeof state.height !== 'number' ||
      state.width <= 0 ||
      state.height <= 0
    ) {
      return { ...DEFAULT_WINDOW_SIZE };
    }

    return isOnValidScreen(state) ? state : { ...DEFAULT_WINDOW_SIZE };
  } catch {
    return { ...DEFAULT_WINDOW_SIZE };
  }
}

/** Persist window bounds for the next launch. */
export function saveWindowState(state: WindowState): void {
  fs.writeFileSync(stateFilePath(), JSON.stringify(state, null, 2), 'utf8');
}
