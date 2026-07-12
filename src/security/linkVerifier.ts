/**
 * Link Verifier
 * Validates all links before navigation
 */

export class LinkVerifier {
  private static readonly ALLOWED_DOMAINS = [
    'discord.gg',
    'discord.com',
    'youtube.com',
    'youtu.be',
    'tiktok.com',
    'spectre.app',
    'spectre.gg'
  ];

  /**
   * Initialize link protection
   */
  static init(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && !this.isSafe(href)) {
          e.preventDefault();
          console.warn('[SPECTRE Security] Blocked unsafe link:', href);
        }
      }
    }, true);
  }

  /**
   * Check if URL is safe
   */
  private static isSafe(url: string): boolean {
    // Allow relative URLs
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('./')) {
      return true;
    }

    try {
      const parsed = new URL(url, window.location.origin);
      
      // Block dangerous protocols
      if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
        return false;
      }

      // Same origin is always safe
      if (parsed.origin === window.location.origin) {
        return true;
      }

      // Check allowed domains
      return this.ALLOWED_DOMAINS.some(
        (domain) => parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
      );
    } catch {
      return false;
    }
  }

  /**
   * Verify URL before opening
   */
  static verify(url: string): boolean {
    return this.isSafe(url);
  }
}