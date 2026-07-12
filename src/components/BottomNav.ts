import { createElement } from '@/utils/dom';
import { i18n } from '@/translations';
import { router } from '@/router';
import type { TabId } from '@/types';

interface NavItem {
  id: TabId;
  labelKey: keyof ReturnType<typeof i18n.t>['nav'];
  icon: string;
}

export class BottomNav {
  private el: HTMLElement;

  private items: NavItem[] = [
    {
      id: 'home',
      labelKey: 'home',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    },
    {
      id: 'products',
      labelKey: 'products',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`
    },
    {
      id: 'about',
      labelKey: 'about',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    },
    {
      id: 'support',
      labelKey: 'support',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`
    }
  ];

  constructor() {
    this.el = createElement('nav', { className: 'bottom-nav' });
    this.render();
  }

  mount(container: HTMLElement): void {
    container.appendChild(this.el);
  }

  private render(): void {
    const t = i18n.t();
    const current = router.getCurrentTab();

    this.el.innerHTML = this.items
      .map(
        (item) => `
      <button class="nav-item ${item.id === current ? 'active' : ''}" data-tab="${item.id}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label" data-i18n="nav.${item.labelKey}">${t.nav[item.labelKey]}</span>
      </button>
    `
      )
      .join('');

    this.bindEvents();
  }

  private bindEvents(): void {
    this.el.querySelectorAll<HTMLButtonElement>('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab as TabId;
        router.navigate(tab);
      });
    });
  }

  update(): void {
    this.render();
  }
}