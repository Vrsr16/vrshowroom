import { Telegraf, Markup } from 'telegraf';
import type { Context } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL || 'http://localhost:5173';

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в .env файле');
  console.error('Создайте .env файл с BOT_TOKEN=your_token_here');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Категории товаров
const categories = [
  { id: 'electronics', name: '📱 Электроника', callback: 'cat_electronics' },
  { id: 'equipment', name: '🏭 Оборудование', callback: 'cat_equipment' },
  { id: 'textiles', name: '👕 Текстиль', callback: 'cat_textiles' },
  { id: 'accessories', name: '⌚ Аксессуары', callback: 'cat_accessories' },
  { id: 'auto', name: '🚗 Автозапчасти', callback: 'cat_auto' },
];

// Главное меню с кнопками
const getMainMenu = () => {
  return Markup.inlineKeyboard([
    [Markup.button.webApp('🛍 Открыть приложение', MINI_APP_URL)],
    [
      Markup.button.callback('🔍 Поиск', 'action_search'),
      Markup.button.callback('📦 Заказы', 'action_orders'),
    ],
    [
      Markup.button.callback('📂 Категории', 'action_categories'),
      Markup.button.callback('❓ Помощь', 'action_help'),
    ],
  ]);
};

// Меню категорий
const getCategoriesMenu = () => {
  return Markup.inlineKeyboard([
    ...categories.map(cat => [Markup.button.callback(cat.name, cat.callback)]),
    [Markup.button.callback('◀️ Назад', 'action_back')],
  ]);
};

// /start - Приветствие
bot.command('start', async (ctx: Context) => {
  const firstName = ctx.from?.first_name || 'друг';
  
  const welcomeMessage = `
🎉 *Добро пожаловать в VR Showroom, ${firstName}!*

Мы помогаем заказывать товары и оборудование напрямую с китайских фабрик.

🔍 *Что мы предлагаем:*
• Прямые поставки с фабрик Китая
• Электроника, оборудование, текстиль
• Отслеживание заказов в реальном времени
• Поддержка на русском языке

👇 *Нажмите кнопку ниже, чтобы открыть каталог:*
`;

  await ctx.replyWithMarkdown(welcomeMessage, getMainMenu());
});

// /search - Поиск товаров
bot.command('search', async (ctx: Context) => {
  const searchMessage = `
🔍 *Поиск товаров*

Вы можете искать товары двумя способами:

1️⃣ *В приложении* — откройте Mini App и используйте строку поиска

2️⃣ *Здесь в боте* — напишите название товара, и я покажу результаты

Примеры запросов:
• \`наушники TWS\`
• \`LED светильники\`
• \`станок лазерный\`
`;

  await ctx.replyWithMarkdown(
    searchMessage,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🔍 Открыть поиск', `${MINI_APP_URL}/search`)],
      [Markup.button.callback('📂 Выбрать категорию', 'action_categories')],
    ])
  );
});

// /orders - Мои заказы
bot.command('orders', async (ctx: Context) => {
  const ordersMessage = `
📦 *Мои заказы*

Здесь вы можете отслеживать статус ваших заказов.

Для просмотра всех заказов откройте приложение:
`;

  await ctx.replyWithMarkdown(
    ordersMessage,
    Markup.inlineKeyboard([
      [Markup.button.webApp('📦 Открыть заказы', `${MINI_APP_URL}/orders`)],
      [Markup.button.callback('◀️ Главное меню', 'action_back')],
    ])
  );
});

// /help - Помощь
bot.command('help', async (ctx: Context) => {
  const helpMessage = `
❓ *Помощь по VR Showroom*

*Доступные команды:*
/start — Главное меню
/search — Поиск товаров
/orders — Мои заказы
/help — Эта справка

*Как сделать заказ:*
1. Откройте приложение
2. Найдите нужный товар
3. Добавьте в корзину
4. Оформите заказ

*Контакты поддержки:*
📧 support@vrshowroom.ru
💬 @vrshowroom_support

*Время работы:*
Пн-Пт: 9:00 - 21:00 (МСК)
Сб-Вс: 10:00 - 18:00 (МСК)
`;

  await ctx.replyWithMarkdown(
    helpMessage,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🛍 Открыть приложение', MINI_APP_URL)],
      [Markup.button.callback('◀️ Главное меню', 'action_back')],
    ])
  );
});

// Callback: Поиск
bot.action('action_search', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    '🔍 *Поиск товаров*\n\nВведите название товара или откройте приложение:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🔍 Открыть поиск', `${MINI_APP_URL}/search`)],
        [Markup.button.callback('📂 Категории', 'action_categories')],
        [Markup.button.callback('◀️ Назад', 'action_back')],
      ]),
    }
  );
});

