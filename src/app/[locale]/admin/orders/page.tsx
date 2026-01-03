'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { ordersAPI } from '@/lib/api';
import { Order } from '@/types/api';
import { ChevronLeft, Eye, Trash2, X } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const data = await ordersAPI.getAll();
      setOrders(data.reverse());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: Order['status']) {
    try {
      await ordersAPI.updateStatus(id, status);
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (error) {
      alert('Ошибка');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить?')) return;
    try {
      await ordersAPI.delete(id);
      setOrders(orders.filter((o) => o.id !== id));
    } catch (error) {
      alert('Ошибка');
    }
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700"><ChevronLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold">Заказы</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Загрузка...</div>
          ) : orders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">№</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Клиент</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Сумма</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Статус</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div>{order.name}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{order.total?.toLocaleString()} ₽</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id!, e.target.value as Order['status'])}
                        className={`px-2 py-1 text-sm rounded-full ${statusColors[order.status]}`}
                      >
                        <option value="new">Новый</option>
                        <option value="processing">В работе</option>
                        <option value="completed">Выполнен</option>
                        <option value="cancelled">Отменён</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(order.id!)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">Заказов нет</div>
          )}
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Заказ #{selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <p><span className="text-gray-500">Клиент:</span> {selectedOrder.name}</p>
                <p><span className="text-gray-500">Телефон:</span> {selectedOrder.phone}</p>
                {selectedOrder.address && <p><span className="text-gray-500">Адрес:</span> {selectedOrder.address}</p>}
                {selectedOrder.comment && <p><span className="text-gray-500">Комментарий:</span> {selectedOrder.comment}</p>}
                <div className="border-t pt-3">
                  <p className="text-gray-500 mb-2">Товары:</p>
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between py-1">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Итого:</span>
                  <span>{selectedOrder.total?.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
