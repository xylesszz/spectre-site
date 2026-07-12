export const $ = <T extends Element>(selector: string): T | null => {
  return document.querySelector<T>(selector);
};

export const $$ = <T extends Element>(selector: string): NodeListOf<T> => {
  return document.querySelectorAll<T>(selector);
};

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string;
    id?: string;
    text?: string;
    html?: string;
    attrs?: Record<string, string>;
    children?: (Node | string)[];
  }
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(tag);
  if (options?.className) el.className = options.className;
  if (options?.id) el.id = options.id;
  if (options?.text) el.textContent = options.text;
  if (options?.html) el.innerHTML = options.html;
  if (options?.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  if (options?.children) {
    options.children.forEach((child) => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });
  }
  return el;
};

export const setAttributes = (el: Element, attrs: Record<string, string>): void => {
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
};