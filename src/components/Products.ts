import { createElement } from '@/utils/dom';
import { i18n } from '@/translations';
import type { Platform, PlatformId, Product } from '@/types';
import { Modal } from './Modal';

export class Products {
  private el: HTMLElement;
  private currentPlatform: PlatformId = 'pc';
  private modal: Modal;

  private platforms: Platform[] = [
    {
      id: 'pc',
      name: 'PC',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      available: true,
      products: [
        {
          id: 'ff-external',
          name: 'Free Fire External',
          description: 'Lightweight overlay with core features',
          price: 29.99,
          image: '/external.png',
          previewImage: '/external.png',
          loading: false,
          status: 'available'
        },
        {
          id: 'ff-internal',
          name: 'Free Fire Internal',
          description: 'Injected solution with advanced features',
          price: 0,
          image: '/internal.png',
          previewImage: '/internal.png',
          loading: true,
          status: 'development'
        },
        {
          id: 'ff-precision',
          name: 'Free Fire Precision',
          description: 'Full suite with priority support',
          price: 0,
          image: '/preview.png',
          previewImage: '/preview.png',
          loading: true,
          status: 'development'
        }
      ]
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
      available: false
    },
    {
      id: 'android',
      name: 'Android',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
      available: false
    }
  ];

  constructor() {
    this.el = createElement('section', { className: 'products' });
    this.modal = new Modal();
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
    const platform = this.platforms.find((p) => p.id === this.currentPlatform)!;

    this.el.innerHTML = `
      <div class="products-inner">
        <div class="platform-tabs">
          ${this.platforms
            .map(
              (p) => `
            <button class="platform-tab ${p.id === this.currentPlatform ? 'active' : ''}" 
                    data-platform="${p.id}">
              <span class="platform-icon">${p.icon}</span>
              <span>${p.name}</span>
            </button>
          `
            )
            .join('')}
        </div>

        <div class="products-content">
          ${platform.available ? this.renderProducts(platform.products!, t) : this.renderMaintenance(t)}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private renderProducts(products: Product[], t: ReturnType<typeof i18n.t>): string {
    return `
      <div class="product-grid">
        ${products
          .map(
            (p, index) => `
          <div class="product-card" style="animation-delay: ${index * 80}ms">
            <div class="product-image">
              <img src="${p.image}" alt="${p.name}" />
            </div>
            <div class="product-info">
              <div class="product-header">
                <h3 class="product-name">${p.name}</h3>
                ${p.status === 'development' ? `<span class="badge-dev">${t.products.development}</span>` : ''}
              </div>
              <p class="product-desc">${p.description}</p>
              <div class="product-footer">
                ${p.status === 'development' 
                  ? `<span class="product-price-dev">${t.products.comingSoon}</span>`
                  : `<span class="product-price">R$ ${p.price.toFixed(2).replace('.', ',')}${t.products.monthly}</span>`
                }
                <div class="product-actions">
                  <button class="btn-ghost" data-preview="${p.id}">
                    ${t.products.preview}
                  </button>
                  ${p.status !== 'development' ? `
                    <a href="https://discord.gg/cqsUYw3u7G" target="_blank" rel="noopener" class="btn-primary">
                      ${t.products.buy}
                    </a>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  private renderMaintenance(t: ReturnType<typeof i18n.t>): string {
    return `
      <div class="maintenance">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <p class="maintenance-text">${t.products.underMaintenance}</p>
      </div>
    `;
  }

  private bindEvents(): void {
    this.el.querySelectorAll<HTMLButtonElement>('.platform-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.platform as PlatformId;
        if (platform !== this.currentPlatform) {
          this.currentPlatform = platform;
          this.render();
        }
      });
    });

    this.el.querySelectorAll<HTMLButtonElement>('[data-preview]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.preview!;
        const platform = this.platforms.find((p) => p.id === this.currentPlatform)!;
        const product = platform.products?.find((p) => p.id === productId);
        if (product) {
          this.modal.open(product);
        }
      });
    });
  }
} 