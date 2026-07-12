/**
 * XSS Protection - HTML Sanitizer
 * Prevents injection of malicious scripts
 */

const DANGEROUS_TAGS = new Set([
  'script', 'iframe', 'object', 'embed', 'link', 'style',
  'meta', 'applet', 'form', 'input', 'textarea', 'button',
  'select', 'base', 'svg', 'math'
]);

const DANGEROUS_ATTRS = new Set([
  'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur',
  'onsubmit', 'onchange', 'oninput', 'onkeydown', 'onkeyup', 'onkeypress',
  'onmousedown', 'onmouseup', 'onmouseout', 'onmouseenter', 'onmouseleave',
  'oncontextmenu', 'ondrag', 'ondrop', 'onwheel', 'onscroll', 'onresize',
  'oncopy', 'onpaste', 'oncut', 'onabort', 'oncanplay', 'ondblclick'
]);

const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript):/i;

export class Sanitizer {
  /**
   * Sanitize HTML string - removes dangerous tags and attributes
   */
  static sanitizeHTML(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    this.walkAndSanitize(doc.body);
    
    return doc.body.innerHTML;
  }

  /**
   * Sanitize text - escape HTML entities
   */
  static escapeText(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    return text.replace(/[&<>"'`=/]/g, (char) => map[char]);
  }

  /**
   * Sanitize URL - block dangerous protocols
   */
  static sanitizeURL(url: string): string {
    try {
      const parsed = new URL(url, window.location.origin);
      if (DANGEROUS_PROTOCOLS.test(parsed.protocol)) {
        return '#';
      }
      return parsed.toString();
    } catch {
      return '#';
    }
  }

  /**
   * Validate if URL is safe (same origin or whitelisted)
   */
  static isSafeURL(url: string, allowedDomains: string[] = []): boolean {
    try {
      const parsed = new URL(url, window.location.origin);
      
      // Same origin is always safe
      if (parsed.origin === window.location.origin) return true;
      
      // Check allowed domains
      if (allowedDomains.some((d) => parsed.hostname.endsWith(d))) return true;
      
      // Only allow http/https
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private static walkAndSanitize(node: Node): void {
    const toRemove: Node[] = [];
    
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tagName = el.tagName.toLowerCase();
        
        // Remove dangerous tags
        if (DANGEROUS_TAGS.has(tagName)) {
          toRemove.push(child);
          return;
        }
        
        // Remove dangerous attributes
        Array.from(el.attributes).forEach((attr) => {
          const attrName = attr.name.toLowerCase();
          
          if (DANGEROUS_ATTRS.has(attrName)) {
            el.removeAttribute(attr.name);
            return;
          }
          
          // Check for javascript: in href/src
          if (attrName === 'href' || attrName === 'src' || attrName === 'action') {
            if (DANGEROUS_PROTOCOLS.test(attr.value.trim())) {
              el.removeAttribute(attr.name);
            }
          }
          
          // Block data: URIs in dangerous contexts
          if (attrName === 'src' && attr.value.trim().toLowerCase().startsWith('data:text/html')) {
            el.removeAttribute(attr.name);
          }
        });
        
        // Recurse
        this.walkAndSanitize(el);
      }
    });
    
    toRemove.forEach((n) => n.parentNode?.removeChild(n));
  }
}