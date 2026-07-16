/**
 * Preload script runs in an isolated context before page scripts.
 * Intentionally minimal: no Node APIs are exposed to the renderer.
 * Extend via contextBridge if the app needs a safe IPC surface later.
 */
export {};
