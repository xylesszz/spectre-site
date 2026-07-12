import { createElement } from '@/utils/dom';
import { i18n } from '@/translations';
import type { Product } from '@/types';

export class Modal {
  private el: HTMLElement;

  constructor() {
    this.el = createElement('div', { className: 'modal' });
    document.body.appendChild(this.el);
    this.bindEvents();
  }

  open(product: Product): void {
    const t = i18n.t();
    
    const imageContent = product.loading 
      ? `<div class="modal-loading">
           <div class="loading-spinner-small"></div>
           <span class="loading-text">Loading...</span>
         </div>`
      : `<img src="${product.previewImage}" alt="${product.name}" />`;

    this.el.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-content">
        <button class="modal-close" data-close aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h3 class="modal-title">${t.products.previewTitle}</h3>
        <div class="modal-image">
          ${imageContent}
        </div>
        <div class="modal-info">
          <h4>${product.name}</h4>
          <p>${product.description}</p>
          <span class="modal-price">$${product.price}${t.products.monthly}</span>
        </div>
      </div>
    `;
    this.el.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.el.classList.remove('modal-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      this.el.innerHTML = '';
    }, 200);
  }

  private bindEvents(): void {
    this.el.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-close]')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.el.classList.contains('modal-open')) {
        this.close();
      }
    });
  }
}