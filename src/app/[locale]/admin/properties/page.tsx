'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types/api';
import { ChevronLeft, Plus, Edit, Trash2, X, Save } from 'lucide-react';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    key: '',
    type: 'text' as Property['type'],
    options: '',
    ru: { label: '' },
    en: { label: '' },
    uz: { label: '' },
    tj: { label: '' },
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const data = await propertiesAPI.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(property?: Property) {
    if (property) {
      setEditingId(property.id);
      setForm({
        key: property.key,
        type: property.type,
        options: property.options?.join(', ') || '',
        ru: property.ru || { label: '' },
        en: property.en || { label: '' },
        uz: property.uz || { label: '' },
        tj: property.tj || { label: '' },
      });
    } else {
      setEditingId(null);
      setForm({
        key: '',
        type: 'text',
        options: '',
        ru: { label: '' },
        en: { label: '' },
        uz: { label: '' },
        tj: { label: '' },
      });
    }
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data: any = {
        key: form.key,
        type: form.type,
        ru: form.ru,
        en: form.en,
        uz: form.uz,
        tj: form.tj,
      };
      if (form.options) {
        data.options = form.options.split(',').map((o) => o.trim());
      }

      if (editingId) {
        await propertiesAPI.update(editingId, data);
      } else {
        await propertiesAPI.create(data);
      }
      fetchProperties();
      setShowModal(false);
    } catch (error) {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить?')) return;
    try {
      await propertiesAPI.delete(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (error) {
      alert('Ошибка');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700"><ChevronLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold">Свойства товаров</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <Plus className="w-5 h-5" /> Добавить свойство
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Загрузка...</div>
          ) : properties.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Ключ</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Название (RU)</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Тип</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm">{prop.key}</td>
                    <td className="px-6 py-4">{prop.ru?.label || '—'}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{prop.type}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(prop)} className="p-2 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(prop.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">Свойств нет</div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">{editingId ? 'Редактировать' : 'Новое свойство'}</h2>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ключ (key) *</label>
                  <input
                    type="text"
                    value={form.key}
                    onChange={(e) => setForm({ ...form, key: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="size, color, material..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Тип</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as Property['type'] })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="text">Текст</option>
                    <option value="number">Число</option>
                    <option value="select">Выбор</option>
                    <option value="multiselect">Множественный выбор</option>
                    <option value="boolean">Да/Нет</option>
                  </select>
                </div>

                {(form.type === 'select' || form.type === 'multiselect') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Варианты (через запятую)</label>
                    <input
                      type="text"
                      value={form.options}
                      onChange={(e) => setForm({ ...form, options: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="XS, S, M, L, XL"
                    />
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Названия на разных языках</p>
                  {(['ru', 'en', 'uz', 'tj'] as const).map((locale) => (
                    <div key={locale} className="flex items-center gap-2 mb-2">
                      <span className="w-8 text-sm">{locale.toUpperCase()}</span>
                      <input
                        type="text"
                        value={form[locale].label}
                        onChange={(e) => setForm({ ...form, [locale]: { label: e.target.value } })}
                        className="flex-1 px-3 py-2 border rounded-lg"
                        placeholder={locale === 'ru' ? 'Размер' : 'Size'}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving || !form.key}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Отмена</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
