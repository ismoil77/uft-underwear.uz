// ╔════════════════════════════════════════════════════════════════╗
// ║                    API TYPES                                   ║
// ║        Мультиязычная структура данных                          ║
// ╚════════════════════════════════════════════════════════════════╝

import { Locale } from '@/config/api.config';

// Локализованный контент
export interface LocalizedContent {
  name: string;
  description?: string;
}

// Категория
export interface Category {
  id: number;
  slug: string;
  image?: string;
  ru: LocalizedContent;
  en: LocalizedContent;
  uz: LocalizedContent;
  tj: LocalizedContent;
}

// Свойство товара
export interface Property {
  id: number;
  key: string;
  ru: { label: string };
  en: { label: string };
  uz: { label: string };
  tj: { label: string };
  type: 'text' | 'select' | 'multiselect' | 'boolean' | 'number';
  options?: string[];
}

// Товар
export interface Product {
  id: number;
  slug: string;
  categoryId: number;
  price: number;
  oldPrice?: number;
  images: string[];
  inStock: boolean;
  sku?: string;
  ru: LocalizedContent;
  en: LocalizedContent;
  uz: LocalizedContent;
  tj: LocalizedContent;
  properties?: Record<string, any>;
  createdAt?: string;
}

// Пользователь
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user';
}

// Заказ
export interface Order {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  comment?: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

// Хелпер для получения локализованного контента
export function getLocalized<T extends { ru: any; en: any; uz: any; tj: any }>(
  item: T,
  locale: Locale
): T[Locale] {
  return item[locale] || item.ru;
}
