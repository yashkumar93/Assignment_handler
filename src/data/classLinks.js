/**
 * ==============================================================================
 * CLASSROOM LINKS & RESOURCES CONFIGURATION
 * ==============================================================================
 * 
 * 💡 TEACHER QUICK GUIDE:
 * You can add links here in code OR use the "⚡ Quick Paste" button on the webpage!
 * 
 * To add a new link here, simply add an item to the `initialClassLinks` array:
 * 
 * Example:
 * {
 *   title: "Figma Assignment Design",
 *   url: "https://www.figma.com/design/...",
 *   description: "Wireframes and design tokens for today's assignment",
 *   tag: "Design Specs", // e.g. "Starter Code", "Design Specs", "Reference", "Assets", "Live Link"
 *   pinned: true,
 * }
 * 
 * You can also just paste a plain URL string if you are in a rush:
 * "https://github.com/my-course/starter"
 * It will be automatically parsed!
 */

export const NIAT_CLASS_LINKS_STORAGE_KEY = 'niat_class_links';
export const DEFAULT_ADMIN_CODE = 'niat2026';
export const ADMIN_AUTH_KEY = 'niat_admin_unlocked';
export const ADMIN_PASSCODE_KEY = 'niat_admin_passcode';

/**
 * Default links list: Start empty so the instructor adds new links directly on the site.
 */
export const initialClassLinks = [];

/**
 * Validates the entered admin code against stored or default passcode
 */
export function verifyAdminCode(enteredCode = '') {
  if (!enteredCode) return false;
  const stored = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_PASSCODE_KEY) : null;
  const target = stored || DEFAULT_ADMIN_CODE;
  return enteredCode.trim() === target.trim();
}

/**
 * Smart detection helper to classify URLs and determine icon types
 */
export function detectLinkCategory(url = '') {
  const lower = url.toLowerCase();
  if (lower.includes('github.com') || lower.includes('gitlab.com')) return 'github';
  if (lower.includes('figma.com')) return 'figma';
  if (lower.includes('drive.google.com') || lower.includes('docs.google.com') || lower.includes('sheets.google.com') || lower.includes('forms.gle') || lower.includes('forms.google.com')) return 'google';
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com') || lower.includes('loom.com')) return 'video';
  if (lower.includes('developer.mozilla.org') || lower.includes('w3schools.com') || lower.includes('devdocs.io') || lower.includes('web.dev')) return 'docs';
  if (lower.includes('codepen.io') || lower.includes('codesandbox.io') || lower.includes('stackblitz.com') || lower.includes('replit.com')) return 'code';
  if (lower.includes('notion.so') || lower.includes('notion.site')) return 'notion';
  if (lower.includes('discord.gg') || lower.includes('discord.com') || lower.includes('slack.com')) return 'community';
  return 'web';
}

/**
 * Smart title generator from URL if no title is provided
 */
export function deriveTitleFromUrl(url = '') {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const host = parsed.hostname.replace(/^www\./, '');
    const pathname = parsed.pathname.replace(/^\/|\/$/g, '');
    
    if (host.includes('github.com') && pathname) {
      const parts = pathname.split('/');
      if (parts.length >= 2) return `GitHub: ${parts[0]}/${parts[1]}`;
      return `GitHub: ${pathname}`;
    }
    if (host.includes('figma.com')) {
      return 'Figma Design File';
    }
    if (host.includes('drive.google.com')) {
      return 'Google Drive Resource Folder';
    }
    if (host.includes('docs.google.com')) {
      return 'Google Document';
    }
    if (host.includes('forms.gle') || host.includes('forms.google.com')) {
      return 'Google Form / Feedback';
    }
    if (pathname && pathname.length > 1) {
      const lastSlug = pathname.split('/').filter(Boolean).pop();
      const readable = lastSlug.replace(/[-_]/g, ' ');
      return `${host} · ${readable.charAt(0).toUpperCase() + readable.slice(1)}`;
    }
    return host;
  } catch {
    return url || 'Resource Link';
  }
}

