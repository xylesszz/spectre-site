/**
 * Secure Storage Wrapper
 * Encrypts sensitive data in localStorage with obfuscation
 */

const STORAGE_PREFIX = 'spectre_';
const ENCRYPTION_KEY = 'spectre_v1_secure';

export class SecureStorage {
  /**
   * Simple XOR-based obfuscation (not true encryption, but prevents casual inspection)
   * For real encryption, use Web Crypto API with AES-GCM
   */
  private static obfuscate(data: string): string {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  }

  private static deobfuscate(data: string): string {
    try {
      const decoded = atob(data);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch {
      return '';
    }
  }

  /**
   * Set value with obfuscation
   */
  static set(key: string, value: unknown): void {
    try {
      const serialized = JSON.stringify(value);
      const obfuscated = this.obfuscate(serialized);
      localStorage.setItem(STORAGE_PREFIX + key, obfuscated);
    } catch (e) {
      console.error('[SPECTRE Security] Storage write failed:', e);
    }
  }

  /**
   * Get value with deobfuscation
   */
  static get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) return fallback;
      const deobfuscated = this.deobfuscate(raw);
      if (!deobfuscated) return fallback;
      return JSON.parse(deobfuscated) as T;
    } catch {
      return fallback;
    }
  }

  /**
   * Remove a key
   */
  static remove(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }

  /**
   * Clear all SPECTRE-prefixed keys
   */
  static clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }

  /**
   * Validate storage integrity
   */
  static validate(): boolean {
    try {
      const testKey = STORAGE_PREFIX + '__validation__';
      const testValue = { ts: Date.now() };
      this.set('__validation__', testValue);
      const retrieved = this.get('__validation__', null);
      this.remove('__validation__');
      return JSON.stringify(retrieved) === JSON.stringify(testValue);
    } catch {
      return false;
    }
  }
}