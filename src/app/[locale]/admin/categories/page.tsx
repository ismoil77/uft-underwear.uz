'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { categoriesAPI } from '@/lib/api';
import { Category, getLocalized } from '@/types/api';
import { ChevronLeft, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number | undefined) {
    if (!id) return;
    if (!confirm('Удалить категорию?')) return;
    try {
      await categoriesAPI.delete(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      alert('Ошибка удаления');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700"><ChevronLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold">Категории</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <Link href="/admin/categories/new" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="w-5 h-5" /> Добавить
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Загрузка...</div>
          ) : categories.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Название</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Slug</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{cat.id}</td>
                    <td className="px-6 py-4">{getLocalized(cat, 'ru')?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/categories/${cat.id}`} className="p-2 hover:bg-blue-50 rounded-lg inline-block"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">Категорий нет</div>
          )}
        </div>
      </main>
    </div>
  );
}
