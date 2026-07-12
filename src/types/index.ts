export type Language = 'en' | 'pt';

export type TabId = 'home' | 'products' | 'about' | 'support';

export type PlatformId = 'pc' | 'ios' | 'android';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  previewImage: string;
  loading?: boolean;
  status?: 'available' | 'development';
}

export interface Platform {
  id: PlatformId;
  name: string;
  icon: string;
  available: boolean;
  products?: Product[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Translation {
  header: {
    login: string;
  };
  nav: {
    home: string;
    products: string;
    about: string;
    support: string;
  };
  home: {
    title: string;
    subtitle: string;
    cta: string;
    status: string;
    statusLabel: string;
  };
  products: {
    title: string;
    preview: string;
    buy: string;
    underMaintenance: string;
    monthly: string;
    previewTitle: string;
    close: string;
    development: string;
    comingSoon: string;
  };
  about: {
    title: string;
    description: string;
    users: string;
    uptime: string;
    faq: {
      title: string;
      items: FAQItem[];
    };
  };
  support: {
    title: string;
    description: string;
    join: string;
  };
  footer: {
    socials: string;
  };
}