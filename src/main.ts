import { Loading } from '@/components/Loading';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Products } from '@/components/Products';
import { About } from '@/components/About';
import { Support } from '@/components/Support';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { router } from '@/router';
import { initSecurity } from '@/security';
import type { TabId } from '@/types';
import '@/styles/main.css';

// 🔒 Initialize security
initSecurity();

class App {
  private root: HTMLElement;
  private content: HTMLElement;
  private header: Header;
  private bottomNav: BottomNav;
  private footer: Footer;

  private hero: Hero;
  private products: Products;
  private about: About;
  private support: Support;

  constructor() {
    this.root = document.getElementById('app')!;
    this.root.innerHTML = '';

    this.header = new Header();
    this.bottomNav = new BottomNav();
    this.footer = new Footer();

    this.hero = new Hero();
    this.products = new Products();
    this.about = new About();
    this.support = new Support();

    this.content = document.createElement('main');
    this.content.className = 'main-content';

    this.root.appendChild(this.createHeaderContainer());
    this.root.appendChild(this.content);
    this.root.appendChild(this.createFooterContainer());

    this.setupRouter();
    this.setupKeyboardShortcuts();

    new Loading();
    new ScrollToTop();
  }

  private createHeaderContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'header-container';
    this.header.mount(container);
    return container;
  }

  private createFooterContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'footer-container';
    this.footer.mount(container);
    return container;
  }

  private setupRouter(): void {
    router.setHandler((tab: TabId) => {
      this.renderTab(tab);
      this.bottomNav.update();
    });
  }

  private renderTab(tab: TabId): void {
    this.content.innerHTML = '';
    window.scrollTo({ top: 0 });

    switch (tab) {
      case 'home':
        this.hero.mount(this.content);
        break;
      case 'products':
        this.products.mount(this.content);
        break;
      case 'about':
        this.about.mount(this.content);
        break;
      case 'support':
        this.support.mount(this.content);
        break;
    }

    const navContainer = document.createElement('div');
    navContainer.className = 'bottom-nav-container';
    this.bottomNav.mount(navContainer);
    this.root.appendChild(navContainer);
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      if (!e.ctrlKey) return;
      const tabs: TabId[] = ['home', 'products', 'about', 'support'];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4) {
        e.preventDefault();
        router.navigate(tabs[num - 1]);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});