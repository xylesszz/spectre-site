/**
 * DevTools Detector
 * Detects when developer tools are open
 */

export class DevToolsDetector {
  private static isOpen = false;
  private static listeners: Array<(isOpen: boolean) => void> = [];
  private static threshold = 160;

  /**
   * Start detection
   */
  static start(): void {
    this.detectBySize();
    this.detectByConsole();
    this.detectByDebugger();
  }

  /**
   * Detect via window size difference
   */
  private static detectBySize(): void {
    const check = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const wasOpen = this.isOpen;
      
      this.isOpen = widthDiff > this.threshold || heightDiff > this.threshold;
      
      if (this.isOpen !== wasOpen) {
        this.notify();
      }
    };

    check();
    window.addEventListener('resize', check);
  }

  /**
   * Detect via console timing
   */
  private static detectByConsole(): void {
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        this.isOpen = true;
        this.notify();
        return 'spectre-devtools';
      }
    });

    setInterval(() => {
      this.isOpen = false;
      console.log(element);
      console.clear();
    }, 1000);
  }

  /**
   * Detect via debugger statement
   */
  private static detectByDebugger(): void {
    const check = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = performance.now();
      
      if (end - start > 100) {
        this.isOpen = true;
        this.notify();
      }
    };

    // Only run in production
    if (import.meta.env.PROD) {
      setInterval(check, 3000);
    }
  }

  /**
   * Register listener
   */
  static onChange(callback: (isOpen: boolean) => void): void {
    this.listeners.push(callback);
  }

  /**
   * Check current state
   */
  static getIsOpen(): boolean {
    return this.isOpen;
  }

  private static notify(): void {
    this.listeners.forEach((cb) => cb(this.isOpen));
  }
}