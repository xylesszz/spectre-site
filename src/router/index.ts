import type { TabId } from '@/types';

type RouteHandler = (tab: TabId) => void;

class Router {
  private currentTab: TabId = 'home';
  private handler: RouteHandler | null = null;

  constructor() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  setHandler(handler: RouteHandler): void {
    this.handler = handler;
  }

  navigate(tab: TabId): void {
    window.location.hash = `#${tab}`;
  }

  getCurrentTab(): TabId {
    return this.currentTab;
  }

  private handleRoute(): void {
    const hash = window.location.hash.replace('#', '') as TabId;
    const validTabs: TabId[] = ['home', 'products', 'about', 'support'];
    const tab = validTabs.includes(hash) ? hash : 'home';

    if (tab !== this.currentTab) {
      this.currentTab = tab;
    } else if (!window.location.hash) {
      window.location.hash = '#home';
      return;
    }

    this.handler?.(tab);
  }
}

export const router = new Router();