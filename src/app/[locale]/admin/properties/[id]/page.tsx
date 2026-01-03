'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { propertiesAPI } from '@/lib/api';
import { ChevronLeft, Save, Loader2, Plus, X } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function AdminPropertyEditPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    key: '',
    type: 'text' as 'text' | 'select' | 'multiselect' | 'boolean' | 'number',
    options: [''],
    ru: { label: '' },
    en: { label: '' },
    uz: { label: '' },
    tj: { label: '' },
  });

  useEffect(() => {
    if (!isNew) {
      propertiesAPI.getAll().then((props) => {
        const prop = props.find((p) => p.id === parseInt(id));
        if (prop) {
          setForm({
            key: prop.key || '',
            type: prop.type || 'text',
            options: prop.options?.length ? prop.options : [''],
            ru: prop.ru || { label: '' },
            en: prop.en || { label: '' },
            uz: prop.uz || { label: '' },
            tj: prop.tj || { label: '' },
          });
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...form,
        options: form.type === 'select' || form.type === 'multiselect'
          ? form.options.filter((o) => o.trim() !== '')
          : undefined,
      };

      if (isNew) {
        await propertiesAPI.create(data as any);
      } else {
        await propertiesAPI.update(parseInt(id), data);
      }
      router.push('/admin/properties');
    } catch (error) {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/properties" className="text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Новое свойство' : 'Редактирование свойства'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Основное</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ключ *</label>
                <input
                  type="text"
                  required
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="size, color, material..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Текст</option>
                  <option value="number">Число</option>
                  <option value="select">Выбор (один)</option>
                  <option value="multiselect">Множ. выбор</option>
                  <option value="boolean">Да/Нет</option>
                </select>
              </div>
            </div>

            {(form.type === 'select' || form.type === 'multiselect') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Опции</label>
                <div className="space-y-2">
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...form.options];
                          newOpts[i] = e.target.value;
                          setForm({ ...form, options: newOpts });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Значение"
                      />
                      {form.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, options: form.options.filter((_, j) => j !== i) })}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, options: [...form.options, ''] })}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Добавить опцию
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Названия на разных языках</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['ru', 'en', 'uz', 'tj'] as const).map((locale) => (
                <div key={locale}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'ru' ? '🇷🇺 Русский *' :
                     locale === 'en' ? '🇬🇧 English' :
                     locale === 'uz' ? "🇺🇿 O'zbek" : '🇹🇯 Тоҷикӣ'}
                  </label>
                  <input
                    type="text"
                    required={locale === 'ru'}
                    value={form[locale].label}
                    onChange={(e) => setForm({ ...form, [locale]: { label: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={locale === 'ru' ? 'Размер' : locale === 'en' ? 'Size' : ''}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <Link href="/admin/properties" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              Отмена
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
