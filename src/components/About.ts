import { createElement } from '@/utils/dom';
import { i18n } from '@/translations';

export class About {
  private el: HTMLElement;

  constructor() {
    this.el = createElement('section', { className: 'about' });
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
      <div class="about-inner">
        <div class="about-content">
          <h2 class="about-title" data-i18n="about.title">${t.about.title}</h2>
          <p class="about-description" data-i18n="about.description">${t.about.description}</p>
          <div class="about-stats">
            <div class="stat">
              <span class="stat-value">+100</span>
              <span class="stat-label" data-i18n="about.users">${t.about.users}</span>
            </div>
            <div class="stat">
              <span class="stat-value">99.7%</span>
              <span class="stat-label" data-i18n="about.uptime">${t.about.uptime}</span>
            </div>
          </div>
        </div>
        <div class="about-visual">
          <img src="/gengar.png" alt="SPECTRE" class="about-image" />
        </div>
      </div>

      <div class="faq-section">
        <h3 class="faq-title">${t.about.faq.title}</h3>
        <div class="faq-list">
          ${t.about.faq.items
            .map(
              (item) => `
            <details class="faq-item">
              <summary class="faq-question">
                <span>${item.question}</span>
                <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </summary>
              <div class="faq-answer">
                <p>${item.answer}</p>
              </div>
            </details>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }
}