export const siteConfig = {
  name: 'INTIMO',
  description: 'Магазин нижнего белья',
  url: 'https://intimo.ru',
  
  currency: {
    code: 'RUB',
    symbol: '₽',
    position: 'after' as const,
  },

  contacts: {
    phone: '+7 (999) 123-45-67',
    email: 'info@intimo.ru',
    address: 'г. Москва, ул. Примерная, д. 1',
    workHours: 'Пн-Вс: 10:00-22:00',
  },

  social: {
    instagram: 'https://instagram.com/intimo',
    telegram: 'https://t.me/intimo',
    whatsapp: 'https://wa.me/79991234567',
  },

  navigation: [
    { href: '/', label: 'nav.home' },
    { href: '/catalog', label: 'nav.catalog' },
    { href: '/collections', label: 'nav.collections' },
    { href: '/about', label: 'nav.about' },
    { href: '/contacts', label: 'nav.contacts' },
  ],
};
