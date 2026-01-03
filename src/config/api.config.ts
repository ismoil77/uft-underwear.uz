// ╔════════════════════════════════════════════════════════════════╗
// ║                    API & TELEGRAM CONFIG                       ║
// ╚════════════════════════════════════════════════════════════════╝

// API Mokky.dev
export const API_URL = 'https://dfe9a3e83bdc7f15.mokky.dev';

// Telegram Bot настройки
// Получить токен: @BotFather в Telegram
// Получить chat_id: @userinfobot или @getmyid_bot
export const TELEGRAM_CONFIG = {
  botToken: '', // Вставь токен бота
  chatId: '',   // Вставь chat_id куда слать заявки
  enabled: true,
};

// Поддерживаемые языки
export const LOCALES = ['ru', 'en', 'uz', 'tj'] as const;
export type Locale = typeof LOCALES[number];

// Дефолтный язык
export const DEFAULT_LOCALE: Locale = 'ru';
