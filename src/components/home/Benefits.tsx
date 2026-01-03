'use client';

import { useTranslations } from 'next-intl';
import { Truck, Shield, Headphones, Sparkles } from 'lucide-react';

export function Benefits() {
  const t = useTranslations('home.benefits');

  const benefits = [
    {
      icon: Truck,
      title: t('delivery'),
      description: t('deliveryDesc'),
    },
    {
      icon: Shield,
      title: t('quality'),
      description: t('qualityDesc'),
    },
    {
      icon: Headphones,
      title: t('support'),
      description: t('supportDesc'),
    },
    {
      icon: Sparkles,
      title: 'Премиум качество',
      description: 'Только лучшие материалы',
    },
  ];

  return (
    <section className="section bg-surface">
      <div className="container">
        <h2 className="section-title text-center">{t('title')}</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-light rounded-full flex items-center justify-center">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-text mb-2">{benefit.title}</h3>
              <p className="text-sm text-text-muted">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
