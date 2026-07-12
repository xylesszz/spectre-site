import { createElement } from '@/utils/dom';
import { i18n } from '@/translations';

export class Header {
  private el: HTMLElement;

  constructor() {
    this.el = createElement('header', { className: 'site-header' });
    this.render();
  }

  mount(container: HTMLElement): void {
    container.appendChild(this.el);
  }

  private render(): void {
    const lang = i18n.getLanguage();

    this.el.innerHTML = `
      <div class="header-inner">
        <a href="#home" class="logo">SPECTRE</a>
        <div class="header-actions">
          <button class="lang-toggle" data-action="toggle-lang" aria-label="Toggle language">
            ${lang.toUpperCase()}
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const langBtn = this.el.querySelector<HTMLButtonElement>('[data-action="toggle-lang"]');
    langBtn?.addEventListener('click', () => i18n.toggleLanguage());
  }

  update(): void {
    this.render();
  }
}