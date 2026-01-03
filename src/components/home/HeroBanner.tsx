'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative bg-gradient-to-br from-[#FBF9F9] via-[#FAF0F0] to-[#F5E6E6] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Pattern overlay */}
      {/* Pattern overlay */}
<div className="absolute inset-0 opacity-20"> {/* Увеличил до 20%, чтобы было заметно */}
  <div className="w-full h-full" style={{
    backgroundImage: `url("https://thumbs.dreamstime.com/b/%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%B0-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0-%D0%BD%D0%B8%D0%B6%D0%BD%D0%B5%D0%B3%D0%BE-%D0%B1%D0%B5%D0%BB%D1%8C%D1%8F-%D0%B6%D0%B5%D0%BD%D1%89%D0%B8%D0%BD%D1%8B-%D0%B8%D0%BB%D0%B8-%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD-%D0%BF%D0%BB%D0%B0%D0%BA%D0%B0%D1%82%D0%B0-193199129.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }} />
</div>

      <div className="container relative">
        <div className="py-24 md:py-32 lg:py-40 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-secondary mb-6 leading-tight">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-text-muted mb-10 leading-relaxed">
            {t('subtitle')}
          </p>
          <Link
            href="/catalog"
            className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg bg-secondary text-white hover:bg-secondary-hover"
          >
            {t('cta')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
