import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Данные каталога (заглушка - позже будет из БД)
const categories = [
  { id: 'electronics', name: '📱 Электроника', emoji: '📱' },
  { id: 'equipment', name: '🏭 Оборудование', emoji: '🏭' },
  { id: 'clothing', name: '👕 Одежда', emoji: '👕' },
  { id: 'accessories', name: '💍 Аксессуары', emoji: '💍' },
  { id: 'home', name: '🏠 Товары для дома', emoji: '🏠' },
  { id: 'auto', name: '🚗 Автотовары', emoji: '🚗' },
];

// Хранилище пользователей (временное)
const users = new Map();

// Middleware для регистрации пользователя
bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (userId && !users.has(userId)) {
    users.set(userId, {
      id: userId,
      username: ctx.from.username,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
      registeredAt: new Date(),
      orders: [],
    });
  }
  return next();
});

// /start - Приветствие
bot.command('start', async (ctx) => {
  const firstName = ctx.from.first_name || 'друг';
  
  await ctx.replyWithPhoto(
    { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800' },
    {
      caption: `🎉 *Добро пожаловать в VR Showroom, ${firstName}!*\n\n` +
        `Мы помогаем находить и заказывать товары напрямую с китайских фабрик.\n\n` +
        `🔍 Поиск поставщиков\n` +
        `📦 Отслеживание заказов\n` +
        `💬 Чат с фабриками (с переводом)\n` +
        `🤖 AI-рекомендации\n\n` +
        `Выберите действие:`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🛍 Открыть каталог', process.env.MINI_APP_URL || 'https://vr-showroom.vercel.app')],
        [Markup.button.callback('📂 Категории', 'categories')],
        [Markup.button.callback('🔍 Поиск товара', 'search')],
        [Markup.button.callback('📦 Мои заказы', 'my_orders')],
        [Markup.button.callback('❓ Помощь', 'help')],
      ])
    }
  );
});

// /catalog - Каталог
bot.command('catalog', async (ctx) => {
  await ctx.reply(
    '📂 *Каталог товаров*\n\nВыберите категорию:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        ...categories.map(cat => [Markup.button.callback(cat.name, `cat_${cat.id}`)]),
        [Markup.button.webApp('🛍 Полный каталог', process.env.MINI_APP_URL || 'https://vr-showroom.vercel.app')],
      ])
    }
  );
});

