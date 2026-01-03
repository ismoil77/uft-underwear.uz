'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const collections = [
  { id: 1, name: 'Весна-Лето 2025', image: 'https://images.unsplash.com/photo-1617331140180-e8262094733a?w=600', slug: 'spring-summer-2025' },
  { id: 2, name: 'Осень-Зима 2024', image: 'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=600', slug: 'autumn-winter-2024' },
  { id: 3, name: 'Базовая коллекция', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600', slug: 'basic' },
];

export default function CollectionsPage() {
  const t = useTranslations('collections');
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {collections.map((col) => (
          <Link key={col.id} href={`/catalog?collection=${col.slug}`} className="group">
            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4">
              <img src={col.image} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold group-hover:text-primary">{col.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
