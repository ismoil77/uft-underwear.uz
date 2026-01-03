# 🏗️ Universal Store Template

Универсальный шаблон магазина. **Один код — много сайтов**.

Меняешь конфиг → получаешь готовый сайт под любую нишу:
- 👕 Магазин одежды
- 🔧 Автозапчасти
- 🍕 Доставка еды
- 🏠 Недвижимость
- И любой другой бизнес

---

## 🚀 Быстрый старт

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск в режиме разработки
npm run dev

# 3. Открой http://localhost:3000
```

---

## ⚙️ Как настроить под клиента

### 1. Основные настройки сайта
Файл: `src/config/site.config.ts`

```typescript
export const siteConfig = {
  name: 'Название магазина',
  description: 'Описание',
  contacts: {
    phone: '+7 (999) 123-45-67',
    email: 'info@store.com',
    // ...
  },
  currency: {
    symbol: '₽',
    position: 'after', // 1000 ₽
  },
  // ...
};
```

### 2. Цвета и дизайн
Файл: `src/config/theme.config.ts`

```typescript
export const themeConfig = {
  colors: {
    primary: '#3B82F6',      // Главный цвет
    secondary: '#1E293B',    // Вторичный
    accent: '#F59E0B',       // Акцент
    // ...
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    // ...
  },
  // ...
};
```

### 3. Поля товаров
Файл: `src/config/product.config.ts`

```typescript
export const productConfig = {
  entityName: {
    singular: 'Товар',  // Или "Блюдо", "Объект", "Услуга"
    plural: 'Товары',
  },
  fields: [
    { key: 'size', label: 'Размер', type: 'select', options: ['S','M','L'] },
    { key: 'color', label: 'Цвет', type: 'color' },
    // Добавляй любые поля
  ],
  // ...
};
```

### 4. Функционал
Файл: `src/config/features.config.ts`

```typescript
export const featuresConfig = {
  cart: { enabled: true },
  wishlist: true,
  compare: false,
  reviews: true,
  // ...
};
```

---

## 📁 Готовые пресеты

В папке `src/config/templates/` есть готовые настройки:

- `clothes-store.ts` — Магазин одежды
- `auto-parts.ts` — Автозапчасти
- `food-delivery.ts` — Доставка еды

Просто скопируй нужный пресет в основные конфиги.

---

## 🌍 Мультиязычность

Поддерживаемые языки: 🇷🇺 Русский, 🇬🇧 English, 🇰🇿 Қазақша, 🇺🇿 O'zbek

### Добавить новый язык:

1. Создай файл `messages/XX.json` (где XX — код языка)
2. Добавь код в `src/i18n/routing.ts`:
```typescript
locales: ['ru', 'en', 'kk', 'uz', 'XX'],
```

---

## 📂 Структура проекта

```
├── src/
│   ├── app/[locale]/          # Страницы
│   ├── components/            # Компоненты
│   ├── config/                # ⭐ НАСТРОЙКИ
│   │   ├── site.config.ts     # Название, контакты
│   │   ├── theme.config.ts    # Цвета, шрифты
│   │   ├── product.config.ts  # Поля товаров
│   │   ├── features.config.ts # Функционал
│   │   └── templates/         # Готовые пресеты
│   ├── i18n/                  # Мультиязычность
│   ├── hooks/                 # Хуки
│   ├── store/                 # Состояние (Zustand)
│   └── types/                 # TypeScript типы
├── messages/                  # Переводы
│   ├── ru.json
│   ├── en.json
│   ├── kk.json
│   └── uz.json
└── public/                    # Статика
```

---

## 🛠 Технологии

- **Next.js 15** — фреймворк
- **TypeScript** — типизация
- **Tailwind CSS** — стили (с CSS переменными!)
- **next-intl** — мультиязычность
- **Zustand** — состояние
- **Lucide React** — иконки

---

## 🎨 Кастомизация темы

Все цвета, шрифты, отступы задаются через CSS переменные в `src/app/globals.css`.

Tailwind настроен читать эти переменные, поэтому:
- Меняешь `theme.config.ts`
- Обновляешь `:root` в `globals.css`
- Весь сайт меняет цвета!

---

## 📦 Деплой

```bash
# Сборка
npm run build

# Старт продакшн
npm start
```

Рекомендуем: **Vercel** (бесплатно для небольших проектов)

---

## 📝 Чеклист нового проекта

- [ ] Название и описание сайта
- [ ] Логотип и favicon
- [ ] Контакты (телефон, email, адрес)
- [ ] Цветовая схема
- [ ] Поля товаров под нишу
- [ ] Включить/выключить фичи
- [ ] Добавить товары
- [ ] Настроить переводы
- [ ] Деплой

---

## 💡 Советы

1. **Начинай с пресета** — выбери ближайший по нише и адаптируй
2. **Цвета меняй первыми** — сразу видно результат
3. **Поля товаров** — настрой под конкретный бизнес клиента
4. **Переводы** — можно начать с одного языка

---

## 📞 Поддержка

Вопросы? Создай Issue или напиши мне.

---

Made with ❤️ for freelancers and agencies