// /search - Поиск
bot.command('search', async (ctx) => {
  const query = ctx.message.text.replace('/search', '').trim();
  
  if (!query) {
    await ctx.reply(
      '🔍 *Поиск товаров*\n\n' +
      'Введите название товара или категорию:\n' +
      '`/search iPhone чехлы`\n' +
      '`/search станок ЧПУ`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  await ctx.reply(
    `🔍 Ищем: *${query}*\n\n` +
    `Найдено результатов: 24\n\n` +
    `Для детального просмотра откройте каталог:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp(`🛍 Смотреть "${query}"`, `${process.env.MINI_APP_URL || 'https://vr-showroom.vercel.app'}?search=${encodeURIComponent(query)}`)],
      ])
    }
  );
});

// /order - Заказы
bot.command('order', async (ctx) => {
  await ctx.reply(
    '📦 *Оформление заказа*\n\n' +
    'Для оформления заказа:\n' +
    '1. Откройте каталог\n' +
    '2. Добавьте товары в корзину\n' +
    '3. Перейдите к оформлению\n\n' +
    'Или отправьте ссылку на товар с Alibaba/1688:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🛒 Открыть корзину', `${process.env.MINI_APP_URL || 'https://vr-showroom.vercel.app'}/cart`)],
        [Markup.button.callback('📋 История заказов', 'my_orders')],
      ])
    }
  );
});

// /track - Отслеживание
bot.command('track', async (ctx) => {
  const trackNumber = ctx.message.text.replace('/track', '').trim();
  
  if (!trackNumber) {
    await ctx.reply(
      '📦 *Отслеживание посылки*\n\n' +
      'Введите трек-номер:\n' +
      '`/track SF1234567890`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  // Заглушка для отслеживания
  await ctx.reply(
    `📦 *Посылка: ${trackNumber}*\n\n` +
    `📍 Статус: В пути\n` +
    `🏭 Отправлено: Шэньчжэнь, Китай\n` +
    `🎯 Назначение: Москва, Россия\n` +
    `📅 Ожидаемая доставка: 7-14 дней\n\n` +
    `_Последнее обновление: сегодня, 10:30_`,
    { parse_mode: 'Markdown' }
  );
});

// /help - Помощь
bot.command('help', async (ctx) => {
  await ctx.reply(
    '❓ *Помощь по VR Showroom*\n\n' +
    '*Команды:*\n' +
    '/start - Главное меню\n' +
    '/catalog - Каталог товаров\n' +
    '/search [запрос] - Поиск товаров\n' +
    '/order - Оформление заказа\n' +
    '/track [номер] - Отслеживание посылки\n' +
    '/help - Эта справка\n\n' +
    '*Как заказать:*\n' +
    '1. Найдите товар в каталоге\n' +
    '2. Добавьте в корзину\n' +
    '3. Оформите заказ\n' +
    '4. Оплатите удобным способом\n' +
    '5. Отслеживайте доставку\n\n' +
    '*Поддержка:*\n' +
    '📧 support@vrshowroom.ru\n' +
    '💬 @vrshowroom_support',
    { parse_mode: 'Markdown' }
  );
});

// Callback: Категории
bot.action('categories', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageCaption(
    '📂 *Выберите категорию:*',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        ...categories.map(cat => [Markup.button.callback(cat.name, `cat_${cat.id}`)]),
        [Markup.button.callback('◀️ Назад', 'back_to_main')],
      ])
    }
  );
});

// Callback: Выбор категории
categories.forEach(cat => {
  bot.action(`cat_${cat.id}`, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `${cat.emoji} *${cat.name.replace(cat.emoji, '').trim()}*\n\n` +
      `Найдено товаров: 156\n` +
      `Поставщиков: 23\n\n` +
      `Откройте каталог для просмотра:`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🛍 Смотреть товары', `${process.env.MINI_APP_URL || 'https://vr-showroom.vercel.app'}/catalog/${cat.id}`)],
        ])
      }
    );
  });
});

// Callback: Поиск
bot.action('search', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    '🔍 *Поиск товаров*\n\n' +
    'Введите название товара:\n' +
    '`/search ваш запрос`\n\n' +
    'Примеры:\n' +
    '• `/search iPhone чехлы`\n' +
    '• `/search LED лампы`\n' +
    '• `/search станок лазерный`',
    { parse_mode: 'Markdown' }
  );
});

// Callback: Мои заказы
bot.action('my_orders', async (ctx) => {
  await ctx.answerCbQuery();
  const user = users.get(ctx.from.id);
  
  if (!user?.orders?.length) {
    await ctx.reply(
      '📦 *Мои заказы*\n\n' +
      'У вас пока нет заказов.\n\n' +
      'Начните с просмотра каталога!',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🛍 Открыть каталог', process.env.MINI_APP_URL || 'https://vr-showroom.vercel.app')],
        ])
      }
    );
    return;
  }
  
  // Показать заказы
  const ordersList = user.orders.map((o, i) => 
    `${i + 1}. #${o.id} - ${o.status} - ${o.total}¥`
  ).join('\n');
  
  await ctx.reply(
    `📦 *Мои заказы*\n\n${ordersList}`,
    { parse_mode: 'Markdown' }
  );
});

// Callback: Помощь
bot.action('help', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    '❓ *Помощь*\n\n' +
    'Используйте /help для полной справки',
    { parse_mode: 'Markdown' }
  );
});

