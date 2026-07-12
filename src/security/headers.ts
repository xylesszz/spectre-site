/**
 * Security Headers Manager
 * Applies runtime security headers and validates CSP compliance
 */

export class HeadersManager {
  private static instance: HeadersManager;
  private violations: string[] = [];

  private constructor() {
    this.setupCSPListener();
    this.enforceHTTPS();
    this.preventFraming();
  }

  static getInstance(): HeadersManager {
    if (!HeadersManager.instance) {
      HeadersManager.instance = new HeadersManager();
    }
    return HeadersManager.instance;
  }

  /**
   * Monitor CSP violations in real-time
   */
  private setupCSPListener(): void {
    document.addEventListener('securitypolicyviolation', (e) => {
      this.violations.push(`${e.violatedDirective}: ${e.blockedURI}`);
      console.warn('[SPECTRE Security] CSP violation detected:', {
        directive: e.violatedDirective,
        blocked: e.blockedURI,
        original: e.originalPolicy
      });
    });
  }

  /**
   * Force HTTPS redirect if on HTTP
   */
  private enforceHTTPS(): void {
    if (
      window.location.protocol === 'http:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }

  /**
   * Prevent clickjacking via frame-busting
   */
  private preventFraming(): void {
    if (window.top !== window.self) {
      try {
        // ✅ Corrigido: verificação de null
        if (window.top && window.top.location.hostname !== window.self.location.hostname) {
          window.top.location.href = window.self.location.href;
        }
      } catch {
        document.documentElement.innerHTML = '';
        window.location.hash = '#blocked';
      }
    }
  }

  /**
   * Get all recorded violations
   */
  getViolations(): string[] {
    return [...this.violations];
  }
}

export const headersManager = HeadersManager.getInstance();