import { createElement } from '@/utils/dom';
import { i18n } from '@/translations';

export class Hero {
  private el: HTMLElement;

  constructor() {
    this.el = createElement('section', { className: 'hero' });
    this.render();
  }

  mount(container: HTMLElement): void {
    container.appendChild(this.el);
    this.animateIn();
  }

  private animateIn(): void {
    this.el.classList.add('fade-in');
    setTimeout(() => {
      this.el.classList.remove('fade-in');
    }, 400);
  }

  private render(): void {
    const t = i18n.t();
    this.el.innerHTML = `
      <div class="hero-inner">
        <div class="hero-content">
          <h1 class="hero-title" data-i18n="home.title">${t.home.title}</h1>
          <p class="hero-subtitle" data-i18n="home.subtitle">${t.home.subtitle}</p>
          <button class="btn-primary" data-action="explore">
            ${t.home.cta}
          </button>
          <div class="hero-status">
            <span class="status-dot"></span>
            <span class="status-text" data-i18n="home.status">${t.home.status}</span>
          </div>
        </div>
        <div class="hero-visual">
          <img src="/gengar.png" alt="SPECTRE" class="hero-image" />
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const btn = this.el.querySelector<HTMLButtonElement>('[data-action="explore"]');
    btn?.addEventListener('click', () => {
      window.location.hash = '#products';
    });
  }
}