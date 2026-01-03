import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Link } from '@/i18n/navigation';
import { featuresConfig, siteConfig } from '@/config';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { Benefits } from '@/components/home/Benefits';

type Props = {
  params: Promise<{ locale: string }>;
};

export default function HomePage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);
  
  const t = useTranslations('home');
  const { homepage } = featuresConfig;

  return (
    <div>
      {/* Hero Banner */}
      {homepage.heroBanner && <HeroBanner />}

      {/* Категории */}
      {homepage.categories && <Categories />}

      {/* Популярные товары */}
      {homepage.featuredProducts && <FeaturedProducts />}

      {/* Преимущества */}
      {homepage.benefits && <Benefits />}
    </div>
  );
}
