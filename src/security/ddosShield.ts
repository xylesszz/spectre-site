/**
 * DDoS Shield (Frontend Layer)
 * Detects abnormal request patterns
 * Note: Real DDoS protection needs Cloudflare/nginx
 */

export class DDoSShield {
  private static requestLog: number[] = [];
  private static readonly WINDOW_MS = 10_000; // 10 seconds
  private static readonly MAX_REQUESTS = 100;
  private static blocked = false;

  /**
   * Track a request
   */
  static trackRequest(): boolean {
    if (this.blocked) return false;

    const now = Date.now();
    this.requestLog.push(now);

    // Remove old entries
    this.requestLog = this.requestLog.filter(
      (t) => now - t < this.WINDOW_MS
    );

    // Check if exceeded
    if (this.requestLog.length > this.MAX_REQUESTS) {
      this.blocked = true;
      console.error('[SPECTRE Security] DDoS pattern detected. Blocking requests.');
      
      // Auto-unblock after 30 seconds
      setTimeout(() => {
        this.blocked = false;
        this.requestLog = [];
      }, 30_000);

      return false;
    }

    return true;
  }

  /**
   * Check if currently blocked
   */
  static isBlocked(): boolean {
    return this.blocked;
  }

  /**
   * Wrap fetch with DDoS protection
   */
  static async safeFetch(url: string, options?: RequestInit): Promise<Response | null> {
    if (!this.trackRequest()) {
      return null;
    }
    return fetch(url, options);
  }

  /**
   * Monitor navigation events
   */
  static init(): void {
    // Track hash changes
    window.addEventListener('hashchange', () => {
      this.trackRequest();
    });

    // Track rapid clicks
    let clickCount = 0;
    let clickTimer: number | null = null;

    document.addEventListener('click', () => {
      clickCount++;
      
      if (clickTimer === null) {
        clickTimer = window.setTimeout(() => {
          if (clickCount > 50) {
            console.warn('[SPECTRE Security] Rapid clicking detected');
          }
          clickCount = 0;
          clickTimer = null;
        }, 1000);
      }
    });
  }
}