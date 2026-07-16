import { APP_URL } from '../shared/constants.js';

const HTTPS_NOTION = /^https:\/\/www\.notion\.so\//i;
const NOTION_PROTOCOL = /^notion:\/\//i;

/**
 * Resolve a Notion URL from CLI / second-instance arguments.
 * Supports https://www.notion.so/... and notion:// deep links.
 */
export function resolveUrlFromArgs(args: readonly string[]): string | null {
  for (const arg of args) {
    if (HTTPS_NOTION.test(arg)) {
      return arg;
    }
    if (NOTION_PROTOCOL.test(arg)) {
      return APP_URL + arg.slice('notion://'.length);
    }
  }
  return null;
}
