/**
 * Input Validator
 * Prevents SQL injection, XSS, and fuzzing attacks
 */

export class InputValidator {
  // SQL injection patterns
  private static readonly SQL_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b)/i,
    /(--|;|\/\*|\*\/|@@|@)/,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /('|"|\\|`)/,
    /(CHAR\s*\(|CONCAT\s*\(|0x[0-9a-f]+)/i
  ];

  // XSS patterns
  private static readonly XSS_PATTERNS = [
    /<script[\s>]/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<svg[\s>].*onload/i,
    /data:text\/html/i
  ];

  // Path traversal
  private static readonly PATH_PATTERNS = [
    /\.\.\//,
    /\.\.\\/,
    /\/etc\/passwd/i,
    /c:\\windows/i
  ];

  /**
   * Validate input against all attack patterns
   */
  static validate(input: string, options: {
    maxLength?: number;
    allowHTML?: boolean;
    strict?: boolean;
  } = {}): { valid: boolean; reason?: string } {
    const { maxLength = 1000, allowHTML = false, strict = true } = options;

    // Length check
    if (input.length > maxLength) {
      return { valid: false, reason: 'Input exceeds maximum length' };
    }

    // Empty check
    if (input.trim().length === 0) {
      return { valid: false, reason: 'Input is empty' };
    }

    // SQL injection check
    if (strict) {
      for (const pattern of this.SQL_PATTERNS) {
        if (pattern.test(input)) {
          return { valid: false, reason: 'Potential SQL injection detected' };
        }
      }
    }

    // XSS check
    if (!allowHTML) {
      for (const pattern of this.XSS_PATTERNS) {
        if (pattern.test(input)) {
          return { valid: false, reason: 'Potential XSS attack detected' };
        }
      }
    }

    // Path traversal check
    for (const pattern of this.PATH_PATTERNS) {
      if (pattern.test(input)) {
        return { valid: false, reason: 'Path traversal detected' };
      }
    }

    // Null bytes
    if (input.includes('\0')) {
      return { valid: false, reason: 'Null bytes not allowed' };
    }

    // Control characters (except newline/tab)
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(input)) {
      return { valid: false, reason: 'Invalid control characters' };
    }

    return { valid: true };
  }

  /**
   * Sanitize input - remove dangerous characters
   */
  static sanitize(input: string): string {
    return input
      .replace(/[<>"'`]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/\.\.\//g, '')
      .replace(/\.\.\\/g, '')
      .trim();
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email) && email.length < 254;
  }

  /**
   * Validate URL format
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}