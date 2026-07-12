/**
 * Bot Detection
 * Detects automated browsers and scrapers
 */

export class BotDetector {
  private static score = 0;
  private static readonly CHECKS: Array<() => boolean> = [
    () => 'webdriver' in navigator,
    () => navigator.userAgent.toLowerCase().includes('bot'),
    () => navigator.userAgent.toLowerCase().includes('crawler'),
    () => navigator.userAgent.toLowerCase().includes('spider'),
    () => !navigator.languages || navigator.languages.length === 0,
    () => window.outerWidth === 0 && window.outerHeight === 0,
    () => navigator.plugins.length === 0 && !/Firefox/.test(navigator.userAgent),
    () => navigator.hardwareConcurrency === undefined,
  ];

  /**
   * Run bot detection and return score (0 = human, higher = more likely bot)
   */
  static detect(): number {
    this.score = 0;
    
    this.CHECKS.forEach((check) => {
      try {
        if (check()) this.score += 10;
      } catch {
        this.score += 5;
      }
    });

    // Check for automation frameworks
    if ((window as any)._selenium || (window as any).callPhantom) {
      this.score += 50;
    }

    if (this.score > 30) {
      console.warn('[SPECTRE Security] Bot detected. Score:', this.score);
    }

    return this.score;
  }

  /**
   * Check if current visitor is likely a bot
   */
  static isBot(): boolean {
    return this.detect() > 30;
  }

  /**
   * Get detection score
   */
  static getScore(): number {
    return this.score;
  }
}