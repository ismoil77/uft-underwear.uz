'use client';
import { useTranslations } from 'next-intl';

const team = [
  { id: 1, name: 'Анна Иванова', role: 'Основатель', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
  { id: 2, name: 'Мария Петрова', role: 'Дизайнер', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300' },
  { id: 3, name: 'Елена Сидорова', role: 'Маркетолог', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300' },
];

export default function TeamPage() {
  const t = useTranslations('team');
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {team.map((member) => (
          <div key={member.id} className="text-center">
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-text-muted">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
