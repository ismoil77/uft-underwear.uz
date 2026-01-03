'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { categoriesAPI } from '@/lib/api';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function AdminCategoryEditPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: '',
    image: '',
    ru: { name: '', description: '' },
    en: { name: '', description: '' },
    uz: { name: '', description: '' },
    tj: { name: '', description: '' },
  });

  useEffect(() => {
    if (!isNew && id) {
      const numId = parseInt(id);
      if (!isNaN(numId)) {
        categoriesAPI.getById(numId).then((cat) => {
          if (cat) {
            setForm({
              slug: cat.slug || '',
              image: cat.image || '',
           ru: {
  name: cat.ru?.name || '',
  description: cat.ru?.description || ''
},
en: {
  name: cat.en?.name || '',
  description: cat.en?.description || ''
},
uz: {
  name: cat.uz?.name || '',
  description: cat.uz?.description || ''
},
tj: {
  name: cat.tj?.name || '',
  description: cat.tj?.description || ''
},
            });
          }
          setLoading(false);
        }).catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await categoriesAPI.create(form as any);
      } else {
        await categoriesAPI.update(parseInt(id), form);
      }
      router.push('/admin/categories');
    } catch (error) {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const updateLocale = (locale: string, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [locale]: { ...(prev[locale as keyof typeof prev] as any), [field]: value },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/categories" className="text-gray-500 hover:text-gray-700"><ChevronLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold">{isNew ? 'Новая категория' : 'Редактирование'}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Основное</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Изображение</label>
                <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Переводы</h2>
            {(['ru', 'en', 'uz', 'tj'] as const).map((locale) => (
              <div key={locale} className="border rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-3">{locale === 'ru' ? '🇷🇺 Русский' : locale === 'en' ? '🇬🇧 English' : locale === 'uz' ? "🇺🇿 O'zbek" : '🇹🇯 Тоҷикӣ'}</h3>
                <input type="text" required={locale === 'ru'} placeholder="Название" value={form[locale].name} onChange={(e) => updateLocale(locale, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-2" />
                <textarea placeholder="Описание" value={form[locale].description} onChange={(e) => updateLocale(locale, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={2} />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Сохранить
            </button>
            <Link href="/admin/categories" className="px-6 py-3 border rounded-lg hover:bg-gray-50">Отмена</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
