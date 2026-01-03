'use client';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p className="text-text-muted">{t('description')}</p>
      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <div className="bg-surface p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Наша миссия</h2>
          <p>Создавать качественное нижнее бельё, которое подчёркивает красоту каждой женщины.</p>
        </div>
        <div className="bg-surface p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Наши ценности</h2>
          <p>Качество, комфорт и элегантность в каждом изделии.</p>
        </div>
      </div>
    </div>
  );
}
