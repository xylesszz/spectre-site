/**
 * Rate Limiter - Prevents brute force attacks
 * Limits actions per time window
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil: number;
}

export class RateLimiter {
  private static store = new Map<string, RateLimitEntry>();
  private static readonly DEFAULT_CONFIG: RateLimitConfig = {
    maxAttempts: 5,
    windowMs: 60_000, // 1 minute
    blockDurationMs: 300_000 // 5 minutes
  };

  /**
   * Check if action is allowed
   */
  static isAllowed(action: string, config: Partial<RateLimitConfig> = {}): boolean {
    const cfg = { ...this.DEFAULT_CONFIG, ...config };
    const now = Date.now();
    const entry = this.store.get(action);

    if (!entry) {
      this.store.set(action, {
        attempts: 1,
        firstAttempt: now,
        blockedUntil: 0
      });
      return true;
    }

    // Check if blocked
    if (entry.blockedUntil > now) {
      return false;
    }

    // Reset window if expired
    if (now - entry.firstAttempt > cfg.windowMs) {
      entry.attempts = 1;
      entry.firstAttempt = now;
      return true;
    }

    // Increment attempts
    entry.attempts++;

    // Block if exceeded
    if (entry.attempts > cfg.maxAttempts) {
      entry.blockedUntil = now + cfg.blockDurationMs;
      console.warn(`[SPECTRE Security] Rate limit exceeded for "${action}". Blocked for ${cfg.blockDurationMs / 1000}s`);
      return false;
    }

    return true;
  }

  /**
   * Get remaining time before unblock
   */
  static getBlockTime(action: string): number {
    const entry = this.store.get(action);
    if (!entry) return 0;
    return Math.max(0, entry.blockedUntil - Date.now());
  }

  /**
   * Reset rate limit for an action
   */
  static reset(action: string): void {
    this.store.delete(action);
  }

  /**
   * Clear all rate limits
   */
  static clearAll(): void {
    this.store.clear();
  }
}