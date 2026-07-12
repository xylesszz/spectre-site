/**
 * Subresource Integrity (SRI) Manager
 * Verifies integrity of external resources
 */

export class IntegrityManager {
  private static readonly RESOURCE_HASHES: Record<string, string> = {
    // Example: Add hashes for critical external resources
    // 'https://fonts.googleapis.com/css2?family=Inter': 'sha384-...'
  };

  /**
   * Verify integrity of a resource
   */
  static async verify(url: string, expectedHash: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      const data = await response.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashBase64 = btoa(String.fromCharCode(...hashArray));
      const computed = `sha256-${hashBase64}`;
      return computed === expectedHash;
    } catch {
      return false;
    }
  }

  /**
   * Apply SRI to all external scripts
   */
  static applyToScripts(): void {
    document.querySelectorAll('script[src]').forEach((script) => {
      const src = script.getAttribute('src');
      if (src && this.RESOURCE_HASHES[src]) {
        script.setAttribute('integrity', this.RESOURCE_HASHES[src]);
        script.setAttribute('crossorigin', 'anonymous');
      }
    });
  }

  /**
   * Monitor for unauthorized script injection
   */
  static monitorScripts(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT') {
            const script = node as HTMLScriptElement;
            const src = script.getAttribute('src');
            
            // Block inline scripts (except our own)
            if (!src && !script.hasAttribute('data-spectre-allowed')) {
              console.warn('[SPECTRE Security] Blocked unauthorized inline script');
              script.remove();
            }
            
            // Verify external scripts
            if (src && this.RESOURCE_HASHES[src]) {
              if (!script.getAttribute('integrity')) {
                console.warn('[SPECTRE Security] Script missing integrity:', src);
              }
            }
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
}