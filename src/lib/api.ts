// ╔════════════════════════════════════════════════════════════════╗
// ║                    API CLIENT                                  ║
// ║        Работа с Mokky.dev API                                  ║
// ╚════════════════════════════════════════════════════════════════╝

import { API_URL } from '@/config/api.config';
import { Category, Product, Property, Order, User } from '@/types/api';

// ===== БАЗОВЫЕ МЕТОДЫ =====

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ===== КАТЕГОРИИ =====

export const categoriesAPI = {
  getAll: () => fetchAPI<Category[]>('/category'),
  
  getById: (id: number) => fetchAPI<Category>(`/category/${id}`),
  
  create: (data: Omit<Category, 'id'>) =>
    fetchAPI<Category>('/category', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<Category>) =>
    fetchAPI<Category>(`/category/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    fetchAPI<void>(`/category/${id}`, { method: 'DELETE' }),
};

// ===== ТОВАРЫ =====

export const productsAPI = {
  getAll: (params?: { categoryId?: number; limit?: number }) => {
    let url = '/products';
    const searchParams = new URLSearchParams();
    
    if (params?.categoryId) {
      searchParams.append('categoryId', params.categoryId.toString());
    }
    if (params?.limit) {
      searchParams.append('_limit', params.limit.toString());
    }
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
    
    return fetchAPI<Product[]>(url);
  },
  
  getById: (id: number) => fetchAPI<Product>(`/products/${id}`),
  
  getBySlug: async (slug: string) => {
    const products = await fetchAPI<Product[]>(`/products?slug=${slug}`);
    return products[0] || null;
  },
  
  search: (query: string) =>
    fetchAPI<Product[]>(`/products?ru.name=*${query}*`),
  
  create: (data: Omit<Product, 'id'>) =>
    fetchAPI<Product>('/products', {
      method: 'POST',
      body: JSON.stringify({ ...data, createdAt: new Date().toISOString() }),
    }),
  
  update: (id: number, data: Partial<Product>) =>
    fetchAPI<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    fetchAPI<void>(`/products/${id}`, { method: 'DELETE' }),
};

// ===== СВОЙСТВА ТОВАРОВ =====

export const propertiesAPI = {
  getAll: () => fetchAPI<Property[]>('/property'),
  
  create: (data: Omit<Property, 'id'>) =>
    fetchAPI<Property>('/property', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<Property>) =>
    fetchAPI<Property>(`/property/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    fetchAPI<void>(`/property/${id}`, { method: 'DELETE' }),
};

// ===== ЗАКАЗЫ =====

export const ordersAPI = {
  getAll: () => fetchAPI<Order[]>('/orders'),
  
  getById: (id: number) => fetchAPI<Order>(`/orders/${id}`),
  
  create: (data: Omit<Order, 'id'>) =>
    fetchAPI<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({ ...data, createdAt: new Date().toISOString() }),
    }),
  
  updateStatus: (id: number, status: Order['status']) =>
    fetchAPI<Order>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  delete: (id: number) =>
    fetchAPI<void>(`/orders/${id}`, { method: 'DELETE' }),
};

// ===== ПОЛЬЗОВАТЕЛИ =====

export const usersAPI = {
  getAll: () => fetchAPI<User[]>('/users'),
  
  getById: (id: number) => fetchAPI<User>(`/users/${id}`),
  
  create: (data: Omit<User, 'id'>) =>
    fetchAPI<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ===== TELEGRAM =====

export async function sendToTelegram(order: Order): Promise<boolean> {
  try {
    const res = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return res.ok;
  } catch (error) {
    console.error('Telegram send error:', error);
    return false;
  }
}
