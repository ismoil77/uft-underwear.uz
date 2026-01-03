export const siteConfig = {
  name: 'Uft Underwear',
  description: 'Магазин нижнего белья',
  url: 'https://intimo.ru',
  
  currency: {
    code: 'UZS',
    symbol: 'UZS',
    position: 'after' as const,
  },

  contacts: {
    phone: '+998 33 170 66 22',
    email: 'info@KOBIL.uz',
    address: 'г. Urgut, ул. urgut, д. 1',
    workHours: 'Пн-Вс: 10:00-22:00',
  },

  social: {
    instagram: 'https://instagram.com/uft.underwear',
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