// Callback: Назад в главное меню
bot.action('back_to_main', async (ctx) => {
  await ctx.answerCbQuery();
  const firstName = ctx.from.first_name || 'друг';
  
  await ctx.editMessageCaption(
    `🎉 *Добро пожаловать в VR Showroom, ${firstName}!*\n\n` +
    `Мы помогаем находить и заказывать товары напрямую с китайских фабрик.\n\n` +
    `Выберите действие:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🛍 Открыть каталог', process.env.MINI_APP_URL || 'https://vr-showroom.vercel.app')],
        [Markup.button.callback('📂 Категории', 'categories')],
        [Markup.button.callback('🔍 Поиск товара', 'search')],
        [Markup.button.callback('📦 Мои заказы', 'my_orders')],
        [Markup.button.callback('❓ Помощь', 'help')],
      ])
    }
  );
});

// Обработка ссылок на товары (Alibaba, 1688)
bot.hears(/https?:\/\/(www\.)?(alibaba|1688)\.com\/\S+/, async (ctx) => {
  const url = ctx.match[0];
  
  await ctx.reply(
    `🔗 *Обнаружена ссылка на товар*\n\n` +
    `Анализируем: ${url}\n\n` +
    `⏳ Получаем информацию о товаре...`,
    { parse_mode: 'Markdown' }
  );
  
  // Имитация загрузки
  setTimeout(async () => {
    await ctx.reply(
      `✅ *Товар найден!*\n\n` +
      `📦 Название: LED светильник промышленный\n` +
      `💰 Цена: от 45¥ (≈580₽)\n` +
      `📍 Фабрика: Shenzhen Light Co.\n` +
      `⭐ Рейтинг: 4.8/5\n` +
      `📦 MOQ: 100 шт\n\n` +
      `Хотите запросить коммерческое предложение?`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📝 Запросить КП', 'request_quote')],
          [Markup.button.callback('💬 Чат с фабрикой', 'chat_factory')],
          [Markup.button.callback('🛒 В корзину', 'add_to_cart')],
        ])
      }
    );
  }, 2000);
});

// Callback: Запрос КП
bot.action('request_quote', async (ctx) => {
  await ctx.answerCbQuery('Запрос отправлен!');
  await ctx.reply(
    '📝 *Запрос коммерческого предложения*\n\n' +
    'Укажите детали заказа:\n' +
    '• Количество (шт)\n' +
    '• Требования к упаковке\n' +
    '• Сроки поставки\n\n' +
    '_Ответ фабрики обычно приходит в течение 24 часов_',
    { parse_mode: 'Markdown' }
  );
});

// Callback: Чат с фабрикой
bot.action('chat_factory', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    '💬 *Чат с фабрикой*\n\n' +
    'Напишите сообщение на русском языке.\n' +
    'Мы автоматически переведём его на китайский.\n\n' +
    '_Начните сообщение с_ `/msg`',
    { parse_mode: 'Markdown' }
  );
});

// Callback: В корзину
bot.action('add_to_cart', async (ctx) => {
  await ctx.answerCbQuery('Добавлено в корзину! 🛒');
  await ctx.reply(
    '🛒 *Товар добавлен в корзину!*\n\n' +
    'Перейдите в корзину для оформления:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🛒 Открыть корзину', `${process.env.MINI_APP_URL || 'https://vr-showroom.vercel.app'}/cart`)],
        [Markup.button.callback('🛍 Продолжить покупки', 'categories')],
      ])
    }
  );
});

// Обработка данных из Mini App
bot.on('web_app_data', async (ctx) => {
  try {
    const data = JSON.parse(ctx.webAppData.data);
    
    if (data.action === 'order') {
      await ctx.reply(
        `✅ *Заказ #${data.orderId} оформлен!*\n\n` +
        `Сумма: ${data.total}¥\n` +
        `Товаров: ${data.items}\n\n` +
        `Ожидайте подтверждения от менеджера.`,
        { parse_mode: 'Markdown' }
      );
    }
  } catch (e) {
    console.error('WebApp data error:', e);
  }
});

// Запуск бота
bot.launch().then(() => {
  console.log('🤖 VR Showroom Bot запущен!');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
