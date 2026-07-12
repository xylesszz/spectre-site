/**
 * Anti-Phishing Protection
 * - Console warnings
 * - Domain verification
 * - Frame busting
 * - DevTools detection
 */

export class AntiPhishing {
  private static readonly OFFICIAL_DOMAINS = [
    'spectre.app',
    'spectre.gg',
    'localhost',
    '127.0.0.1'
  ];

  /**
   * Initialize all anti-phishing protections
   */
  static init(): void {
    this.showConsoleWarning();
    this.verifyDomain();
    this.preventFraming();
    this.protectLinks();
  }

  /**
   * Show warning in browser console to prevent social engineering
   */
  private static showConsoleWarning(): void {
    const styles = [
      'background: #0a0a0a',
      'color: #ffffff',
      'fontSize: 24px',
      'fontWeight: bold',
      'padding: 20px 40px',
      'border: 1px solid #333'
    ].join(';');

    const warningStyles = [
      'color: #ff4444',
      'fontSize: 16px',
      'fontWeight: bold',
      'padding: 10px 0'
    ].join(';');

    const infoStyles = [
      'color: #888888',
      'fontSize: 13px',
      'padding: 5px 0'
    ].join(';');

    console.log('%c⚠️ SPECTRE SECURITY WARNING', styles);
    console.log(
      '%cThis browser feature is meant for developers.',
      warningStyles
    );
    console.log(
      '%cIf someone told you to copy-paste something here, it\'s a scam and will give them access to your account.',
      infoStyles
    );
    console.log(
      '%cSee https://en.wikipedia.org/wiki/Self-XSS for more information.',
      infoStyles
    );
  }

  /**
   * Verify current domain is official
   */
  private static verifyDomain(): void {
    const hostname = window.location.hostname;
    const isOfficial = this.OFFICIAL_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith('.' + d)
    );

    if (!isOfficial && hostname !== 'localhost') {
      console.error('[SPECTRE Security] Running on unofficial domain:', hostname);
      // Optionally show warning banner
      this.showDomainWarning(hostname);
    }
  }

  /**
   * Show warning banner if on unofficial domain
   */
  private static showDomainWarning(hostname: string): void {
    const banner = document.createElement('div');
    banner.id = 'spectre-phishing-warning';
    banner.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #1a0000;
        border-bottom: 1px solid #ff4444;
        color: #ff8888;
        padding: 12px 20px;
        font-family: Inter, sans-serif;
        font-size: 13px;
        z-index: 99999;
        text-align: center;
      ">
        ⚠️ Warning: You are on an unofficial domain (<strong>${hostname}</strong>). 
        This may be a phishing attempt. Visit the official SPECTRE website.
      </div>
    `;
    document.body.appendChild(banner);
  }

  /**
   * Prevent the site from being embedded in iframes (clickjacking)
   */
  private static preventFraming(): void {
    if (window.top !== window.self) {
      document.body.style.display = 'none';
      try {
        window.top.location.href = window.self.location.href;
      } catch {
        document.body.innerHTML = '<h1>This site cannot be embedded.</h1>';
      }
    }
  }

  /**
   * Protect all external links with noopener/noreferrer
   */
  private static protectLinks(): void {
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        const rel = link.getAttribute('rel') || '';
        if (!rel.includes('noopener')) {
          link.setAttribute('rel', (rel + ' noopener noreferrer').trim());
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href', 'target']
    });
  }
}