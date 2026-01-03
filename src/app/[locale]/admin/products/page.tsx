'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Product, Category, getLocalized } from '@/types/api';
import { ChevronLeft, Plus, Edit, Trash2, Search } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [prods, cats] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number | undefined) {
    if (!id) return;
    if (!confirm('Удалить товар?')) return;
    try {
      await productsAPI.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Ошибка удаления');
    }
  }

  const filtered = products.filter((p) => {
    const loc = getLocalized(p, 'ru');
    const matchSearch = !search || loc?.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || p.categoryId === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700"><ChevronLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold">Товары</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{getLocalized(cat, 'ru')?.name || cat.slug}</option>
            ))}
          </select>
          <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" /> Добавить
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Загрузка...</div>
          ) : filtered.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Фото</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Название</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Цена</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Статус</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((product) => {
                  const loc = getLocalized(product, 'ru');
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Нет</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{loc?.name || product.slug}</td>
                      <td className="px-6 py-4 font-semibold">{product.price?.toLocaleString()} ₽</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.inStock ? 'В наличии' : 'Нет'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/products/${product.id}`} className="p-2 hover:bg-blue-50 rounded-lg inline-block"><Edit className="w-4 h-4" /></Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">Товаров нет</div>
          )}
        </div>
      </main>
    </div>
  );
}