// Callback: Заказы
bot.action('action_orders', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    '📦 *Мои заказы*\n\nОткройте приложение для просмотра заказов:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('📦 Открыть заказы', `${MINI_APP_URL}/orders`)],
        [Markup.button.callback('◀️ Назад', 'action_back')],
      ]),
    }
  );
});

// Callback: Категории
bot.action('action_categories', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    '📂 *Выберите категорию:*',
    {
      parse_mode: 'Markdown',
      ...getCategoriesMenu(),
    }
  );
});

// Callback: Помощь
bot.action('action_help', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    '❓ *Помощь*\n\nИспользуйте /help для полной справки\n\nИли откройте приложение:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🛍 Открыть приложение', MINI_APP_URL)],
        [Markup.button.callback('◀️ Назад', 'action_back')],
      ]),
    }
  );
});

// Callback: Назад в главное меню
bot.action('action_back', async (ctx) => {
  await ctx.answerCbQuery();
  const firstName = ctx.from?.first_name || 'друг';
  
  await ctx.editMessageText(
    `🎉 *VR Showroom*\n\nПривет, ${firstName}! Выберите действие:`,
    {
      parse_mode: 'Markdown',
      ...getMainMenu(),
    }
  );
});

// Callback: Выбор категории
categories.forEach(category => {
  bot.action(category.callback, async (ctx) => {
    await ctx.answerCbQuery(`Открываю ${category.name}`);
    
    await ctx.editMessageText(
      `${category.name}\n\nОткройте приложение для просмотра товаров в этой категории:`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🛍 Смотреть товары', `${MINI_APP_URL}/catalog/${category.id}`)],
          [Markup.button.callback('📂 Другие категории', 'action_categories')],
          [Markup.button.callback('◀️ Главное меню', 'action_back')],
        ]),
      }
    );
  });
});

// Обработка текстовых сообщений - предлагаем категории или поиск
bot.on('text', async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  
  // Проверяем, похоже ли на поиск товара
  const searchKeywords = ['найти', 'ищу', 'нужен', 'хочу', 'купить', 'заказать'];
  const isSearchQuery = searchKeywords.some(keyword => text.includes(keyword)) || text.length > 3;
  
  if (isSearchQuery) {
    await ctx.reply(
      `🔍 Ищете: *${ctx.message.text}*?\n\nВыберите категорию или откройте поиск в приложении:`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🔍 Искать в приложении', `${MINI_APP_URL}/search?q=${encodeURIComponent(ctx.message.text)}`)],
          ...categories.slice(0, 3).map(cat => [Markup.button.callback(cat.name, cat.callback)]),
          [Markup.button.callback('📂 Все категории', 'action_categories')],
        ]),
      }
    );
  } else {
    await ctx.reply(
      'Выберите действие:',
      getMainMenu()
    );
  }
});

// Обработка данных из Mini App
bot.on('web_app_data', async (ctx) => {
  try {
    const data = JSON.parse(ctx.webAppData?.data || '{}');
    
    switch (data.action) {
      case 'order':
        await ctx.reply(
          `✅ *Заказ #${data.orderId} оформлен!*\n\n` +
          `📦 Товаров: ${data.items}\n` +
          `💰 Сумма: ${data.total}¥\n\n` +
          `Ожидайте подтверждения от менеджера.`,
          { parse_mode: 'Markdown' }
        );
        break;
        
      case 'contact_support':
        await ctx.reply(
          `📞 *Запрос в поддержку*\n\n` +
          `Пользователь @${data.username || 'unknown'} запросил помощь.\n` +
          `Менеджер свяжется с вами в ближайшее время.`,
          { parse_mode: 'Markdown' }
        );
        break;
        
      default:
        console.log('WebApp data received:', data);
    }
  } catch (error) {
    console.error('Error processing WebApp data:', error);
  }
});

// Обработка ошибок
bot.catch((err: Error, ctx: Context) => {
  console.error(`Error for ${ctx.updateType}:`, err);
});

// Запуск бота
const startBot = async () => {
  try {
    await bot.launch();
    console.log('');
    console.log('🤖 VR Showroom Bot запущен!');
    console.log(`📱 Mini App URL: ${MINI_APP_URL}`);
    console.log('');
    console.log('Доступные команды:');
    console.log('  /start  - Главное меню');
    console.log('  /search - Поиск товаров');
    console.log('  /orders - Мои заказы');
    console.log('  /help   - Помощь');
    console.log('');
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
