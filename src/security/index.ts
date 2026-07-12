/**
 * SPECTRE Security Module
 * Central export and initialization
 */

import { headersManager } from './headers';
import { AntiPhishing } from './antiPhishing';
import { LinkVerifier } from './linkVerifier';
import { BotDetector } from './botDetector';
import { DDoSShield } from './ddosShield';
import { IntegrityManager } from './integrity';
import { DevToolsDetector } from './devToolsDetector';
import { SecurityAudit } from './audit';

export { Sanitizer } from './sanitizer';
export { RateLimiter } from './rateLimiter';
export { SecureStorage } from './secureStorage';
export { InputValidator } from './inputValidator';
export { headersManager } from './headers';
export { AntiPhishing } from './antiPhishing';
export { LinkVerifier } from './linkVerifier';
export { BotDetector } from './botDetector';
export { DDoSShield } from './ddosShield';
export { IntegrityManager } from './integrity';
export { DevToolsDetector } from './devToolsDetector';
export { SecurityAudit } from './audit';

/**
 * Initialize all security modules
 */
export function initSecurity(): void {
  SecurityAudit.log('INIT', 'Initializing security modules');

  try {
    // Headers & CSP
    headersManager;
    SecurityAudit.log('HEADERS', 'Security headers active');

    // Anti-phishing
    AntiPhishing.init();
    SecurityAudit.log('PHISHING', 'Anti-phishing protection active');

    // Link verification
    LinkVerifier.init();
    SecurityAudit.log('LINKS', 'Link verifier active');

    // Bot detection
    const botScore = BotDetector.detect();
    SecurityAudit.log('BOT', `Bot detection score: ${botScore}`, botScore > 30 ? 'warn' : 'info');

    // DDoS shield
    DDoSShield.init();
    SecurityAudit.log('DDOS', 'DDoS shield active');

    // Script integrity monitoring
    IntegrityManager.monitorScripts();
    SecurityAudit.log('SRI', 'Script integrity monitoring active');

    // DevTools detection (production only)
    if (import.meta.env.PROD) {
      DevToolsDetector.start();
      DevToolsDetector.onChange((isOpen) => {
        SecurityAudit.log(
          'DEVTOOLS',
          `DevTools ${isOpen ? 'opened' : 'closed'}`,
          'warn'
        );
      });
    }

    SecurityAudit.log('INIT', 'All security modules initialized successfully');
  } catch (error) {
    SecurityAudit.log('INIT', 'Security initialization failed', 'error', error);
  }
}