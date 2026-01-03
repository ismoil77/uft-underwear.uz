'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Product, Category } from '@/types/api';
import { LOCALES } from '@/config/api.config';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function AdminProductEditPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    slug: '',
    categoryId: 0,
    price: 0,
    oldPrice: 0,
    images: [''],
    inStock: true,
    sku: '',
    ru: { name: '', description: '' },
    en: { name: '', description: '' },
    uz: { name: '', description: '' },
    tj: { name: '', description: '' },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const cats = await categoriesAPI.getAll();
        setCategories(cats);

        if (!isNew) {
          const product = await productsAPI.getById(parseInt(id));
          if (product) {
            setForm({
              slug: product.slug || '',
              categoryId: product.categoryId || 0,
              price: product.price || 0,
              oldPrice: product.oldPrice || 0,
              images: product.images?.length ? product.images : [''],
              inStock: product.inStock ?? true,
              sku: product.sku || '',
             ru: {
  name: product.ru?.name || '',
  description: product.ru?.description || ''
},
en: {
  name: product.en?.name || '',
  description: product.en?.description || ''
},
uz: {
  name: product.uz?.name || '',
  description: product.uz?.description || ''
},
tj: {
  name: product.tj?.name || '',
  description: product.tj?.description || ''
},
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...form,
        images: form.images.filter((img) => img.trim() !== ''),
      };

      if (isNew) {
        await productsAPI.create(data as Omit<Product, 'id'>);
      } else {
        await productsAPI.update(parseInt(id), data);
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Save error:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const updateLocale = (locale: string, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [locale]: { ...prev[locale as keyof typeof prev] as any, [field]: value },
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Новый товар' : 'Редактирование товара'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Основная информация</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="product-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.ru?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Старая цена
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.oldPrice}
                  onChange={(e) => setForm({ ...form, oldPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Артикул (SKU)
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                  В наличии
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Изображения</h2>
            <div className="space-y-3">
              {form.images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => {
                      const newImages = [...form.images];
                      newImages[index] = e.target.value;
                      setForm({ ...form, images: newImages });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({
                          ...form,
                          images: form.images.filter((_, i) => i !== index),
                        });
                      }}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Удалить
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm({ ...form, images: [...form.images, ''] })}
                className="text-sm text-blue-600 hover:underline"
              >
                + Добавить изображение
              </button>
            </div>
          </div>

          {/* Localized Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Мультиязычный контент</h2>

            <div className="space-y-6">
              {(['ru', 'en', 'uz', 'tj'] as const).map((locale) => (
                <div key={locale} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-3 text-gray-700">
                    {locale === 'ru' ? '🇷🇺 Русский' :
                     locale === 'en' ? '🇬🇧 English' :
                     locale === 'uz' ? "🇺🇿 O'zbek" :
                     '🇹🇯 Тоҷикӣ'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Название {locale === 'ru' && '*'}
                      </label>
                      <input
                        type="text"
                        required={locale === 'ru'}
                        value={form[locale].name}
                        onChange={(e) => updateLocale(locale, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Описание
                      </label>
                      <textarea
                        value={form[locale].description}
                        onChange={(e) => updateLocale(locale, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Отмена
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