/**
 * Normalizes any link (string or partial object) into standard format
 */
export function normalizeLink(raw, index = 0) {
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    const url = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
    return {
      id: `link-${Date.now()}-${index}`,
      title: deriveTitleFromUrl(url),
      url,
      description: 'Shared by instructor during class',
      tag: 'Live Resource',
      category: detectLinkCategory(url),
      pinned: false,
      addedAt: 'Class Resource',
    };
  }

  const url = (raw.url || '').trim();
  const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  return {
    id: raw.id || `link-${Date.now()}-${index}`,
    title: raw.title || deriveTitleFromUrl(validUrl),
    url: validUrl,
    description: raw.description || 'Shared by instructor during class',
    tag: raw.tag || 'Live Resource',
    category: raw.category || detectLinkCategory(validUrl),
    pinned: Boolean(raw.pinned),
    addedAt: raw.addedAt || 'Class Resource',
  };
}

/**
 * Smart multi-line text parser for teacher bulk paste
 * Supports:
 * - Direct URLs: https://example.com
 * - Title - URL: Figma Spec - https://figma.com/...
 * - Title: URL: Starter Repo: https://github.com/...
 * - Markdown links: [Design File](https://figma.com/...)
 * - Mixed text containing URLs
 */
export function parseBulkPastedText(text = '') {
  if (!text || !text.trim()) return [];

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const results = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check markdown link [Title](https://...)
    const mdMatch = line.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
    if (mdMatch) {
      results.push({
        id: `link-pasted-${Date.now()}-${i}`,
        title: mdMatch[1].trim(),
        url: mdMatch[2].trim(),
        description: 'Resource shared during live session',
        tag: 'Live Link',
        category: detectLinkCategory(mdMatch[2].trim()),
        pinned: false,
        addedAt: 'Just Now',
      });
      continue;
    }

    // Check "Title - URL" or "Title : URL" or "Title | URL"
    const splitMatch = line.match(/^(.+?)\s*[-:|–—]\s*(https?:\/\/[^\s]+)$/i);
    if (splitMatch) {
      const title = splitMatch[1].trim();
      const url = splitMatch[2].trim();
      results.push({
        id: `link-pasted-${Date.now()}-${i}`,
        title: title,
        url: url,
        description: 'Resource shared during live session',
        tag: 'Live Link',
        category: detectLinkCategory(url),
        pinned: false,
        addedAt: 'Just Now',
      });
      continue;
    }

    // Check URL anywhere in line
    const urlMatches = line.match(/(https?:\/\/[^\s]+)/g);
    if (urlMatches && urlMatches.length > 0) {
      for (let j = 0; j < urlMatches.length; j++) {
        const url = urlMatches[j].replace(/[),.;]+$/, ''); // Strip trailing punctuation
        const remainingText = line.replace(urlMatches[j], '').trim();
        const title = remainingText.length > 2 ? remainingText.replace(/^[-:|–—]\s*|\s*[-:|–—]$/g, '').trim() : deriveTitleFromUrl(url);

        results.push({
          id: `link-pasted-${Date.now()}-${i}-${j}`,
          title: title || deriveTitleFromUrl(url),
          url: url,
          description: 'Resource shared during live session',
          tag: 'Live Link',
          category: detectLinkCategory(url),
          pinned: false,
          addedAt: 'Just Now',
        });
      }
      continue;
    }

    // If it looks like a domain without protocol (e.g. figma.com/file/... or github.com/...)
    const domainMatch = line.match(/^([a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s]*)?)$/i);
    if (domainMatch) {
      const url = `https://${domainMatch[1]}`;
      results.push({
        id: `link-pasted-${Date.now()}-${i}`,
        title: deriveTitleFromUrl(url),
        url: url,
        description: 'Resource shared during live session',
        tag: 'Live Link',
        category: detectLinkCategory(url),
        pinned: false,
        addedAt: 'Just Now',
      });
    }
  }

  return results;
}
