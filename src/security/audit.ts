/**
 * Security Audit Logger
 * Records security events for analysis
 */

interface AuditEntry {
  timestamp: number;
  type: string;
  severity: 'info' | 'warn' | 'error';
  message: string;
  details?: unknown;
}

export class SecurityAudit {
  private static logs: AuditEntry[] = [];
  private static readonly MAX_LOGS = 100;

  /**
   * Log a security event
   */
  static log(
    type: string,
    message: string,
    severity: 'info' | 'warn' | 'error' = 'info',
    details?: unknown
  ): void {
    const entry: AuditEntry = {
      timestamp: Date.now(),
      type,
      severity,
      message,
      details
    };

    this.logs.push(entry);

    // Keep only last MAX_LOGS entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // Console output in dev
    if (import.meta.env.DEV) {
      const color = severity === 'error' ? 'red' : severity === 'warn' ? 'orange' : 'gray';
      console.log(
        `%c[SPECTRE Audit] ${type}%c ${message}`,
        `color: ${color}; font-weight: bold`,
        'color: inherit'
      );
    }
  }

  /**
   * Get all logs
   */
  static getLogs(): AuditEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by severity
   */
  static getBySeverity(severity: 'info' | 'warn' | 'error'): AuditEntry[] {
    return this.logs.filter((l) => l.severity === severity);
  }

  /**
   * Clear logs
   */
  static clear(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  static export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}