/**
 * Runtime configuration shared across the main process.
 * Builds a desktop-like Chrome user-agent for better Notion web compatibility.
 */
function buildOsInfo(): string {
  switch (process.platform) {
    case 'darwin':
      return '(Macintosh; Intel Mac OS X 10_15_7)';
    case 'win32':
      return '(Windows NT 10.0; Win64; x64)';
    default:
      return '(X11; Linux x86_64)';
  }
}

export const config = {
  userAgent: `Mozilla/5.0 ${buildOsInfo()} AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`,
} as const;
