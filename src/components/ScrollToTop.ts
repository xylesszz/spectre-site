import { createElement } from '@/utils/dom';

export class ScrollToTop {
  private el: HTMLElement;

  constructor() {
    this.el = createElement('button', {
      className: 'scroll-top',
      attrs: { 'aria-label': 'Scroll to top' }
    });
    this.el.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `;
    document.body.appendChild(this.el);
    this.bindEvents();
  }

  private bindEvents(): void {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        this.el.classList.add('visible');
      } else {
        this.el.classList.remove('visible');
      }
    });

    this.el.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}