'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { productsAPI, categoriesAPI, ordersAPI, propertiesAPI } from '@/lib/api';
import { Order } from '@/types/api';
import { useAuthStore } from '@/store/authStore';
import {
  Package,
  FolderOpen,
  ShoppingCart,
  Settings,
  Plus,
  LogOut,
  User,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    properties: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [mounted, user, router]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  async function fetchStats() {
    try {
      const [products, categories, orders, properties] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        ordersAPI.getAll(),
        propertiesAPI.getAll(),
      ]);

      setStats({
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        properties: properties.length,
      });

      setRecentOrders(orders.slice(-5).reverse());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const menuItems = [
    { title: 'Товары', href: '/admin/products', icon: Package, count: stats.products, color: 'bg-blue-500' },
    { title: 'Категории', href: '/admin/categories', icon: FolderOpen, count: stats.categories, color: 'bg-green-500' },
    { title: 'Заказы', href: '/admin/orders', icon: ShoppingCart, count: stats.orders, color: 'bg-purple-500' },
    { title: 'Свойства', href: '/admin/properties', icon: Settings, count: stats.properties, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user.name}</span>
              {user.role === 'admin' && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">admin</span>
              )}
            </div>
            <Link href="/" className="text-sm text-blue-600 hover:underline">На сайт</Link>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-600 hover:underline">
              <LogOut className="w-4 h-4" /> Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${item.color} p-3 rounded-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{loading ? '...' : item.count}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Добавить товар
            </Link>
            <Link href="/admin/categories/new" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Plus className="w-4 h-4" /> Добавить категорию
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Последние заказы</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">Все заказы →</Link>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-lg" />)}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">#{order.id} — {order.name}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.total?.toLocaleString()} ₽</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                    }`}>
                      {order.status === 'new' ? 'Новый' : order.status === 'completed' ? 'Выполнен' : order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Заказов пока нет</p>
          )}
        </div>
      </main>
    </div>
  );
}
